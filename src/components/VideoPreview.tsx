"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Play, Download, Edit3, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Player } from "@remotion/player";
import { useState, useEffect } from "react";

// Import compositions
import { CinematicComposition } from "@/remotion/compositions/CinematicComposition";
import { ModernComposition } from "@/remotion/compositions/ModernComposition";
import { CreativeComposition } from "@/remotion/compositions/CreativeComposition";

export default function VideoPreview() {
  const { selectedFiles, selectedStyle, setCurrentStep } = useAppStore();
  const [isPreviewReady, setIsPreviewReady] = useState(false);

  const handleBack = () => {
    setCurrentStep("style");
  };

  const handleGenerate = () => {
    setCurrentStep("download");
  };

  const handleEditStyle = () => {
    setCurrentStep("style");
  };

  // Auto-generate preview when component mounts
  useEffect(() => {
    if (selectedFiles.length > 0 && selectedStyle) {
      // Small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        setIsPreviewReady(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedFiles, selectedStyle]);

  // Get the appropriate composition component
  const getCompositionComponent = () => {
    if (!selectedStyle) return null;

    switch (selectedStyle.transitionType) {
      case "cinematic":
        return CinematicComposition;
      case "modern":
        return ModernComposition;
      case "creative":
        return CreativeComposition;
      default:
        return null;
    }
  };

  const CompositionComponent = getCompositionComponent();

  // Convert selected files to composition props
  const compositionProps = {
    mediaFiles: selectedFiles.map((file) => ({
      id: file.id,
      url: file.url,
      type: file.type,
    })),
    durationInFrames: 300,
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
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
            <span className="hidden sm:inline">Back to Styles</span>
          </button>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-video-primary via-video-secondary to-video-accent text-center"
          >
            Preview Your Video
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
            <button
              onClick={handleEditStyle}
              className="flex items-center space-x-2 px-4 py-2 border-2 border-white/30 rounded-full text-white hover:bg-white/10 transition-colors duration-200 mt-4 sm:mt-0"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Style</span>
            </button>
          </div>
        </motion.div>

        {/* Video Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden relative group">
            {isPreviewReady && CompositionComponent ? (
              <Player
                component={CompositionComponent}
                inputProps={compositionProps}
                durationInFrames={300}
                fps={30}
                compositionWidth={1920}
                compositionHeight={1080}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                controls
                loop
                autoPlay
                className="rounded-xl"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-video-primary/20 flex items-center justify-center"
                  >
                    <Sparkles className="w-8 h-8 text-video-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Generating Preview...
                  </h3>
                  <p className="text-white/70 mb-4">
                    Creating {selectedStyle?.name} style preview
                  </p>
                  <div className="text-sm text-white/50">
                    This may take a few seconds
                  </div>
                </div>
              </div>
            )}

            {/* Style-specific background effect */}
            {selectedStyle?.transitionType === "cinematic" && (
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 via-orange-500/10 to-red-600/10" />
            )}
            {selectedStyle?.transitionType === "modern" && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800/20 via-gray-700/20 to-gray-600/20" />
            )}
            {selectedStyle?.transitionType === "creative" && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-teal-500/10 to-cyan-600/10" />
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <button
            onClick={handleGenerate}
            className="flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-video-primary to-video-secondary rounded-full text-white font-medium hover:scale-105 transition-transform duration-200 shadow-lg shadow-video-primary/25"
          >
            <Sparkles className="w-5 h-5" />
            <span>Create Reel & Download</span>
          </button>

          <button
            onClick={handleEditStyle}
            className="flex items-center justify-center space-x-3 px-8 py-4 border-2 border-white/30 rounded-full text-white font-medium hover:bg-white/10 transition-colors duration-200"
          >
            <Edit3 className="w-5 h-5" />
            <span>Change Style</span>
          </button>
        </motion.div>

        {/* Source Media Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">
            Source Media ({selectedFiles.length})
          </h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {selectedFiles.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="aspect-square rounded-lg overflow-hidden bg-gray-800 relative group cursor-pointer"
              >
                {file.type === "image" ? (
                  <img
                    src={file.url}
                    alt="Source"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <video
                    src={file.url}
                    className="w-full h-full object-cover"
                    muted
                  />
                )}
                {file.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-6 h-6 text-video-primary" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
