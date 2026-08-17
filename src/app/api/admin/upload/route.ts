import { NextResponse } from "next/server";
import { requireAdmin, adminErrorResponse } from "@/lib/adminAuth";
import { uploadImageBuffer } from "@/lib/cloudinary";
import { AppError } from "@/Errors/AppError";

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const formData = await req.formData();
    const files = formData.getAll("files");

    if (!files.length) {
      throw new AppError("No files uploaded", 400);
    }

    const urls: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const url = await uploadImageBuffer(buffer);
      urls.push(url);
    }

    if (!urls.length) {
      throw new AppError("No valid files uploaded", 400);
    }

    return NextResponse.json({ urls });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
