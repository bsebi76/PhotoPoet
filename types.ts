
export type PoemStyle = 'Free Verse' | 'Haiku' | 'Sonnet' | 'Limerick' | 'Ode';

export type VisualTheme = 'Serene' | 'Midnight' | 'Parchment' | 'Watercolor';

export interface PoemState {
  content: string;
  inspiration: string;
  isEditing: boolean;
  isGenerating: boolean;
  error: string | null;
}

export interface PoemResult {
  poem: string;
  inspiration: string;
}

export interface ImageData {
  base64: string;
  mimeType: string;
  previewUrl: string;
}

export interface SavedPoem {
  id: number;
  title?: string;
  poem: string;
  inspiration: string | null;
  image?: string;
  date: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  IMAGE_SELECTED = 'IMAGE_SELECTED',
  GENERATING = 'GENERATING',
  READY = 'READY',
  LIBRARY = 'LIBRARY'
}
