import { dbConnect } from "@/lib/mongodb";
import cartModel from "@/models/cartModel";
import orderModel from "@/models/orderModel";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { getUserFromToken } from "@/services/server/userService";
import {
  buildGuestOrderItems,
  buildUserOrderItems,
  validateAddress,
} from "@/services/server/checkoutService";
import { AppError } from "@/Errors/AppError";

const SHIPPING_FEES = 15;

export async function POST(req: Request) {
  const session = await mongoose.startSession();

  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const userId = getUserFromToken(token);

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
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    const finalAmount = orderData.total + SHIPPING_FEES;

    let newOrder: any[] | undefined;

    await session.withTransaction(async () => {
      newOrder = await orderModel.create(
        [
          {
            orderItems: orderData.items,
            totalAmount: finalAmount,
            shippingAddress,
            userId: userId || null,
            notes,
          },
        ],
        { session },
      );

      if (userId) {
        await cartModel.findOneAndUpdate(
          { userId, status: "active" },
          { items: [], totalAmount: 0 },
          { session },
        );
      }
    });

    return NextResponse.json(
      { success: true, orderId: newOrder?.[0]._id },
      { status: 201 },
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { message: error.message || "Server Error" },
      { status: 500 },
    );
  } finally {
    session.endSession();
  }
}
