"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Play, Sparkles, Zap, Film } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { VideoStyle } from "@/types";

const videoStyles: VideoStyle[] = [
  {
    id: "cinematic",
    name: "Cinematic",
    description:
      "Epic transitions with dramatic fades, zoom effects, and film-like color grading. Perfect for storytelling and emotional content.",
    preview: "cinematic-preview.gif",
    transitionType: "cinematic",
  },
  {
    id: "modern",
    name: "Modern",
    description:
      "Clean, sharp transitions with geometric shapes, smooth slides, and contemporary effects. Ideal for tech and business content.",
    preview: "modern-preview.gif",
    transitionType: "modern",
  },
  {
    id: "creative",
    name: "Creative",
    description:
      "Artistic transitions with liquid morphing, particle effects, and vibrant colors. Great for artistic and fun content.",
    preview: "creative-preview.gif",
    transitionType: "creative",
  },
];

export default function StyleSelection() {
  const { selectedFiles, selectedStyle, setSelectedStyle, setCurrentStep } =
    useAppStore();

  const handleBack = () => {
    setCurrentStep("upload");
  };

  const handleStyleSelect = (style: VideoStyle) => {
    setSelectedStyle(style);
  };

  const handleContinue = () => {
    if (selectedStyle) {
      setCurrentStep("preview");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
            Choose Your Style
          </h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </motion.div>

        {/* Selected Files Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-center"
        >
          <p className="text-white/70">
            Creating video from{" "}
            <span className="text-video-primary font-semibold">
              {selectedFiles.length} files
            </span>
          </p>
        </motion.div>

        {/* Style Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8"
        >
          {videoStyles.map((style, index) => (
            <motion.div
              key={style.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`
                relative group cursor-pointer rounded-2xl overflow-hidden glass
                transition-all duration-300 transform hover:scale-105
                ${
                  selectedStyle?.id === style.id
                    ? "ring-2 ring-video-primary shadow-2xl shadow-video-primary/25"
                    : "hover:shadow-xl"
                }
              `}
              onClick={() => handleStyleSelect(style)}
            >
              {/* Preview Area */}
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
                {/* Animated Preview Background */}
                <div className="absolute inset-0">
                  {style.transitionType === "cinematic" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-orange-500/20 to-red-600/20">
                      <motion.div
                        animate={{
                          x: ["-100%", "100%"],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      />
                    </div>
                  )}

                  {style.transitionType === "modern" && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-cyan-500/20 to-teal-600/20">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 90, 180],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/20"
                      />
                    </div>
                  )}

                  {style.transitionType === "creative" && (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-violet-600/20">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [0, -50, 0],
                            x: [0, Math.sin(i) * 30, 0],
                            opacity: [0.3, 1, 0.3],
                          }}
                          transition={{
                            duration: 2 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                          className="absolute w-4 h-4 bg-white/30 rounded-full"
                          style={{
                            left: `${20 + i * 15}%`,
                            top: `${30 + (i % 2) * 40}%`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Style Icon */}
                <div className="absolute top-4 left-4">
                  <div className="p-2 rounded-lg bg-black/30 backdrop-blur-sm">
                    {style.transitionType === "cinematic" && (
                      <Film className="w-6 h-6 text-amber-400" />
                    )}
                    {style.transitionType === "modern" && (
                      <Zap className="w-6 h-6 text-cyan-400" />
                    )}
                    {style.transitionType === "creative" && (
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    )}
                  </div>
                </div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-300"
                  >
                    <Play className="w-8 h-8 text-white" />
                  </motion.div>
                </div>

                {/* Selection Indicator */}
                {selectedStyle?.id === style.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 p-2 rounded-full bg-video-primary text-white"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                    >
                      ✓
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  {style.name}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {style.description}
                </p>

                {/* Features */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {style.transitionType === "cinematic" && (
                    <>
                      <span className="px-2 py-1 text-xs bg-amber-500/20 text-amber-300 rounded-full">
                        Dramatic
                      </span>
                      <span className="px-2 py-1 text-xs bg-orange-500/20 text-orange-300 rounded-full">
                        Film-like
                      </span>
                    </>
                  )}
                  {style.transitionType === "modern" && (
                    <>
                      <span className="px-2 py-1 text-xs bg-cyan-500/20 text-cyan-300 rounded-full">
                        Clean
                      </span>
                      <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded-full">
                        Professional
                      </span>
                    </>
                  )}
                  {style.transitionType === "creative" && (
                    <>
                      <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">
                        Artistic
                      </span>
                      <span className="px-2 py-1 text-xs bg-pink-500/20 text-pink-300 rounded-full">
                        Dynamic
                      </span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Continue Button */}
        {selectedStyle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <button
              onClick={handleContinue}
              className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-video-primary to-video-secondary rounded-full text-white font-semibold text-lg shadow-2xl hover:shadow-video-primary/25 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <span>Create Video</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>
        )}

        {/* Help Text */}
        {!selectedStyle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-white/60 text-sm"
          >
            <p>Select a style to preview how your video will look</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
