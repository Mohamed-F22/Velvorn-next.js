import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import productModel from "@/models/ProductModel";
import { requireAdmin, adminErrorResponse } from "@/lib/adminAuth";
import {
  productCreateSchema,
  validateAdminInput,
} from "@/lib/validation/admin";

function getEffectivePrice(product: {
  price: number;
  offerPrice?: number | null;
}) {
  if (
    product.offerPrice != null &&
    product.offerPrice < product.price
  ) {
    return product.offerPrice;
  }
  return product.price;
}

export async function GET(req: Request) {
  try {
    await requireAdmin();
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const category = searchParams.get("category")?.trim();
    const size = searchParams.get("size")?.trim()?.toLowerCase();
    const offer = searchParams.get("offer") === "true";
    const minPrice = searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined;
    const status = searchParams.get("status")?.trim();
    const sort = searchParams.get("sort")?.trim();

    const filter: Record<string, unknown> = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (size && ["xs", "sm", "md", "lg", "xl"].includes(size)) {
      filter[`stock.${size}`] = { $gt: 0 };
    }
    if (offer) {
      filter.offerPrice = { $ne: null, $gte: 0 };
    }

    let products = await productModel.find(filter).lean();

    products = products.filter((p: any) => {
      const effective = getEffectivePrice(p);
      if (offer && !(p.offerPrice != null && p.offerPrice < p.price)) {
        return false;
      }
      if (minPrice != null && Number.isFinite(minPrice) && effective < minPrice) {
        return false;
      }
      if (maxPrice != null && Number.isFinite(maxPrice) && effective > maxPrice) {
        return false;
      }
      return true;
    });

    if (sort === "price-asc") {
      products.sort(
        (a: any, b: any) => getEffectivePrice(a) - getEffectivePrice(b),
      );
    } else if (sort === "price-desc") {
      products.sort(
        (a: any, b: any) => getEffectivePrice(b) - getEffectivePrice(a),
      );
    } else {
      products.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }

    const categories = [
      ...new Set(
        (
          await productModel.find({}).select("category").lean()
        ).map((p: any) => p.category),
      ),
    ].sort();

    return NextResponse.json({
      products: products.map((p: any) => ({
        ...p,
        _id: p._id.toString(),
      })),
      categories,
    });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    await dbConnect();

    const body = validateAdminInput(productCreateSchema, await req.json());

    const product = await productModel.create({
      ...body,
    });

    return NextResponse.json(
      { product: { ...product.toObject(), _id: product._id.toString() } },
      { status: 201 },
    );
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
