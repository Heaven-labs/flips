import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const style = searchParams.get("style");

    if (!style) {
      return NextResponse.json(
        { error: "Missing style parameter" },
        { status: 400 }
      );
    }

    // Generate the filename based on style
    const timestamp = Date.now();
    const filename = `${style.toLowerCase()}-${timestamp}.mp4`;
    const filePath = path.join(process.cwd(), "public", "generated", filename);

    try {
      // Try to read the actual video file
      const videoBuffer = await readFile(filePath);

      return new NextResponse(videoBuffer, {
        headers: {
          "Content-Type": "video/mp4",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    } catch (fileError) {
      // If the video file doesn't exist, create a sample video
      const sampleVideoData = new Uint8Array([
        // Minimal MP4 header
        0x00,
        0x00,
        0x00,
        0x20,
        0x66,
        0x74,
        0x79,
        0x70, // ftyp box
        0x69,
        0x73,
        0x6f,
        0x6d,
        0x00,
        0x00,
        0x02,
        0x00, // isom brand
        0x69,
        0x73,
        0x6f,
        0x6d,
        0x69,
        0x73,
        0x6f,
        0x32, // isom2
        0x61,
        0x76,
        0x63,
        0x31,
        0x6d,
        0x70,
        0x34,
        0x31, // avc1mp41
        0x00,
        0x00,
        0x00,
        0x08,
        0x66,
        0x72,
        0x65,
        0x65, // free box
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00,
        0x00, // empty mdat
      ]);

      return new NextResponse(sampleVideoData, {
        headers: {
          "Content-Type": "video/mp4",
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    }
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      {
        error: "Failed to download video",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
