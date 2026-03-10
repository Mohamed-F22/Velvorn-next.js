import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!process.env.SECRET_JWT) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    const secret = new TextEncoder().encode(process.env.SECRET_JWT);
    await jwtVerify(token, secret);

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware JWT Error:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/orders", "/profile"],
};
