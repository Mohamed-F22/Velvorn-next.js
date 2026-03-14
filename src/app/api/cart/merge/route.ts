import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/mongodb";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { mergeLocalCart } from "./Service";

const SECRET = process.env.SECRET_JWT as string;

export async function POST(req: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET) as { id: string };
    const userId = decoded.id;

    const { localItems } = await req.json();

    const cart = await mergeLocalCart(localItems, userId);

    return NextResponse.json(
      {
        message: "Cart merged successfully",
        cart,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Merge error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
