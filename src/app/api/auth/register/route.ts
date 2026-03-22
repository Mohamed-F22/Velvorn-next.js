import { NextResponse } from "next/server";
import { dbConnect } from "@/app/lib/mongodb";
import { register } from "@/app/services/server/userService";
import { RequestLog } from "@/app/models/RequestLog";
import { AppError } from "@/app/Errors/AppError";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const idempotencyKey = req.headers.get("x-idempotency-key");
    if (idempotencyKey) {
      try {
        await RequestLog.create({ key: idempotencyKey });
      } catch (err: any) {
        if (err.code === 11000) {
          throw new AppError("Request already processed", 409);
        }
        throw err;
      }
    }

    const { fullName, email, password } = await req.json();
    const token = await register({ fullName, email, password });

    const response = NextResponse.json({
      message: "Welcome To Velvorn",
      token,
      user: {
        fullName,
        email,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: err.statusCode || 500 },
    );
  }
}
