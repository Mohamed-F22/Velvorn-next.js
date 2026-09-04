import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { register } from "@/services/server/userService";
import { RequestLog } from "@/models/RequestLog";
import { AppError } from "@/Errors/AppError";
import { registerSchema, validateInput } from "@/lib/validation/customer";

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

    const body = validateInput(registerSchema, await req.json());
    const { fullName, email } = body;
    const token = await register(body);

    const response = NextResponse.json({
      message: "Welcome To Velvorn",
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
      maxAge: 60 * 60 * 24 * 7, // 7 days — matches JWT expiresIn
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: err.statusCode || 500 },
    );
  }
}
