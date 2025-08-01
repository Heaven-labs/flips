"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  Image as ImageIcon,
  Video,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { MediaFile } from "@/types";

export default function FileUpload() {
  const { selectedFiles, addSelectedFile, removeSelectedFile, setCurrentStep } =
    useAppStore();
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const id = Math.random().toString(36).substr(2, 9);
        const isVideo = file.type.startsWith("video/");
        const isImage = file.type.startsWith("image/");

        if (isVideo || isImage) {
          // Simulate upload progress
          setUploadProgress((prev) => ({ ...prev, [id]: 0 }));

          const interval = setInterval(() => {
            setUploadProgress((prev) => {
              const newProgress = Math.min((prev[id] || 0) + 10, 100);
              if (newProgress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                  setUploadProgress((prev) => {
                    const { [id]: _, ...rest } = prev;
                    return rest;
                  });
                }, 500);
              }
              return { ...prev, [id]: newProgress };
            });
          }, 100);

          const mediaFile: MediaFile = {
            id,
            file,
            type: isVideo ? "video" : "image",
            url: URL.createObjectURL(file),
          };

          addSelectedFile(mediaFile);
        }
      });
    },
    [addSelectedFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
      "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"],
    },
    multiple: true,
  });

  const handleRemoveFile = (fileId: string) => {
    removeSelectedFile(fileId);
  };

  const handleBack = () => {
    setCurrentStep("home");
  };

  const handleContinue = () => {
    if (selectedFiles.length > 0) {
      setCurrentStep("style");
    }
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
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">
            Select Your Media
          </h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer
              transition-all duration-300 glass
              ${
                isDragActive
                  ? "border-video-primary bg-video-primary/10"
                  : "border-white/30 hover:border-video-primary/50 hover:bg-white/5"
              }
            `}
          >
            <input {...getInputProps()} />

            <motion.div
              animate={{ scale: isDragActive ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-video-primary/20">
                  <Upload className="w-8 h-8 sm:w-12 sm:h-12 text-video-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  {isDragActive
                    ? "Drop files here"
                    : "Drag & drop your files here"}
                </h3>
                <p className="text-sm sm:text-base text-white/70">
                  or{" "}
                  <span className="text-video-primary font-medium">
                    browse files
                  </span>
                </p>
                <p className="text-xs sm:text-sm text-white/50">
                  Supports: Images (JPG, PNG, GIF, WebP) and Videos (MP4, MOV,
                  WebM)
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Selected Files Grid */}
        <AnimatePresence>
          {selectedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
                Selected Files ({selectedFiles.length})
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {selectedFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative group"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden glass">
                      {file.type === "image" ? (
                        <img
                          src={file.url}
                          alt={file.file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          <Video className="w-8 h-8 text-video-primary" />
                        </div>
                      )}

                      {/* Upload Progress */}
                      {uploadProgress[file.id] !== undefined && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-white text-sm font-medium">
                            {uploadProgress[file.id]}%
                          </div>
                        </div>
                      )}

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>

                      {/* File Type Icon */}
                      <div className="absolute bottom-2 left-2">
                        <div className="p-1 bg-black/50 rounded">
                          {file.type === "image" ? (
                            <ImageIcon className="w-3 h-3 text-white" />
                          ) : (
                            <Video className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* File Name */}
                    <p className="mt-2 text-xs text-white/70 truncate">
                      {file.file.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue Button */}
        <AnimatePresence>
          {selectedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-center"
            >
              <button
                onClick={handleContinue}
                className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-video-primary to-video-secondary rounded-full text-white font-semibold text-lg shadow-2xl hover:shadow-video-primary/25 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <span>Continue to Styles</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Text */}
        {selectedFiles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-white/60 text-sm"
          >
            <p>Select at least 2 files to create your video</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
