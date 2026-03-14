import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/mongodb";
import cartModel from "@/app/models/cartModel";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.SECRET_JWT as string;

export async function PUT(req: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET) as { id: string };
    const userId = decoded.id;

    const cart = await cartModel.findOneAndUpdate(
      { userId, status: "active" },
      { 
        $set: { 
          items: [], 
          totalAmount: 0 
        } 
      },
      { new: true }
    );

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Cart cleared successfully",
      cart
    }, { status: 200 });

  } catch (err) {
    console.error("Clear cart error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}