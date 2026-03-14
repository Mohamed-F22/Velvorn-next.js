import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/mongodb";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { deleteItem } from "./service";

const SECRET = process.env.SECRET_JWT as string;

export async function DELETE(req: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET) as { id: string };
    const userId = decoded.id;

    const { productId, size } = await req.json();

    const cart = await deleteItem({ productId, size, userId });

    return NextResponse.json(
      {
        message: "Item removed from cart",
        cart,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Remove from cart error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
