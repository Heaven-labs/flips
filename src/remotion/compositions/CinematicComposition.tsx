import React from "react";
import {
  AbsoluteFill,
  Img,
  Video,
  useVideoConfig,
  useCurrentFrame,
  interpolate,
  Easing,
  staticFile,
} from "remotion";
import { VideoCompositionProps } from "../index";

export const CinematicComposition: React.FC<VideoCompositionProps> = ({
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
          Cinematic Composition
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
  const transitionDuration = 45; // 1.5 seconds at 30fps
  const isInTransition =
    frameInCurrentFile > durationPerFile - transitionDuration;

  // Current and next media files
  const currentFile = mediaFiles[currentFileIndex];
  const nextFile = mediaFiles[nextFileIndex];

  // Cinematic effects
  const fadeOpacity = interpolate(
    frameInCurrentFile,
    [durationPerFile - transitionDuration, durationPerFile],
    [1, 0],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const nextFadeOpacity = interpolate(
    frameInCurrentFile,
    [durationPerFile - transitionDuration, durationPerFile],
    [0, 1],
    {
      easing: Easing.inOut(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Dramatic zoom effect
  const zoomScale = interpolate(
    frameInCurrentFile,
    [0, durationPerFile],
    [1, 1.1],
    {
      easing: Easing.out(Easing.quad),
    }
  );

  // Film-like color grading overlay
  const filmGrainOpacity = interpolate(frame, [0, 30], [0.03, 0.06], {
    easing: Easing.inOut(Easing.sin),
  });

  // Vignette effect
  const vignetteStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "radial-gradient(circle, transparent 30%, rgba(0,0,0,0.4) 100%)",
    pointerEvents: "none",
  };

  // Color grading overlay
  const colorGradingStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      "linear-gradient(45deg, rgba(255,138,76,0.1) 0%, rgba(255,69,90,0.1) 100%)",
    mixBlendMode: "multiply",
    pointerEvents: "none",
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* Current Media */}
      <AbsoluteFill
        style={{
          opacity: fadeOpacity,
          transform: `scale(${zoomScale})`,
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
            opacity: nextFadeOpacity,
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

      {/* Vignette Effect */}
      <div style={vignetteStyle} />

      {/* Color Grading */}
      <div style={colorGradingStyle} />

      {/* Film Grain Effect */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: filmGrainOpacity,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* Cinematic Bars (Letterbox) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "10%",
          backgroundColor: "#000",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "10%",
          backgroundColor: "#000",
        }}
      />
    </AbsoluteFill>
  );
};
