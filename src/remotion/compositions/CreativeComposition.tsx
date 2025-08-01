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

export const CreativeComposition: React.FC<VideoCompositionProps> = ({
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
          Creative Composition
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
  const transitionDuration = 60; // 2 seconds at 30fps for creative transition
  const isInTransition =
    frameInCurrentFile > durationPerFile - transitionDuration;

  // Current and next media files
  const currentFile = mediaFiles[currentFileIndex];
  const nextFile = mediaFiles[nextFileIndex];

  // Creative morphing transition
  const morphProgress = interpolate(
    frameInCurrentFile,
    [durationPerFile - transitionDuration, durationPerFile],
    [0, 1],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Liquid morph effect using clip-path
  const createLiquidMask = (progress: number) => {
    const wave1 = Math.sin(progress * Math.PI * 4) * 10;
    const wave2 = Math.cos(progress * Math.PI * 6) * 15;
    const baseProgress = progress * 100;

    return `polygon(
      0% 0%, 
      ${baseProgress + wave1}% 0%, 
      ${baseProgress + wave2}% 100%, 
      0% 100%
    )`;
  };

  // Artistic scale and rotation
  const creativeScale = interpolate(
    frameInCurrentFile,
    [0, 30, durationPerFile - 30, durationPerFile],
    [1.1, 1, 1, 0.9],
    {
      easing: Easing.inOut(Easing.quad),
    }
  );

  const creativeRotation = interpolate(
    frameInCurrentFile,
    [0, durationPerFile],
    [0, 5],
    {
      easing: Easing.out(Easing.quad),
    }
  );

  // Vibrant color shifts
  const colorShift = interpolate(
    frame,
    [
      0,
      durationInFrames / 4,
      durationInFrames / 2,
      (durationInFrames * 3) / 4,
      durationInFrames,
    ],
    [0, 60, 120, 240, 360],
    {
      easing: Easing.inOut(Easing.sin),
    }
  );

  // Particle effects timing
  const particleOpacity = interpolate(
    frameInCurrentFile,
    [0, 15, durationPerFile - 15, durationPerFile],
    [0, 1, 1, 0],
    {
      easing: Easing.inOut(Easing.quad),
    }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Current Media */}
      <AbsoluteFill
        style={{
          transform: `scale(${creativeScale}) rotate(${creativeRotation}deg)`,
          clipPath: isInTransition
            ? createLiquidMask(1 - morphProgress)
            : "none",
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

      {/* Next Media (for liquid transition) */}
      {isInTransition && nextFile && (
        <AbsoluteFill
          style={{
            clipPath: createLiquidMask(morphProgress),
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

      {/* Creative Color Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(45deg, 
            hsl(${colorShift}, 70%, 50%) 0%, 
            hsl(${(colorShift + 60) % 360}, 70%, 50%) 25%,
            hsl(${(colorShift + 120) % 360}, 70%, 50%) 50%,
            hsl(${(colorShift + 180) % 360}, 70%, 50%) 75%,
            hsl(${(colorShift + 240) % 360}, 70%, 50%) 100%
          )`,
          opacity: 0.3,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* Floating Particles */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: particleOpacity,
        }}
      >
        {[...Array(12)].map((_, i) => {
          const particleX = interpolate(
            frame,
            [0, durationInFrames],
            [i * 8, (i * 8 + 100) % 100],
            {
              easing: Easing.inOut(Easing.sin),
            }
          );

          const particleY = interpolate(frame + i * 10, [0, 60], [100, -20], {
            easing: Easing.out(Easing.quad),
          });

          const particleScale = interpolate(
            (frame + i * 5) % 60,
            [0, 30, 60],
            [0, 1, 0],
            {
              easing: Easing.inOut(Easing.quad),
            }
          );

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${particleX}%`,
                top: `${particleY}%`,
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: `hsl(${(colorShift + i * 30) % 360}, 80%, 60%)`,
                transform: `scale(${particleScale})`,
                filter: "blur(1px)",
              }}
            />
          );
        })}
      </div>

      {/* Creative Liquid Shapes */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: "200px",
          height: "200px",
          background: `radial-gradient(circle, hsl(${colorShift}, 80%, 60%) 0%, transparent 70%)`,
          borderRadius: "50%",
          transform: `scale(${interpolate(
            frame % 60,
            [0, 30, 60],
            [0.5, 1.2, 0.5],
            { easing: Easing.inOut(Easing.sin) }
          )})`,
          opacity: 0.4,
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "15%",
          right: "15%",
          width: "150px",
          height: "150px",
          background: `radial-gradient(ellipse, hsl(${
            (colorShift + 120) % 360
          }, 80%, 60%) 0%, transparent 70%)`,
          borderRadius: "30% 70% 20% 80%",
          transform: `rotate(${colorShift}deg) scale(${interpolate(
            (frame + 30) % 60,
            [0, 30, 60],
            [0.8, 1.5, 0.8],
            { easing: Easing.inOut(Easing.sin) }
          )})`,
          opacity: 0.3,
          filter: "blur(15px)",
          pointerEvents: "none",
        }}
      />

      {/* Artistic Edge Glow */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at center, transparent 20%, hsl(${colorShift}, 50%, 30%) 100%)`,
          opacity: 0.6,
          pointerEvents: "none",
        }}
      />

      {/* Creative Texture Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.3' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.3'/%3E%3C/svg%3E")`,
          opacity: 0.2,
          mixBlendMode: "soft-light",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
