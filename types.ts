
export interface HeadshotStyle {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  promptModifier: string;
  thumbnail: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  image?: string; // Base64 string
  timestamp: number;
}

export type AppState = 'upload' | 'cropping' | 'style-selection' | 'generating' | 'result' | 'privacy' | 'terms';
