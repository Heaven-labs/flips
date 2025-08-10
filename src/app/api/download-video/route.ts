import { NextRequest, NextResponse } from "next/server";
import { CloudinaryService } from "@/utils/cloudinary";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId");

    if (!publicId) {
      return NextResponse.json(
        { error: "Missing publicId parameter" },
        { status: 400 }
      );
    }

    // Get a temporary download URL that expires in 1 hour
    const downloadUrl = CloudinaryService.getTemporaryDownloadUrl(
      publicId,
      3600
    );

    // Return a redirect to the Cloudinary download URL
    return NextResponse.redirect(downloadUrl);
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

// POST endpoint to delete video after download
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { publicId } = body;

    if (!publicId) {
      return NextResponse.json(
        { error: "Missing publicId parameter" },
        { status: 400 }
      );
    }

    // Delete the video from Cloudinary
    await CloudinaryService.deleteVideo(publicId);

    return NextResponse.json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      {
        error: "Failed to delete video",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
