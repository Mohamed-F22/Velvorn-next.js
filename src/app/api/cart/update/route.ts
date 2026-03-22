import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/mongodb";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/app/services/server/userService";
import { AppError } from "@/app/Errors/AppError";
import { updateItemInCart } from "@/app/services/server/cartService";

export async function PATCH(req: Request) {
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

    const { productId, size, quantity } = await req.json();

    const cart = await updateItemInCart({ productId, size, quantity, userId });

    return NextResponse.json(
      {
        message: "Cart updated successfully",
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
