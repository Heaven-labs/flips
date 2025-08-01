"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Download,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Play,
  Home,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useEffect, useState } from "react";

interface GenerationStage {
  id: string;
  name: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "error";
  progress: number;
}

export default function VideoDownload() {
  const {
    selectedFiles,
    selectedStyle,
    generatedVideos,
    addGeneratedVideo,
    setIsGenerating,
    setCurrentStep,
  } = useAppStore();

  const [generationStages, setGenerationStages] = useState<GenerationStage[]>([
    {
      id: "analyze",
      name: "Analyzing Media",
      description: "Processing your images and videos...",
      status: "pending",
      progress: 0,
    },
    {
      id: "compose",
      name: "Creating Composition",
      description: "Building video timeline with transitions...",
      status: "pending",
      progress: 0,
    },
    {
      id: "render",
      name: "Rendering Video",
      description: "Generating high-quality output...",
      status: "pending",
      progress: 0,
    },
    {
      id: "finalize",
      name: "Finalizing",
      description: "Preparing your video for download...",
      status: "pending",
      progress: 0,
    },
  ]);
  const [isGeneratingLocal, setIsGeneratingLocal] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedStyle && selectedFiles.length > 0) {
      // Auto-start generation
      startGeneration();
    }
  }, [selectedStyle, selectedFiles]);

  const startGeneration = async () => {
    setIsGeneratingLocal(true);
    setIsGenerating(true);
    setError(null);

    try {
      // Simulate the generation process
      for (let i = 0; i < generationStages.length; i++) {
        const stage = generationStages[i];

        // Start this stage
        setGenerationStages((prev) =>
          prev.map((s) =>
            s.id === stage.id ? { ...s, status: "in_progress" as const } : s
          )
        );

        // Simulate progress
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          setGenerationStages((prev) =>
            prev.map((s) => (s.id === stage.id ? { ...s, progress } : s))
          );
        }

        // Complete this stage
        setGenerationStages((prev) =>
          prev.map((s) =>
            s.id === stage.id
              ? { ...s, status: "completed" as const, progress: 100 }
              : s
          )
        );
      }

      // Generation complete
      const mockVideoUrl = "/generated/sample-video.mp4";
      setGeneratedVideoUrl(mockVideoUrl);

      // Add to store
      const newVideo = {
        id: Date.now().toString(),
        styleId: selectedStyle!.id,
        videoUrl: mockVideoUrl,
        thumbnail: "/generated/sample-thumbnail.jpg",
        duration: 10,
        generatedAt: new Date(),
      };

      addGeneratedVideo(newVideo);
    } catch (err) {
      console.error("Generation error:", err);
      setError("Failed to generate video. Please try again.");

      // Mark current stage as error
      setGenerationStages((prev) =>
        prev.map((s) =>
          s.status === "in_progress" ? { ...s, status: "error" as const } : s
        )
      );
    } finally {
      setIsGeneratingLocal(false);
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    setCurrentStep("preview");
  };

  const handleDownload = () => {
    if (generatedVideoUrl) {
      // In a real app, this would trigger an actual download
      const link = document.createElement("a");
      link.href = generatedVideoUrl;
      link.download = `flips-video-${selectedStyle?.name.toLowerCase()}-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCreateAnother = () => {
    setCurrentStep("home");
  };

  const handleRegenerate = () => {
    setError(null);
    setGeneratedVideoUrl(null);
    setGenerationStages((prev) =>
      prev.map((s) => ({
        ...s,
        status: "pending" as const,
        progress: 0,
      }))
    );
    startGeneration();
  };

  const currentStage =
    generationStages.find((s) => s.status === "in_progress") ||
    generationStages.find((s) => s.status === "error") ||
    generationStages[generationStages.length - 1];

  const overallProgress =
    generationStages.reduce((acc, stage) => acc + stage.progress, 0) /
    generationStages.length;

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Preview</span>
          </button>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-video-primary via-video-secondary to-video-accent text-center"
          >
            {generatedVideoUrl ? "Video Ready!" : "Generating Video..."}
          </motion.h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </motion.div>

        {/* Video Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {selectedStyle?.name} Style
              </h3>
              <p className="text-white/70">
                {selectedFiles.length} media files • ~10 seconds duration
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-video-primary animate-pulse"></div>
                <span className="text-white text-sm">
                  {Math.round(overallProgress)}% Complete
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-2xl p-6 mb-8 border-2 border-red-500/50"
            >
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-semibold text-white">
                  Generation Failed
                </h3>
              </div>
              <p className="text-white/70 mb-4">{error}</p>
              <button
                onClick={handleRegenerate}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-video-primary to-video-secondary rounded-full text-white font-medium hover:scale-105 transition-transform duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generation Progress */}
        {!error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <div className="space-y-6">
              {generationStages.map((stage, index) => (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className="flex-shrink-0">
                    {stage.status === "completed" ? (
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    ) : stage.status === "error" ? (
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    ) : stage.status === "in_progress" ? (
                      <div className="w-6 h-6 border-2 border-video-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-600 rounded-full" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-white">{stage.name}</h4>
                      <span className="text-sm text-white/60">
                        {stage.progress}%
                      </span>
                    </div>
                    <p className="text-sm text-white/70 mb-2">
                      {stage.description}
                    </p>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-video-primary to-video-secondary h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${stage.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Generated Video Preview */}
        <AnimatePresence>
          {generatedVideoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-2xl p-6 mb-8"
            >
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden relative group mb-6">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Video Generated Successfully!
                    </h3>
                    <p className="text-white/70">
                      Your {selectedStyle?.name} style video is ready
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-video-primary to-video-secondary rounded-full text-white font-medium hover:scale-105 transition-transform duration-200 shadow-lg shadow-video-primary/25"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Video</span>
                </button>

                <button
                  onClick={handleCreateAnother}
                  className="flex items-center justify-center space-x-3 px-8 py-4 border-2 border-white/30 rounded-full text-white font-medium hover:bg-white/10 transition-colors duration-200"
                >
                  <Home className="w-5 h-5" />
                  <span>Create Another</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Stage Info */}
        {!error && !generatedVideoUrl && currentStage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                {currentStage.name}
              </h3>
              <p className="text-white/70">{currentStage.description}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
