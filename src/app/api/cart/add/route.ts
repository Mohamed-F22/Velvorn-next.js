import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/services/server/userService";
import { addItemToCart } from "@/services/server/cartService";
import { AppError } from "@/Errors/AppError";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const cookieStore = await cookies();

    const token = cookieStore.get("token")?.value;    

    if (!token) {
      throw new AppError("Unauthorized. Please login first.", 401);
    }

    const userId = await getUserFromToken(token);    

    if (!userId) {
      throw new AppError("Invalid token", 401);
    }

    const { productId, quantity, size } = await req.json();

    if (!productId || !quantity || !size) {
      throw new AppError("Missing some data!", 400);
    }

    const cart = await addItemToCart({
      productId,
      quantity,
      size,
      userId,
    });

    return NextResponse.json(
      {
        message: "Product added to cart successfully",
        cart,
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
