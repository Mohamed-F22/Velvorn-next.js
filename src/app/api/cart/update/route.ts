import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/mongodb";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { updateItemInCart } from "./service";

const SECRET = process.env.SECRET_JWT as string;

export async function PATCH(req: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET) as { id: string };
    const userId = decoded.id;

    const { productId, size, quantity } = await req.json();

    const cart = await updateItemInCart({ productId, size, quantity, userId });

    return NextResponse.json(
      {
        message: "Cart updated successfully",
        cart,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Update cart error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
