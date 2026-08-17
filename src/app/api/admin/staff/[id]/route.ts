import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import adminModel from "@/models/adminModel";
import { requireAdmin, adminErrorResponse } from "@/lib/adminAuth";
import { AppError } from "@/Errors/AppError";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const current = await requireAdmin();
    await dbConnect();
    const { id } = await params;

    if (current.id === id) {
      throw new AppError("You cannot delete your own account", 400);
    }

    const admin = await adminModel.findByIdAndDelete(id);
    if (!admin) throw new AppError("Account not found", 404);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
