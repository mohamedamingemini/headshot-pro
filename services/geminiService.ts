
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { PortfolioData } from "../types";

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
const SAFETY_SETTINGS = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
];

const retryOperation = async <T>(
  operation: () => Promise<T>,
  retries: number = 2,
  baseDelay: number = 3000
): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    const errorCode = error?.status || error?.code || error?.error?.code;
    const errorMessage = error?.message || error?.error?.message || JSON.stringify(error);
    const errorStatus = error?.status || error?.error?.status;

    const isRateLimit = 
      errorCode === 429 || 
      errorMessage?.includes('429') || 
      errorMessage?.includes('quota') ||
      errorMessage?.includes('limit') ||
      errorStatus === 'RESOURCE_EXHAUSTED' ||
      errorMessage?.includes('exhausted');

    if (retries > 0 && isRateLimit) {
      console.warn(`Rate limit hit. Retrying in ${baseDelay}ms... (${retries} retries left)`);
      await wait(baseDelay);
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
    throw new Error("API Key is missing. If you are on Vercel, please add 'API_KEY' to your Project Settings > Environment Variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const mimeType = getMimeType(originalImageBase64);
  const cleanBase64 = originalImageBase64.replace(/^data:image\/(png|jpeg|jpg|webp|image\/webp);base64,/, '');

  try {
    // Corrected safetySettings placement: in the @google/genai SDK, safetySettings belongs inside the config object.
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
            text: `Transform this image into a professional headshot. ${stylePrompt}. High resolution, photorealistic, 4k. Maintain the person's identity but improve lighting and background.`
          },
        ],
      },
      config: {
        safetySettings: SAFETY_SETTINGS as any,
      },
    }));

    if (!response.candidates || response.candidates.length === 0) {
        throw new Error("No candidates returned from the model.");
    }

    const candidate = response.candidates[0];
    if (candidate.finishReason === 'SAFETY') {
        throw new Error("Image generation was flagged by safety filters. Please try a different photo.");
    }

    let generatedImageBase64 = '';
    if (candidate.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.data) {
          generatedImageBase64 = part.inlineData.data;
          break;
        }
      }
    }

    if (!generatedImageBase64) {
      throw new Error("No image data found in response.");
    }

    return `data:image/jpeg;base64,${generatedImageBase64}`;

  } catch (error: any) {
    const msg = error?.message || error?.error?.message || "Unknown error";
    
    if (msg.includes('quota') || msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('exhausted')) {
        throw new Error("Free Tier limit reached. The AI is temporarily busy. Please wait 60 seconds and try again.");
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
  
  for (let i = 0; i < count; i++) {
    try {
      if (i > 0) await wait(2000); 
      const result = await generateHeadshot(originalImageBase64, stylePrompt);
      results.push(result);
    } catch (err: any) {
      console.warn("One variation failed:", err);
      lastError = err;
    }
  }

  if (results.length === 0) {
    throw lastError || new Error("Failed to generate variations.");
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
  const cleanBase64 = currentImageBase64.replace(/^data:image\/(png|jpeg|jpg|webp|image\/webp);base64,/, '');

  try {
    // Corrected safetySettings placement: in the @google/genai SDK, safetySettings belongs inside the config object.
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
        safetySettings: SAFETY_SETTINGS as any,
      },
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
    const msg = error?.message || error?.error?.message || "Unknown error";
    if (msg.includes('quota') || msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('exhausted')) {
        throw new Error("The AI editor is temporarily busy. Please wait 30 seconds and try again.");
    }
    throw error;
  }
};

export const generateArticleTags = async (
  content: string
): Promise<string[]> => {
  if (!process.env.API_KEY) return [];
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model: TEXT_MODEL_NAME,
      contents: `Generate 5 SEO tags for this article: ${content.substring(0, 1000)}`,
    }));
    // Extract text directly from property .text
    const text = response.text;
    if (!text) return [];
    return text.split(',').map(tag => tag.trim().toLowerCase());
  } catch (error) {
    return [];
  }
};

export const parseCV = async (cvText: string): Promise<PortfolioData> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      title: { type: Type.STRING },
      summary: { type: Type.STRING },
      skills: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            level: { type: Type.NUMBER, description: "Skill level from 0 to 100" }
          },
          required: ["name", "level"]
        }
      },
      experience: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            company: { type: Type.STRING },
            role: { type: Type.STRING },
            period: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["company", "role", "period", "description"]
        }
      },
      education: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            school: { type: Type.STRING },
            degree: { type: Type.STRING },
            year: { type: Type.STRING }
          },
          required: ["school", "degree", "year"]
        }
      },
      projects: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            tech: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["name", "description", "tech"]
        }
      }
    },
    required: ["name", "title", "summary", "skills", "experience", "education", "projects"]
  };

  try {
    const response = await retryOperation<GenerateContentResponse>(() => ai.models.generateContent({
      model: TEXT_MODEL_NAME,
      contents: `Parse the following CV into a structured JSON format for a portfolio. Be creative with skill levels (0-100) based on experience. CV Text: ${cvText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema as any
      }
    }));

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("CV Parsing failed:", error);
    throw error;
  }
};
