"use client";

import { motion } from "framer-motion";
import { Play, Sparkles, Zap, Video } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import FloatingParticles from "./FloatingParticles";

export default function HomePage() {
  const { setCurrentStep } = useAppStore();

  const handleContinue = () => {
    setCurrentStep("upload");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="video-background"
          poster="/videos/hero-poster.jpg"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
          {/* Fallback gradient background if video doesn't load */}
        </video>
        <div className="video-overlay" />
      </div>

      {/* Fallback dark background */}
      <div className="absolute inset-0 bg-gray-900 -z-10" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Logo/Brand */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center justify-center space-x-3 mb-8"
          >
            <div className="p-3 rounded-2xl glass">
              <Video className="w-8 h-8 text-video-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Flips</h1>
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Create{" "}
              <span className="bg-gradient-to-r from-video-primary to-video-accent bg-clip-text text-transparent">
                Amazing
              </span>
              <br />
              Videos with AI
            </h2>

            <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Transform your photos and videos into stunning cinematic
              experiences with AI-powered transitions and effects.
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm sm:text-base"
          >
            <div className="flex items-center space-x-2 glass px-4 py-2 rounded-full">
              <Sparkles className="w-4 h-4 text-video-accent" />
              <span className="text-white">AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2 glass px-4 py-2 rounded-full">
              <Zap className="w-4 h-4 text-video-accent" />
              <span className="text-white">3 Unique Styles</span>
            </div>
            <div className="flex items-center space-x-2 glass px-4 py-2 rounded-full">
              <Play className="w-4 h-4 text-video-accent" />
              <span className="text-white">Instant Preview</span>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="pt-8"
          >
            <button
              onClick={handleContinue}
              className="group relative px-8 py-4 sm:px-12 sm:py-5 bg-gradient-to-r from-video-primary to-video-secondary rounded-full text-white font-semibold text-lg sm:text-xl shadow-2xl hover:shadow-video-primary/25 transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center space-x-3">
                <span>Get Started</span>
                <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>

              {/* Button glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-video-primary to-video-secondary opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl" />
            </button>
          </motion.div>
        </motion.div>

        {/* Floating particles animation */}
        <FloatingParticles />
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex flex-col items-center text-white/60">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
            />
          </motion.div>
          <p className="text-xs mt-2 hidden sm:block">Scroll to explore</p>
        </div>
      </motion.div>
    </div>
  );
}
