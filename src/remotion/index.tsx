import React from "react";
import { Composition } from "remotion";
import { CinematicComposition } from "./compositions/CinematicComposition";
import { ModernComposition } from "./compositions/ModernComposition";
import { CreativeComposition } from "./compositions/CreativeComposition";

export interface VideoCompositionProps {
  mediaFiles: Array<{
    id: string;
    url: string;
    type: "image" | "video";
  }>;
  durationInFrames: number;
}

const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="cinematic"
        component={CinematicComposition as any}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          mediaFiles: [],
          durationInFrames: 300,
        }}
      />
      <Composition
        id="modern"
        component={ModernComposition as any}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          mediaFiles: [],
          durationInFrames: 300,
        }}
      />
      <Composition
        id="creative"
        component={CreativeComposition as any}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          mediaFiles: [],
          durationInFrames: 300,
        }}
      />
    </>
  );
};

// Export as default for Remotion v4
export default RemotionRoot;
