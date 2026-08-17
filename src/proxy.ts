import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const adminToken = request.cookies.get("admin_token")?.value;
  const isLoggedIn = !!token;
  const isAdminLoggedIn = !!adminToken;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    if (pathname === "/dashboard/login") {
      if (isAdminLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      return NextResponse.next();
    }

    if (!isAdminLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }

    return NextResponse.next();
  }

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
