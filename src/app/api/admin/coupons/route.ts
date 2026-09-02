import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import couponModel from "@/models/couponModel";
import { requireAdmin, adminErrorResponse } from "@/lib/adminAuth";
import { AppError } from "@/Errors/AppError";
import {
  couponCreateSchema,
  validateAdminInput,
} from "@/lib/validation/admin";

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
    const body = validateAdminInput(couponCreateSchema, await req.json());

    const coupon = await couponModel.create({
      ...body,
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
