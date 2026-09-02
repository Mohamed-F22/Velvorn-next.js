import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import shippingRateModel from "@/models/shippingRateModel";
import { requireAdmin, adminErrorResponse } from "@/lib/adminAuth";
import { AppError } from "@/Errors/AppError";
import {
  shippingRateUpdateSchema,
  validateAdminInput,
} from "@/lib/validation/admin";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  try {
    await requireAdmin();
    await dbConnect();
    const { id } = await params;
    const update = validateAdminInput(
      shippingRateUpdateSchema,
      await req.json(),
    );

    const rate = await shippingRateModel
      .findByIdAndUpdate(id, { $set: update }, { new: true, runValidators: true })
      .lean();

    if (!rate) throw new AppError("Shipping rate not found", 404);

    return NextResponse.json({
      rate: { ...rate, _id: (rate as any)._id.toString() },
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
    const rate = await shippingRateModel.findByIdAndDelete(id);
    if (!rate) throw new AppError("Shipping rate not found", 404);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
