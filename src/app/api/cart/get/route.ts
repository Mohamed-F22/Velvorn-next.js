import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/mongodb";
import cartModel from "@/app/models/cartModel";
import productModel from "@/app/models/ProductModel";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { RequestLog } from "@/app/models/RequestLog";

const SECRET = process.env.SECRET_JWT as string;

export async function GET(req: Request) {
  try {
    await dbConnect();

    const idempotencyKey = req.headers.get("x-idempotency-key");

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET) as { id: string };
    const userId = decoded.id;

    if (idempotencyKey) {
      try {
        await RequestLog.create({ key: idempotencyKey });
      } catch (err: any) {
        if (err.code === 11000) {
          return NextResponse.json(
            { message: "Request already processed" },
            { status: 200 },
          );
        }
        throw err;
      }
    }

    const cart = await cartModel
      .findOne({ userId, status: "active" })
      .populate({
        path: "items.product",
        model: productModel,
        select: "title imgs price offerPrice stock desc",
      });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Cart fetched successfully",
        cart,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Get cart error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
