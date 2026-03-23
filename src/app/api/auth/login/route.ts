import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { RequestLog } from "@/models/RequestLog";
import { login } from "@/services/server/userService";
import { AppError } from "@/Errors/AppError";

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

    const { email, password } = await req.json();
    const { user, token } = await login({ email, password });

    const response = NextResponse.json({
      message: "Login success",
      token: token,
      user: {
        fullName: user.fullName,
        email: user.email,
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
