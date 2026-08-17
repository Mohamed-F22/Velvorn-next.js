import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import couponModel from "@/models/couponModel";
import { requireAdmin, adminErrorResponse } from "@/lib/adminAuth";
import { AppError } from "@/Errors/AppError";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  try {
    await requireAdmin();
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    if (body.code) body.code = String(body.code).toUpperCase().trim();

    const coupon = await couponModel
      .findByIdAndUpdate(id, { $set: body }, { new: true })
      .lean();

    if (!coupon) throw new AppError("Coupon not found", 404);

    return NextResponse.json({
      coupon: { ...coupon, _id: (coupon as any)._id.toString() },
    });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await requireAdmin();
    await dbConnect();
    const { id } = await params;
    const coupon = await couponModel.findByIdAndDelete(id);
    if (!coupon) throw new AppError("Coupon not found", 404);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
