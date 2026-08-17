import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import productModel from "@/models/ProductModel";
import { requireAdmin, adminErrorResponse } from "@/lib/adminAuth";
import { AppError } from "@/Errors/AppError";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    await requireAdmin();
    await dbConnect();
    const { id } = await params;

    const product = await productModel.findById(id).lean();
    if (!product) throw new AppError("Product not found", 404);

    return NextResponse.json({
      product: { ...product, _id: (product as any)._id.toString() },
    });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    await requireAdmin();
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    const product = await productModel
      .findByIdAndUpdate(id, { $set: body }, { new: true })
      .lean();

    if (!product) throw new AppError("Product not found", 404);

    return NextResponse.json({
      product: { ...product, _id: (product as any)._id.toString() },
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

    const product = await productModel.findByIdAndDelete(id);
    if (!product) throw new AppError("Product not found", 404);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
