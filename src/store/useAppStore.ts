import { create } from "zustand";
import { AppState, MediaFile, VideoStyle, GeneratedVideo } from "@/types";

interface AppStore extends AppState {
  // Actions
  setCurrentStep: (step: AppState["currentStep"]) => void;
  addSelectedFile: (file: MediaFile) => void;
  removeSelectedFile: (fileId: string) => void;
  clearSelectedFiles: () => void;
  setSelectedStyle: (style: VideoStyle) => void;
  addGeneratedVideo: (video: GeneratedVideo) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error?: string) => void;
  resetApp: () => void;
}

const initialState: AppState = {
  currentStep: "home",
  selectedFiles: [],
  selectedStyle: undefined,
  generatedVideos: [],
  isGenerating: false,
  error: undefined,
};

export const useAppStore = create<AppStore>((set, get) => ({
  ...initialState,

  setCurrentStep: (step) => set({ currentStep: step }),

  addSelectedFile: (file) =>
    set((state) => ({
      selectedFiles: [...state.selectedFiles, file],
    })),

  removeSelectedFile: (fileId) =>
    set((state) => ({
      selectedFiles: state.selectedFiles.filter((f) => f.id !== fileId),
    })),

  clearSelectedFiles: () => set({ selectedFiles: [] }),

  setSelectedStyle: (style) => set({ selectedStyle: style }),

  addGeneratedVideo: (video) =>
    set((state) => ({
      generatedVideos: [...state.generatedVideos, video],
    })),

  setIsGenerating: (isGenerating) => set({ isGenerating }),

  setError: (error) => set({ error }),

  resetApp: () => set({ ...initialState }),
}));
