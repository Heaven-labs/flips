import { registerRoot } from "remotion";

export interface VideoCompositionProps {
  mediaFiles: Array<{
    id: string;
    url: string;
    type: "image" | "video";
  }>;
  durationInFrames: number;
}

// Placeholder compositions - will be replaced with actual components
export const compositions = [
  {
    id: "cinematic",
    durationInFrames: 300, // 10 seconds at 30fps
    fps: 30,
    width: 1920,
    height: 1080,
  },
  {
    id: "modern",
    durationInFrames: 300,
    fps: 30,
    width: 1920,
    height: 1080,
  },
  {
    id: "creative",
    durationInFrames: 300,
    fps: 30,
    width: 1920,
    height: 1080,
  },
];

registerRoot(() => {
  return null; // Will be updated with actual compositions
});
