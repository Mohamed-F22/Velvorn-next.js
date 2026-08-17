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
import {
  applyCoupon,
  getShippingFee,
} from "@/services/server/pricingService";
import { AppError } from "@/Errors/AppError";
import { RequestLog } from "@/models/RequestLog";
import { ensureAdminSeeded } from "@/lib/seedAdmin";
import couponModel from "@/models/couponModel";

export async function POST(req: Request) {
  try {
    await dbConnect();
    await ensureAdminSeeded();

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
    const { shippingAddress, notes, guestItems, couponCode } = body;

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

    const shippingFee = await getShippingFee(shippingAddress.governorate);
    const { discountAmount, couponCode: appliedCode, coupon } =
      await applyCoupon(couponCode, orderData.total);

    const finalAmount = Math.max(
      0,
      orderData.total + shippingFee - discountAmount,
    );

    const newOrder = await orderModel.create({
      orderItems: orderData.items,
      totalAmount: finalAmount,
      shippingFee,
      discountAmount,
      couponCode: appliedCode,
      shippingAddress,
      userId: userId || null,
      notes,
    });

    if (coupon) {
      await couponModel.findByIdAndUpdate(coupon._id, {
        $inc: { usedCount: 1 },
      });
    }

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
      { status: error.statusCode || 500 },
    );
  }
}
