"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular" | "rounded";
}

export function Skeleton({
  className,
  variant = "rectangular",
}: SkeletonProps) {
  const baseClasses =
    "bg-gradient-to-r from-gray-700 to-gray-600 animate-pulse";

  const variantClasses = {
    text: "h-4 rounded",
    rectangular: "rounded-lg",
    circular: "rounded-full",
    rounded: "rounded-xl",
  };

  return (
    <motion.div
      className={cn(baseClasses, variantClasses[variant], className)}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// File upload skeleton
export function FileUploadSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full" variant="rounded" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="aspect-square" variant="rounded" />
        ))}
      </div>
    </div>
  );
}

// Style selection skeleton
export function StyleSelectionSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-64 mx-auto" variant="rounded" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-video" variant="rounded" />
            <Skeleton className="h-6 w-3/4" variant="text" />
            <Skeleton className="h-16 w-full" variant="text" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Video preview skeleton
export function VideoPreviewSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-48 mx-auto" variant="rounded" />
      <Skeleton className="aspect-video w-full" variant="rounded" />
      <div className="flex justify-center space-x-4">
        <Skeleton className="h-12 w-32" variant="rounded" />
        <Skeleton className="h-12 w-40" variant="rounded" />
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="aspect-square" variant="rounded" />
        ))}
      </div>
    </div>
  );
}

// Generation progress skeleton
export function GenerationSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-56 mx-auto" variant="rounded" />
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" variant="text" />
            <Skeleton className="h-4 w-12" variant="text" />
          </div>
          <Skeleton className="h-3 w-full" variant="rounded" />
        </div>

        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-4 p-4 rounded-xl bg-gray-800/30"
          >
            <Skeleton className="w-6 h-6" variant="circular" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" variant="text" />
              <Skeleton className="h-4 w-48" variant="text" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Generic page skeleton
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-16" variant="rounded" />
          <Skeleton className="h-8 w-48" variant="rounded" />
          <Skeleton className="h-6 w-16" variant="rounded" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" variant="rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-32" variant="rounded" />
            <Skeleton className="h-32" variant="rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
