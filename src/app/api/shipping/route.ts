import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import shippingRateModel from "@/models/shippingRateModel";
import { DEFAULT_SHIPPING_PRICE } from "@/lib/constants";

export async function GET() {
  try {
    await dbConnect();
    const rates = await shippingRateModel
      .find({ isActive: true })
      .select("governorate price")
      .lean();

    return NextResponse.json({
      defaultPrice: DEFAULT_SHIPPING_PRICE,
      rates: rates.map((r) => ({
        governorate: r.governorate,
        price: r.price,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
