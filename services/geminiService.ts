
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Using the specified Nano banana powered model for images
const MODEL_NAME = 'gemini-2.5-flash-image';
// Using the specified text model for basic text tasks
const TEXT_MODEL_NAME = 'gemini-3-flash-preview';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to extract mime type from base64 string
const getMimeType = (base64: string) => {
  const match = base64.match(/^data:(image\/[a-zA-Z+]+);base64,/);
  return match ? match[1] : 'image/jpeg';
};

// Define safety settings to prevent false positives on headshots
// We use 'BLOCK_ONLY_HIGH' to allow normal portraits while still blocking harmful content
const SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
];

const retryOperation = async <T>(
  operation: () => Promise<T>,
  retries: number = 3,
  baseDelay: number = 2000
): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    // Check for rate limit error (429) or Resource Exhausted
    const errorCode = error?.status || error?.code || error?.error?.code;
    const errorMessage = error?.message || error?.error?.message || JSON.stringify(error);
    const errorStatus = error?.status || error?.error?.status;

    const isRateLimit = 
      errorCode === 429 || 
      errorMessage?.includes('429') || 
      errorMessage?.includes('quota') ||
      errorMessage?.includes('limit') ||
      errorStatus === 'RESOURCE_EXHAUSTED';

    if (retries > 0 && isRateLimit) {
      console.warn(`Rate limit hit. Retrying in ${baseDelay}ms... (${retries} retries left)`);
      await wait(baseDelay);
      // Exponential backoff with jitter
      const nextDelay = baseDelay * 2 + Math.random() * 1000;
      return retryOperation(operation, retries - 1, nextDelay);
    }
    
    throw error;
  }
};

export const generateHeadshot = async (
  originalImageBase64: string,
  stylePrompt: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Detect mime type before cleaning
  const mimeType = getMimeType(originalImageBase64);

  // Clean the base64 string if it contains the data URL prefix
  const cleanBase64 = originalImageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  try {
    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType, 
            },
          },
          {
            text: `Transform this image into a professional headshot. ${stylePrompt}. High resolution, photorealistic, 4k. Ensure balanced facial symmetry and correct lens distortion. Maintain the person's identity but improve lighting and background.`
          },
        ],
      },
      config: {
        // @ts-ignore - Type definition might vary but API supports strings
        safetySettings: SAFETY_SETTINGS,
      }
    }));

    // Check for safety blocking if no candidates
    if (!response.candidates || response.candidates.length === 0) {
        if (response.promptFeedback?.blockReason) {
            throw new Error(`Generation blocked by safety settings: ${response.promptFeedback.blockReason}`);
        }
        throw new Error("No candidates returned from the model.");
    }

    const candidate = response.candidates[0];
    
    // Check finish reason
    if (candidate.finishReason !== 'STOP' && candidate.finishReason !== undefined) {
         // SAFETY, RECITATION, etc.
         if (candidate.finishReason === 'SAFETY') {
             throw new Error("Image generation was flagged by safety filters. Please try a different photo or style.");
         }
    }

    let generatedImageBase64 = '';

    if (candidate.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.data) {
          generatedImageBase64 = part.inlineData.data;
          break; // Found the image
        }
      }
    }

    if (!generatedImageBase64) {
      // Sometimes the model returns text instead of image explaining why it couldn't generate
      const textPart = candidate.content?.parts?.find(p => p.text)?.text;
      if (textPart) {
        console.warn("Model returned text instead of image:", textPart);
        throw new Error("Model declined to generate image. Try a different photo.");
      }
      throw new Error("No image data found in response.");
    }

    return `data:image/jpeg;base64,${generatedImageBase64}`;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    const msg = error?.message || error?.error?.message || "Unknown error";
    
    if (msg.includes('quota') || msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
        throw new Error("Server is busy (quota exceeded). Please wait a minute and try again.");
    }
    
    if (msg.includes('SAFETY') || msg.includes('blocked')) {
        throw new Error("Safety filters blocked this request. Try a different photo.");
    }

    throw error;
  }
};

export const generateHeadshotVariations = async (
  originalImageBase64: string,
  stylePrompt: string,
  count: number = 4
): Promise<string[]> => {
  const results: string[] = [];
  let lastError: Error | null = null;
  
  // Batch size of 1 means sequential execution which is safest for strict quotas
  const batchSize = 1;
  
  for (let i = 0; i < count; i += batchSize) {
    const batchPromises = [];
    
    for (let j = 0; j < batchSize && i + j < count; j++) {
       batchPromises.push(async () => {
         if (i + j > 0) await wait(1500); 
         return generateHeadshot(originalImageBase64, stylePrompt);
       });
    }

    const batchResults = await Promise.allSettled(batchPromises.map(p => p()));
    
    batchResults.forEach(result => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
         console.warn("One variation failed:", result.reason);
         lastError = result.reason as Error;
      }
    });
  }

  if (results.length === 0) {
    // Throw the actual error from the API instead of a generic message
    throw lastError || new Error("System is busy. Please try generating fewer variations or wait a moment.");
  }

  return results;
};

export const editHeadshot = async (
  currentImageBase64: string,
  editPrompt: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const mimeType = getMimeType(currentImageBase64);
  const cleanBase64 = currentImageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  try {
    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          {
            text: `Edit this image: ${editPrompt}. Maintain high quality and photorealism.`
          },
        ],
      },
      config: {
        // @ts-ignore
        safetySettings: SAFETY_SETTINGS,
      }
    }));

    let generatedImageBase64 = '';

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          generatedImageBase64 = part.inlineData.data;
          break;
        }
      }
    }

    if (!generatedImageBase64) {
      throw new Error("No image generated by the model during edit.");
    }

    return `data:image/jpeg;base64,${generatedImageBase64}`;

  } catch (error: any) {
    console.error("Gemini API Edit Error:", error);
    const msg = error?.message || error?.error?.message || "Unknown error";
    if (msg.includes('quota') || msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
        throw new Error("Server is busy (quota exceeded). Please try again later.");
    }
    throw error;
  }
};

export const generateArticleTags = async (
  content: string
): Promise<string[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model: TEXT_MODEL_NAME,
      contents: `Analyze the following article content and generate 5 to 7 relevant, short, single-word or two-word tags (keywords) for SEO. Return ONLY the tags separated by commas. Do not number them.
      
      Content: ${content.substring(0, 3000)}`, // Limit content length for token saving
    }));

    const text = response.text;
    if (!text) return [];

    // Split by comma, trim whitespace, remove empty strings, and lowercase
    const tags = text.split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0 && tag.length < 20); // Basic validation

    return tags;

  } catch (error) {
    console.error("Gemini Tag Generation Error:", error);
    return [];
  }
};
