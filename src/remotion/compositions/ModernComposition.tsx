import React from "react";
import {
  AbsoluteFill,
  Img,
  Video,
  useVideoConfig,
  useCurrentFrame,
  interpolate,
  Easing,
} from "remotion";
import { VideoCompositionProps } from "../index";

export const ModernComposition: React.FC<VideoCompositionProps> = ({
  mediaFiles,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  if (!mediaFiles || mediaFiles.length === 0) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "white", fontSize: 48, fontFamily: "Arial" }}>
          Modern Composition
        </div>
      </AbsoluteFill>
    );
  }

  // Calculate duration per media file
  const durationPerFile = Math.floor(durationInFrames / mediaFiles.length);
  const currentFileIndex = Math.floor(frame / durationPerFile);
  const frameInCurrentFile = frame % durationPerFile;
  const nextFileIndex = (currentFileIndex + 1) % mediaFiles.length;

  // Transition timing
  const transitionDuration = 30; // 1 second at 30fps
  const isInTransition =
    frameInCurrentFile > durationPerFile - transitionDuration;

  // Current and next media files
  const currentFile = mediaFiles[currentFileIndex];
  const nextFile = mediaFiles[nextFileIndex];

  // Modern slide transition
  const slideOffset = interpolate(
    frameInCurrentFile,
    [durationPerFile - transitionDuration, durationPerFile],
    [0, 100],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const nextSlideOffset = interpolate(
    frameInCurrentFile,
    [durationPerFile - transitionDuration, durationPerFile],
    [-100, 0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Geometric scale effect
  const scaleEffect = interpolate(
    frameInCurrentFile,
    [0, 15, durationPerFile - 15, durationPerFile],
    [0.95, 1, 1, 1.05],
    {
      easing: Easing.out(Easing.quad),
    }
  );

  // Modern overlay shapes
  const shapeRotation = interpolate(frame, [0, durationInFrames], [0, 360], {
    easing: Easing.linear,
  });

  // Clean color overlay
  const colorOverlayOpacity = interpolate(
    frameInCurrentFile,
    [0, 30, durationPerFile - 30, durationPerFile],
    [0.2, 0.1, 0.1, 0.2],
    {
      easing: Easing.inOut(Easing.quad),
    }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Current Media */}
      <AbsoluteFill
        style={{
          transform: `translateX(${
            isInTransition ? slideOffset : 0
          }%) scale(${scaleEffect})`,
        }}
      >
        {currentFile.type === "image" ? (
          <Img
            src={currentFile.url}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <Video
            src={currentFile.url}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            muted
          />
        )}
      </AbsoluteFill>

      {/* Next Media (for transition) */}
      {isInTransition && nextFile && (
        <AbsoluteFill
          style={{
            transform: `translateX(${nextSlideOffset}%)`,
          }}
        >
          {nextFile.type === "image" ? (
            <Img
              src={nextFile.url}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <Video
              src={nextFile.url}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              muted
            />
          )}
        </AbsoluteFill>
      )}

      {/* Modern Color Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(16, 185, 129, 0.3) 100%)",
          opacity: colorOverlayOpacity,
          mixBlendMode: "multiply",
          pointerEvents: "none",
        }}
      />

      {/* Geometric Shapes Overlay */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: "100px",
          height: "100px",
          border: "3px solid rgba(255, 255, 255, 0.3)",
          transform: `rotate(${shapeRotation}deg)`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "15%",
          left: "15%",
          width: "60px",
          height: "60px",
          background: "rgba(59, 130, 246, 0.4)",
          transform: `rotate(${-shapeRotation}deg)`,
          pointerEvents: "none",
        }}
      />

      {/* Modern Grid Lines */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "33.33%",
          width: "1px",
          height: "100%",
          background: "rgba(255, 255, 255, 0.1)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "66.66%",
          width: "1px",
          height: "100%",
          background: "rgba(255, 255, 255, 0.1)",
          pointerEvents: "none",
        }}
      />

      {/* Clean Edge Gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "20%",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "20%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
