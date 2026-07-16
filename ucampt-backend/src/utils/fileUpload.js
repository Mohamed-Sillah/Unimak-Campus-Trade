import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// Use process.cwd() to get the backend root
const uploadsDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function saveUploadedFile(file) {
  // If Cloudinary config is present, upload there and return secure URL
  if (process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME) {
    // configure via env vars
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || undefined,
      api_key: process.env.CLOUDINARY_API_KEY || undefined,
      api_secret: process.env.CLOUDINARY_API_SECRET || undefined,
    });

    return new Promise((resolve, reject) => {
      const opts = { folder: process.env.CLOUDINARY_FOLDER || 'ucampt' };
      const stream = cloudinary.uploader.upload_stream(opts, (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url || result.url);
      });
      stream.end(file.buffer);
    });
  }

  // Fallback: save locally to /uploads
  const timestamp = Date.now();
  const filename = `${timestamp}-${file.originalname.replace(/\s+/g, '_')}`;
  const filepath = path.join(uploadsDir, filename);

  await fs.promises.writeFile(filepath, file.buffer);
  return `/uploads/${filename}`;
}