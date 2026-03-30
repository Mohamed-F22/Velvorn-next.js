import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/mongodb";
import orderModel from "@/models/orderModel";
import { AppError } from "@/Errors/AppError";
import { getUserFromToken } from "@/services/server/userService";

type Context = {
  params: Promise<{ orderId: string }>;
};

export async function PATCH(_: Request, context: Context) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new AppError("Unauthorized. Please login first.", 401);
    }

    const userId = getUserFromToken(token);

    if (!userId) {
      throw new AppError("Invalid token", 401);
    }

    const { orderId } = await context.params;

    const order = await orderModel.findById(orderId);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (!order.userId || order.userId.toString() !== userId) {
      throw new AppError("You are not allowed to cancel this order", 403);
    }

    if (order.status !== "pending") {
      throw new AppError("Only pending orders can be cancelled", 409);
    }

    order.status = "cancelled";
    await order.save();

    return NextResponse.json(
      {
        message: "Order cancelled successfully",
        orderId: order._id,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: err.statusCode || 500 },
    );
  }
}
