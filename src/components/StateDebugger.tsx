"use client";

import { useAppStore } from "@/store/useAppStore";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bug, X, Eye, EyeOff, Download, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function StateDebugger() {
  const store = useAppStore();
  const {
    currentStep,
    selectedFiles,
    selectedStyle,
    generatedVideos,
    isGenerating,
    error,
    resetApp,
  } = store;

  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [renderInfo, setRenderInfo] = useState({
    timestamp: new Date().toLocaleTimeString(),
    renders: 0,
  });

  // Track renders
  useEffect(() => {
    setRenderInfo((prev) => ({
      timestamp: new Date().toLocaleTimeString(),
      renders: prev.renders + 1,
    }));
  }, [
    currentStep,
    selectedFiles.length,
    selectedStyle?.id,
    isGenerating,
    error,
  ]);

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  if (!isVisible) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-blue-600/20 text-blue-400 rounded-full backdrop-blur-sm border border-blue-500/30 hover:bg-blue-600/30 transition-colors"
      >
        <Bug className="w-5 h-5" />
      </motion.button>
    );
  }

  const handleExportState = () => {
    const stateData = {
      timestamp: new Date().toISOString(),
      state: {
        currentStep,
        selectedFiles: selectedFiles.map((f) => ({
          id: f.id,
          type: f.type,
          name: f.file.name,
        })),
        selectedStyle,
        generatedVideos,
        isGenerating,
        error,
      },
    };

    const blob = new Blob([JSON.stringify(stateData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flips-debug-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Debug state exported!");
  };

  const handleResetApp = () => {
    if (confirm("Are you sure you want to reset the entire app state?")) {
      resetApp();
      toast.success("App state reset!");
    }
  };

  const handleTestToast = () => {
    toast.success("Test notification!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50 max-w-sm"
    >
      <div className="bg-gray-900/95 text-white rounded-lg backdrop-blur-sm border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <Bug className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-sm">Debug Panel</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
            >
              {isExpanded ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-3 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-blue-400">Step:</span>
            <span className="font-mono">{currentStep}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-green-400">Files:</span>
            <span className="font-mono">{selectedFiles.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-purple-400">Style:</span>
            <span className="font-mono">{selectedStyle?.name || "None"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-yellow-400">Status:</span>
            <span
              className={`font-mono ${
                isGenerating ? "text-orange-400" : "text-gray-400"
              }`}
            >
              {isGenerating ? "Generating..." : "Idle"}
            </span>
          </div>
          {error && (
            <div className="text-red-400 text-xs mt-1 p-2 bg-red-900/20 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-700"
            >
              {/* Performance Info */}
              <div className="p-3 border-b border-gray-700">
                <h4 className="text-xs font-semibold text-gray-300 mb-2">
                  Performance
                </h4>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Renders:</span>
                    <span className="font-mono text-yellow-400">
                      {renderInfo.renders}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Update:</span>
                    <span className="font-mono text-gray-400">
                      {renderInfo.timestamp}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 space-y-2">
                <button
                  onClick={handleTestToast}
                  className="w-full text-xs bg-blue-600/20 text-blue-400 px-3 py-2 rounded hover:bg-blue-600/30 transition-colors"
                >
                  Test Toast
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={handleExportState}
                    className="flex-1 flex items-center justify-center space-x-1 text-xs bg-green-600/20 text-green-400 px-3 py-2 rounded hover:bg-green-600/30 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={handleResetApp}
                    className="flex-1 flex items-center justify-center space-x-1 text-xs bg-red-600/20 text-red-400 px-3 py-2 rounded hover:bg-red-600/30 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
