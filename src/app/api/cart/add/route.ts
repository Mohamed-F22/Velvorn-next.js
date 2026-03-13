import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/mongodb";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { addItemToCart } from "./Service";

const SECRET = process.env.SECRET_JWT as string;

export async function POST(req: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized. Please login first." },
        { status: 401 },
      );
    }

    const decoded = jwt.verify(token, SECRET) as { id: string };
    const userId = decoded.id;

    const { productId, quantity, unitPrice, size } = await req.json();

    const cart = await addItemToCart({productId, quantity, unitPrice, size, userId});

    return NextResponse.json(
      {
        message: "Product added to cart successfully",
        cart,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Add to cart error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
