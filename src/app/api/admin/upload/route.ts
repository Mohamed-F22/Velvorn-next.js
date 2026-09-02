import { NextResponse } from "next/server";
import { requireAdmin, adminErrorResponse } from "@/lib/adminAuth";
import { uploadImageBuffer } from "@/lib/cloudinary";
import { AppError } from "@/Errors/AppError";

const MAX_FILE_COUNT = 5;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

function hasExpectedImageSignature(buffer: Buffer, mimeType: string) {
  if (mimeType === "image/jpeg") {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimeType === "image/png") {
    return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (mimeType === "image/webp") {
    return buffer.length >= 12 && buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP";
  }
  if (mimeType === "image/avif") {
    return buffer.length >= 12 && buffer.subarray(4, 8).toString() === "ftyp" && buffer.subarray(8, 12).toString().includes("avif");
  }
  return false;
}

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const formData = await req.formData();
    const files = formData.getAll("files");

    if (!files.length) {
      throw new AppError("No files uploaded", 400);
    }
    if (files.length > MAX_FILE_COUNT) {
      throw new AppError(`Upload up to ${MAX_FILE_COUNT} images at a time`, 400);
    }

    const buffers: Buffer[] = [];

    for (const file of files) {
      if (!(file instanceof File)) {
        throw new AppError("Invalid upload payload", 400);
      }
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        throw new AppError("Only JPEG, PNG, WebP, and AVIF images are allowed", 400);
      }
      if (file.size === 0 || file.size > MAX_FILE_SIZE_BYTES) {
        throw new AppError("Each image must be between 1 byte and 5 MB", 400);
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      if (!hasExpectedImageSignature(buffer, file.type)) {
        throw new AppError("Image file signature does not match its MIME type", 400);
      }
      buffers.push(buffer);
    }

    const urls = await Promise.all(buffers.map((buffer) => uploadImageBuffer(buffer)));

    if (!urls.length) {
      throw new AppError("No valid files uploaded", 400);
    }

    return NextResponse.json({ urls });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
