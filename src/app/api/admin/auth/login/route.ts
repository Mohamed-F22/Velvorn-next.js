import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { adminLogin } from "@/services/server/adminAuthService";
import { adminErrorResponse } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();
    const { token, payload } = await adminLogin({ email, password });

    const response = NextResponse.json({
      message: "Login success",
      user: {
        id: payload.id,
        fullName: payload.fullName,
        email: payload.email,
        role: payload.role,
      },
    });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
