import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/mongodb";
import orderModel from "@/models/orderModel";
import { AppError } from "@/Errors/AppError";
import { getUserFromToken } from "@/services/server/userService";

export async function GET() {
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

    const orders = await orderModel
      .find({
        userId,
        status: { $ne: "cancelled" },
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        message: "Orders fetched successfully",
        orders,
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
