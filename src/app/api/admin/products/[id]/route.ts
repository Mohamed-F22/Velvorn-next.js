import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import productModel from "@/models/ProductModel";
import { requireAdmin, adminErrorResponse } from "@/lib/adminAuth";
import { AppError } from "@/Errors/AppError";
import {
  productCreateSchema,
  productUpdateSchema,
  validateAdminInput,
} from "@/lib/validation/admin";

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
    const update = validateAdminInput(productUpdateSchema, await req.json());

    const product = await productModel.findById(id);

    if (!product) throw new AppError("Product not found", 404);

    const validatedProduct = validateAdminInput(productCreateSchema, {
      title: product.title,
      category: product.category,
      style: product.style,
      imgs: product.imgs,
      price: product.price,
      offerPrice: product.offerPrice,
      stock: product.stock,
      desc: product.desc,
      status: product.status,
      ...update,
    });

    product.set(validatedProduct);
    await product.save();

    return NextResponse.json({
      product: { ...product.toObject(), _id: product._id.toString() },
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
