import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import shippingRateModel from "@/models/shippingRateModel";
import { requireAdmin, adminErrorResponse } from "@/lib/adminAuth";
import { AppError } from "@/Errors/AppError";
import { ensureAdminSeeded } from "@/lib/seedAdmin";

export async function GET() {
  try {
    await requireAdmin();
    await dbConnect();
    await ensureAdminSeeded();

    const rates = await shippingRateModel.find({}).sort({ governorate: 1 }).lean();
    return NextResponse.json({
      rates: rates.map((r: any) => ({ ...r, _id: r._id.toString() })),
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
    const { governorate, price, isActive = true } = body;

    if (!governorate || price == null) {
      throw new AppError("governorate and price are required", 400);
    }

    const rate = await shippingRateModel.create({
      governorate,
      price,
      isActive,
    });

    return NextResponse.json(
      { rate: { ...rate.toObject(), _id: rate._id.toString() } },
      { status: 201 },
    );
  } catch (error: any) {
    if (error?.code === 11000) {
      return adminErrorResponse(
        new AppError("Governorate already exists", 409),
      );
    }
    return adminErrorResponse(error);
  }
}
