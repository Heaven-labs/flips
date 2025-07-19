export interface MediaFile {
  id: string;
  file: File;
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  duration?: number; // for videos
}

export interface VideoStyle {
  id: string;
  name: string;
  description: string;
  preview: string;
  transitionType: "cinematic" | "modern" | "creative";
}

export interface GeneratedVideo {
  id: string;
  styleId: string;
  videoUrl: string;
  thumbnail: string;
  duration: number;
  generatedAt: Date;
}

export interface AppState {
  currentStep: "home" | "upload" | "style" | "preview" | "download";
  selectedFiles: MediaFile[];
  selectedStyle?: VideoStyle;
  generatedVideos: GeneratedVideo[];
  isGenerating: boolean;
  error?: string;
}
