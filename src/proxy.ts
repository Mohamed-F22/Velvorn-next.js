import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * Verifies a JWT token using jose (Edge-compatible).
 * Returns true only if the token is valid and not expired.
 */
async function isValidToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.SECRET_JWT;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const adminToken = request.cookies.get("admin_token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    if (pathname === "/dashboard/login") {
      if (await isValidToken(adminToken)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.next();
    }

    if (!(await isValidToken(adminToken))) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }

    return NextResponse.next();
  }

  const isLoggedIn = await isValidToken(token);

  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isLoggedIn && (pathname === "/orders" || pathname === "/profile")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/orders",
    "/profile",
    "/dashboard",
    "/dashboard/:path*",
  ],
};
