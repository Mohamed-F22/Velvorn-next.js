import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import orderModel from "@/models/orderModel";
import {
  requireStaffOrAdmin,
  adminErrorResponse,
} from "@/lib/adminAuth";
import { AppError } from "@/Errors/AppError";
import { ORDER_STATUSES } from "@/lib/constants";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  try {
    await requireStaffOrAdmin();
    await dbConnect();
    const { id } = await params;
    const { status } = await req.json();

    if (!ORDER_STATUSES.includes(status as (typeof ORDER_STATUSES)[number])) {
      throw new AppError("Invalid order status", 400);
    }

    const order = await orderModel
      .findByIdAndUpdate(id, { $set: { status } }, { new: true })
      .lean();

    if (!order) throw new AppError("Order not found", 404);

    return NextResponse.json({
      order: {
        ...order,
        _id: (order as any)._id.toString(),
        userId: (order as any).userId?.toString?.() || null,
      },
    });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
