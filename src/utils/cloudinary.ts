import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryVideo {
  public_id: string;
  secure_url: string;
  duration: number;
  format: string;
  bytes: number;
}

export class CloudinaryService {
  /** Upload a video buffer to Cloudinary */
  static async uploadVideo(
    videoBuffer: Buffer,
    filename: string,
    options: {
      folder?: string;
      resource_type?: "video" | "image";
      transformation?: any[];
    } = {
      resource_type: "video",
    }
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: options.folder || "flips-videos",
          public_id: filename.replace(/\.[^/.]+$/, ""), // Remove extension
          transformation: options.transformation || [],
          eager: [
            { width: 1080, height: 1920, crop: "scale", quality: "auto" },
            { width: 720, height: 1280, crop: "scale", quality: "auto" },
          ],
          eager_async: true,
          eager_notification_url: process.env.CLOUDINARY_WEBHOOK_URL,
        },
        (error, result) => {
          if (error) {
            console.log("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload result:", result);
            resolve(result as UploadApiResponse);
          }
        }
      );

      const uint8Buffer = new Uint8Array(videoBuffer);

      uploadStream.end(uint8Buffer);
    });
  }

  /** Get a secure download URL for a video */
  static getDownloadUrl(publicId: string, format: string = "mp4"): string {
    return cloudinary.url(publicId, {
      resource_type: "video",
      format,
      flags: "attachment",
      secure: true,
    });
  }

  /** Delete a video from Cloudinary */
  static async deleteVideo(publicId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        { resource_type: "video" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(true);
          }
        }
      );
    });
  }

  /** Create a temporary download URL that expires */
  static getTemporaryDownloadUrl(
    publicId: string,
    expiresIn: number = 3600
  ): string {
    const timestamp = Math.round(new Date().getTime() / 1000) + expiresIn;
    const signature = cloudinary.utils.api_sign_request(
      {
        public_id: publicId,
        timestamp,
        resource_type: "video",
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    return cloudinary.url(publicId, {
      resource_type: "video",
      flags: "attachment",
      secure: true,
      sign_url: true,
      type: "upload",
      version: timestamp,
      signature,
    });
  }
}

export default cloudinary;
