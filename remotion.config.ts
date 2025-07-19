import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");
Config.setEntryPoint("./src/remotion/index.ts");

// Performance settings
Config.setConcurrency(1);
Config.setChromiumHeadlessMode(true);

// Output settings
// Config.setOutputFormat("mp4"); // Not available in v4
// Config.setQuality(8); // Not available in v4

export {};
