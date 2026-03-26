import { dbConnect } from "@/lib/mongodb";
import cartModel from "@/models/cartModel";
import orderModel from "@/models/orderModel";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/services/server/userService";
import {
  buildGuestOrderItems,
  buildUserOrderItems,
  validateAddress,
} from "@/services/server/checkoutService";
import { AppError } from "@/Errors/AppError";
import { RequestLog } from "@/models/RequestLog";

const SHIPPING_FEES = 15;

export async function POST(req: Request) {
  try {
    await dbConnect();

    const idempotencyKey = req.headers.get("x-idempotency-key");

    if (idempotencyKey) {
      try {
        await RequestLog.create({ key: idempotencyKey });
      } catch (err: any) {
        if (err.code === 11000) {
          throw new AppError("Request already processed", 409);
        }
        throw err;
      }
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const userId = await getUserFromToken(token);

    const body = await req.json();
    const { shippingAddress, notes, guestItems } = body;

    if (!validateAddress(shippingAddress)) {
      throw new AppError("Invalid address data!", 400);
    }

    let orderData;

    if (userId) {
      orderData = await buildUserOrderItems(userId);
    } else if (guestItems?.length > 0) {
      orderData = await buildGuestOrderItems(guestItems);
    } else {
      throw new AppError("Cart is empty!", 400);
    }

    const finalAmount = orderData.total + SHIPPING_FEES;

    const newOrder = await orderModel.create({
      orderItems: orderData.items,
      totalAmount: finalAmount,
      shippingAddress,
      userId: userId || null,
      notes,
    });

    if (userId) {
      await cartModel.findOneAndUpdate(
        { userId, status: "active" },
        { items: [], totalAmount: 0 },
      );
    }

    return NextResponse.json(
      { success: true, orderId: newOrder?._id },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Order Error:", error);
    return NextResponse.json(
      { message: error.message || "Server Error" },
      { status: 500 },
    );
  }
}
