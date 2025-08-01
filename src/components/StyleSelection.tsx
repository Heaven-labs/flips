"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Sparkles,
  Zap,
  Film,
  Check,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { VideoStyle } from "@/types";
import { useState, useEffect, useCallback } from "react";

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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragDirection, setDragDirection] = useState<"up" | "down" | null>(
    null
  );
  const [isClient, setIsClient] = useState(false);
  const [filmGrainParticles, setFilmGrainParticles] = useState<
    Array<{
      left: number;
      top: number;
      duration: number;
      delay: number;
    }>
  >([]);
  const [floatingParticles, setFloatingParticles] = useState<
    Array<{
      left: number;
      top: number;
    }>
  >([]);

  const handleBack = () => {
    setCurrentStep("upload");
  };

  const handleStyleSelect = useCallback(
    (style: VideoStyle) => {
      setSelectedStyle(style);
    },
    [setSelectedStyle]
  );

  const handleContinue = () => {
    if (selectedStyle) {
      setCurrentStep("preview");
    }
  };

  // Navigation functions
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videoStyles.length);
  };

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + videoStyles.length) % videoStyles.length
    );
  };

  // Handle drag gestures for mobile
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const threshold = 50;
    if (info.offset.y > threshold) {
      goToPrevious();
      setDragDirection("down");
    } else if (info.offset.y < -threshold) {
      goToNext();
      setDragDirection("up");
    }
    setTimeout(() => setDragDirection(null), 300);
  };

  // Handle keyboard navigation for desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleStyleSelect(videoStyles[currentIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, handleStyleSelect]);

  // Handle wheel events for desktop
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    };

    const container = document.getElementById("style-container");
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, []);

  // Generate random particles on client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);

    // Generate film grain particles
    const grainParticles = Array.from({ length: 50 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 2,
    }));
    setFilmGrainParticles(grainParticles);

    // Generate floating particles
    const floatParticles = Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
    }));
    setFloatingParticles(floatParticles);
  }, []);

  const renderReelsContent = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentIndex}
        initial={{
          y:
            dragDirection === "up"
              ? "100%"
              : dragDirection === "down"
              ? "-100%"
              : 0,
          opacity: 0,
        }}
        animate={{ y: 0, opacity: 1 }}
        exit={{
          y:
            dragDirection === "up"
              ? "-100%"
              : dragDirection === "down"
              ? "100%"
              : 0,
          opacity: 0,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="absolute inset-0"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
      >
        {/* Current Style */}
        <div className="relative w-full h-full">
          {/* Background Preview */}
          <div className="absolute inset-0">
            {videoStyles[currentIndex].transitionType === "cinematic" && (
              <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-900 to-red-900">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 2, -2, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-orange-500/30 to-red-600/20"
                />

                {/* Film grain effect */}
                {isClient && (
                  <div className="absolute inset-0 opacity-20">
                    {filmGrainParticles.map((particle, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          opacity: [0.1, 0.8, 0.1],
                          scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                          duration: particle.duration,
                          repeat: Infinity,
                          delay: particle.delay,
                        }}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          left: `${particle.left}%`,
                          top: `${particle.top}%`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {videoStyles[currentIndex].transitionType === "modern" && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900">
                <motion.div
                  animate={{
                    background: [
                      "linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(34, 197, 94, 0.3))",
                      "linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(168, 85, 247, 0.3))",
                      "linear-gradient(225deg, rgba(168, 85, 247, 0.3), rgba(59, 130, 246, 0.3))",
                    ],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0"
                />

                {/* Geometric shapes */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 4 + i,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute border border-white/10"
                    style={{
                      width: `${40 + i * 20}px`,
                      height: `${40 + i * 20}px`,
                      left: `${20 + (i % 3) * 30}%`,
                      top: `${20 + Math.floor(i / 3) * 25}%`,
                    }}
                  />
                ))}
              </div>
            )}

            {videoStyles[currentIndex].transitionType === "creative" && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                <motion.div
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 20%, rgba(168, 85, 247, 0.2), transparent 50%)",
                      "radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.2), transparent 50%)",
                      "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.2), transparent 50%)",
                    ],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0"
                />

                {/* Floating particles */}
                {isClient &&
                  floatingParticles.map((particle, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [0, -100, 0],
                        x: [0, Math.sin(i) * 100, 0],
                        opacity: [0.2, 1, 0.2],
                        scale: [0.5, 1.5, 0.5],
                      }}
                      transition={{
                        duration: 3 + i * 0.2,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut",
                      }}
                      className="absolute w-3 h-3 bg-white/40 rounded-full"
                      style={{
                        left: `${particle.left}%`,
                        top: `${particle.top}%`,
                      }}
                    />
                  ))}
              </div>
            )}
          </div>

          {/* Style Info - Top Section with Higher Z-Index */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute top-16 left-0 right-0 z-60 p-6 bg-black/70 backdrop-blur-md"
          >
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {videoStyles[currentIndex].name}
              </h2>
              <p className="text-white/90 text-sm sm:text-base max-w-md leading-relaxed">
                {videoStyles[currentIndex].description}
              </p>

              {/* Features */}
              <div className="flex flex-wrap gap-2">
                {videoStyles[currentIndex].transitionType === "cinematic" && (
                  <>
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm font-medium">
                      Dramatic
                    </span>
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm font-medium">
                      Film-like
                    </span>
                  </>
                )}
                {videoStyles[currentIndex].transitionType === "modern" && (
                  <>
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-medium">
                      Clean
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                      Professional
                    </span>
                  </>
                )}
                {videoStyles[currentIndex].transitionType === "creative" && (
                  <>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">
                      Artistic
                    </span>
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm font-medium">
                      Dynamic
                    </span>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Style Icon - Center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-8 rounded-full bg-white/10 backdrop-blur-lg border border-white/20"
            >
              {videoStyles[currentIndex].transitionType === "cinematic" && (
                <Film className="w-16 h-16 text-amber-400" />
              )}
              {videoStyles[currentIndex].transitionType === "modern" && (
                <Zap className="w-16 h-16 text-cyan-400" />
              )}
              {videoStyles[currentIndex].transitionType === "creative" && (
                <Sparkles className="w-16 h-16 text-purple-400" />
              )}
            </motion.div>
          </div>

          {/* Selection Button */}
          <div className="absolute bottom-6 right-6 z-50">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStyleSelect(videoStyles[currentIndex])}
              className={`
                p-4 rounded-full transition-all duration-300 backdrop-blur-lg border
                ${
                  selectedStyle?.id === videoStyles[currentIndex].id
                    ? "bg-video-primary border-video-primary text-white shadow-lg shadow-video-primary/25"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }
              `}
            >
              {selectedStyle?.id === videoStyles[currentIndex].id ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  <Check className="w-6 h-6" />
                </motion.div>
              ) : (
                <Play className="w-6 h-6" />
              )}
            </motion.button>
          </div>

          {/* Selection Effect */}
          {selectedStyle?.id === videoStyles[currentIndex].id && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 bg-video-primary/10 border-4 border-video-primary pointer-events-none"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-video-primary/20 to-transparent"
              />
            </motion.div>
          )}

          {/* Continue Button */}
          {selectedStyle && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-60"
            >
              <button
                onClick={handleContinue}
                className="group flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-video-primary to-video-secondary rounded-full text-white font-semibold shadow-2xl hover:shadow-video-primary/25 transition-all duration-300 transform hover:scale-105 active:scale-95 backdrop-blur-lg"
              >
                <span>Create Video</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Desktop Layout */}
      <div className="hidden sm:flex min-h-screen items-center justify-center p-8 bg-gray-900">
        {/* Desktop Header */}
        <div className="absolute top-0 left-0 right-0 z-50 p-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
              <span>Back</span>
            </button>

            <div className="text-center">
              <h1 className="text-xl font-bold text-white">Choose Style</h1>
              <p className="text-sm text-white/60 mt-1">
                {selectedFiles.length} files • {currentIndex + 1}/
                {videoStyles.length}
              </p>
            </div>

            <div className="w-20" />
          </div>
        </div>

        {/* iPhone 15 Pro Max Frame */}
        <div className="relative">
          {/* Phone Frame */}
          <div className="relative w-[430px] h-[932px] bg-black rounded-[60px] p-2 shadow-2xl border-8 border-gray-700">
            {/* Dynamic Island */}
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-50"></div>

            {/* Screen */}
            <div
              id="style-container"
              className="relative w-full h-full bg-black rounded-[50px] overflow-hidden"
            >
              {/* Style Indicator Dots */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-50 flex space-x-2">
                {videoStyles.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex ? "bg-white" : "bg-white/30"
                    }`}
                  />
                ))}
              </div>

              {/* Desktop Navigation Hints */}
              <div className="absolute top-12 right-4 z-50">
                <div className="text-white/60 text-xs text-right">
                  <div>Scroll ↑↓</div>
                  <div>Enter to select</div>
                </div>
              </div>

              {renderReelsContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden fixed inset-0 bg-black overflow-hidden">
        {/* Mobile Header Overlay */}
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/50 to-transparent p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            <div className="text-center">
              <h1 className="text-lg font-bold text-white">Choose Style</h1>
              <p className="text-xs text-white/60 mt-1">
                {currentIndex + 1}/{videoStyles.length}
              </p>
            </div>

            <div className="w-10" />
          </div>
        </div>

        {/* Style Indicator Dots */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 flex space-x-2">
          {videoStyles.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Mobile Navigation Hint */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40 text-center">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10"
          >
            <p className="text-white/80 text-sm">
              Swipe up/down to explore styles
            </p>
          </motion.div>
        </div>

        {renderReelsContent()}
      </div>
    </div>
  );
}
