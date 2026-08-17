import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import orderModel from "@/models/orderModel";
import {
  requireStaffOrAdmin,
  adminErrorResponse,
} from "@/lib/adminAuth";
import mongoose from "mongoose";
import {
  buildCreatedAtFilter,
  parseDatePeriodFromSearchParams,
} from "@/lib/datePeriod";

export async function GET(req: Request) {
  try {
    await requireStaffOrAdmin();
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const period = parseDatePeriodFromSearchParams(searchParams);
    const q = searchParams.get("q")?.trim();
    const status = searchParams.get("status");

    const filter: Record<string, unknown> = {};

    const createdAt = buildCreatedAtFilter(period);
    if (createdAt) filter.createdAt = createdAt;

    if (status) filter.status = status;

    if (q) {
      const or: Record<string, unknown>[] = [
        { "shippingAddress.fullName": { $regex: q, $options: "i" } },
        { "shippingAddress.email": { $regex: q, $options: "i" } },
        { couponCode: { $regex: q, $options: "i" } },
      ];
      if (mongoose.Types.ObjectId.isValid(q)) {
        or.push({ _id: new mongoose.Types.ObjectId(q) });
      }
      filter.$or = or;
    }

    const orders = await orderModel.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      orders: orders.map((o: any) => ({
        ...o,
        _id: o._id.toString(),
        userId: o.userId?.toString?.() || null,
      })),
    });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
