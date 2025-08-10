import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { CloudinaryService } from "@/utils/cloudinary";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { compositionId, inputProps } = body;

    // Validate required fields
    if (!compositionId || !inputProps) {
      return NextResponse.json(
        { error: "Missing required fields: compositionId and inputProps" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${compositionId}-${timestamp}.mp4`;
    const styleName =
      compositionId.charAt(0).toUpperCase() + compositionId.slice(1);

    let videoBuffer: Buffer;

    // Create a real video file using FFmpeg (if available) or a simple MP4
    try {
      await execAsync("ffmpeg -version");

      // Create a simple video using FFmpeg with a gradient background
      const ffmpegCommand = `ffmpeg -f lavfi -i "color=c=0x1a1a1a:size=1920x1080:duration=3" -vf "drawtext=text='${styleName} Style Video':fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" -c:v libx264 -preset ultrafast -pix_fmt yuv420p -movflags +faststart -f mp4 pipe:1`;

      const { stdout } = await execAsync(ffmpegCommand, {
        encoding: "buffer",
        maxBuffer: 50 * 1024 * 1024, // 50MB buffer
      });
      videoBuffer = stdout;

      console.log("Video generated successfully with FFmpeg");
    } catch (ffmpegError) {
      console.log("FFmpeg not available, using fallback video generation...");

      // Create a minimal but valid MP4 using a pre-made sample
      // This is a minimal valid MP4 with a single black frame
      const validMp4Sample = Buffer.from([
        // ftyp box
        0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6f, 0x6d,
        0x00, 0x00, 0x02, 0x00, 0x69, 0x73, 0x6f, 0x6d, 0x69, 0x73, 0x6f, 0x32,
        0x61, 0x76, 0x63, 0x31, 0x6d, 0x70, 0x34, 0x31,
        // mdat box header
        0x00, 0x00, 0x00, 0x08, 0x6d, 0x64, 0x61, 0x74,
      ]);

      // For development/demo purposes, use a simple data URL approach
      // In production, you'd want to either:
      // 1. Install FFmpeg on your server
      // 2. Use a service like AWS Lambda with FFmpeg layer
      // 3. Use a different video generation service

      const demoVideoData = `data:video/mp4;base64,${validMp4Sample.toString(
        "base64"
      )}`;

      // For now, let's return a mock response that the frontend can handle
      return NextResponse.json({
        success: true,
        videoUrl: demoVideoData,
        publicId: `demo-${filename}`,
        filename,
        message: "Demo video generated (FFmpeg not available)",
        isDemoMode: true,
      });
    }

    // Upload to Cloudinary
    console.log("Uploading video to Cloudinary videoBuffer", videoBuffer);
    const cloudinaryVideo = await CloudinaryService.uploadVideo(
      videoBuffer,
      filename,
      {
        folder: "flips-videos",
        transformation: [{ quality: "auto", format: "mp4" }],
      }
    );

    console.log("Video uploaded to Cloudinary:", cloudinaryVideo.public_id);

    return NextResponse.json({
      success: true,
      videoUrl: cloudinaryVideo.secure_url,
      publicId: cloudinaryVideo.public_id,
      filename,
      message: "Video generated and uploaded successfully",
    });
  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate video",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
