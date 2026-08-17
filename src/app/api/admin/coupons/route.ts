import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import couponModel from "@/models/couponModel";
import { requireAdmin, adminErrorResponse } from "@/lib/adminAuth";
import { AppError } from "@/Errors/AppError";

export async function GET() {
  try {
    await requireAdmin();
    await dbConnect();
    const coupons = await couponModel.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      coupons: coupons.map((c: any) => ({ ...c, _id: c._id.toString() })),
    });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    await dbConnect();
    const body = await req.json();
    const { code, type, value, isActive = true, expiresAt, usageLimit } = body;

    if (!code || !type || value == null) {
      throw new AppError("code, type and value are required", 400);
    }

    if (type === "percent" && (value < 0 || value > 100)) {
      throw new AppError("Percent value must be between 0 and 100", 400);
    }

    const coupon = await couponModel.create({
      code: String(code).toUpperCase().trim(),
      type,
      value,
      isActive,
      expiresAt: expiresAt || null,
      usageLimit: usageLimit ?? null,
    });

    return NextResponse.json(
      { coupon: { ...coupon.toObject(), _id: coupon._id.toString() } },
      { status: 201 },
    );
  } catch (error: any) {
    if (error?.code === 11000) {
      return adminErrorResponse(new AppError("Coupon code already exists", 409));
    }
    return adminErrorResponse(error);
  }
}
