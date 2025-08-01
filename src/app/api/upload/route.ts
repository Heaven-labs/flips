import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Maximum file size (50MB)
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Allowed file types
const ALLOWED_TYPES = {
  images: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
  videos: ["video/mp4", "video/mov", "video/avi", "video/mkv", "video/webm"],
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const uploadedFiles = [];

    for (const file of files) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} is too large. Maximum size is 50MB.` },
          { status: 400 }
        );
      }

      // Validate file type
      const allAllowedTypes = [
        ...ALLOWED_TYPES.images,
        ...ALLOWED_TYPES.videos,
      ];
      if (!allAllowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `File type ${file.type} is not supported.` },
          { status: 400 }
        );
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const extension = path.extname(file.name);
      const filename = `${timestamp}-${randomSuffix}${extension}`;
      const filepath = path.join(uploadDir, filename);

      // Save file
      const bytes = await file.arrayBuffer();
      const buffer = new Uint8Array(bytes);
      await writeFile(filepath, buffer);

      // Determine file type
      const fileType = ALLOWED_TYPES.images.includes(file.type)
        ? "image"
        : "video";

      uploadedFiles.push({
        id: `${timestamp}-${randomSuffix}`,
        originalName: file.name,
        filename,
        url: `/uploads/${filename}`,
        type: fileType,
        size: file.size,
        mimeType: file.type,
      });
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        error: "Failed to upload files",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// GET endpoint to list uploaded files
export async function GET() {
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // In a real app, you'd list files from the directory or database
    return NextResponse.json({
      success: true,
      message: "Upload endpoint is working",
      supportedTypes: ALLOWED_TYPES,
      maxFileSize: MAX_FILE_SIZE,
    });
  } catch (error) {
    console.error("Upload list error:", error);
    return NextResponse.json(
      { error: "Failed to list files" },
      { status: 500 }
    );
  }
}
