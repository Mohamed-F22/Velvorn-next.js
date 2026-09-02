import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import couponModel from "@/models/couponModel";
import { requireAdmin, adminErrorResponse } from "@/lib/adminAuth";
import { AppError } from "@/Errors/AppError";
import {
  couponCreateSchema,
  couponUpdateSchema,
  validateAdminInput,
} from "@/lib/validation/admin";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  try {
    await requireAdmin();
    await dbConnect();
    const { id } = await params;
    const update = validateAdminInput(couponUpdateSchema, await req.json());
    const coupon = await couponModel.findById(id);

    if (!coupon) throw new AppError("Coupon not found", 404);

    const validatedCoupon = validateAdminInput(couponCreateSchema, {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      isActive: coupon.isActive,
      expiresAt: coupon.expiresAt?.toISOString() ?? null,
      usageLimit: coupon.usageLimit,
      ...update,
    });

    coupon.set(validatedCoupon);
    await coupon.save();

    return NextResponse.json({
      coupon: { ...coupon.toObject(), _id: coupon._id.toString() },
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
