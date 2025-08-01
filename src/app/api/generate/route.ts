import { NextRequest, NextResponse } from "next/server";
import { renderMedia } from "@remotion/renderer";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { compositionId, inputProps, outputPath } = body;

    // Validate required fields
    if (!compositionId || !inputProps) {
      return NextResponse.json(
        { error: "Missing required fields: compositionId and inputProps" },
        { status: 400 }
      );
    }

    // Ensure output directory exists
    const outputDir = path.join(process.cwd(), "public", "generated");
    await mkdir(outputDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${compositionId}-${timestamp}.mp4`;
    const fullOutputPath = path.join(outputDir, filename);

    // In a real implementation, you would use Remotion's renderMedia
    // For now, we'll simulate the process
    console.log("Starting video generation...", {
      compositionId,
      inputProps,
      outputPath: fullOutputPath,
    });

    // Simulate rendering process
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In production, you would:
    // const composition = await renderMedia({
    //   composition: {
    //     id: compositionId,
    //     durationInFrames: inputProps.durationInFrames,
    //     fps: 30,
    //     height: 1080,
    //     width: 1920,
    //   },
    //   serveUrl: getRemotionStudioUrl(),
    //   codec: 'h264',
    //   outputLocation: fullOutputPath,
    //   inputProps,
    // });

    // For demo purposes, return success
    const publicUrl = `/generated/${filename}`;

    return NextResponse.json({
      success: true,
      videoUrl: publicUrl,
      filename,
      message: "Video generated successfully",
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

// GET endpoint to check generation status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get("jobId");

  if (!jobId) {
    return NextResponse.json(
      { error: "Missing jobId parameter" },
      { status: 400 }
    );
  }

  // In a real app, you'd check the job status from a database or queue
  return NextResponse.json({
    jobId,
    status: "completed",
    progress: 100,
    videoUrl: `/generated/example-${jobId}.mp4`,
  });
}
