import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/mongodb";
import { cookies } from "next/headers";
// import { RequestLog } from "@/app/models/RequestLog";
import { getUserFromToken } from "@/app/services/server/userService";
import { AppError } from "@/app/Errors/AppError";
import { mergeLocalCart } from "@/app/services/server/cartService";

export async function POST(req: Request) {
  try {
    await dbConnect();

    // const idempotencyKey = req.headers.get("x-idempotency-key");

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      throw new AppError("Unauthorized. Please login first.", 401);
    }

    const userId = await getUserFromToken(token);

    if (!userId) {
      throw new AppError("Invalid token", 401);
    }

    // if (idempotencyKey) {
    //   try {
    //     await RequestLog.create({ key: idempotencyKey });
    //   } catch (err: any) {
    //     if (err.code === 11000) {
    //       return NextResponse.json(
    //         { message: "Request already processed" },
    //         { status: 200 },
    //       );
    //     }
    //     throw err;
    //   }
    // }

    const { localItems } = await req.json();

    const cart = await mergeLocalCart(localItems, userId);

    return NextResponse.json(
      {
        message: "Cart merged successfully",
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
