"use client";

import { useAppStore } from "@/store/useAppStore";
import HomePage from "./HomePage";
import FileUpload from "./FileUpload";
import StyleSelection from "@/components/StyleSelection";
import StateDebugger from "./StateDebugger";
import VideoPreview from "./VideoPreview";
import VideoDownload from "./VideoDownload";

export default function App() {
  const { currentStep } = useAppStore();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "home":
        return <HomePage />;
      case "upload":
        return <FileUpload />;
      case "style":
        return <StyleSelection />;
      case "preview":
        return <VideoPreview />;
      case "download":
        return <VideoDownload />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderCurrentStep()}
      <StateDebugger />
    </div>
  );
}
