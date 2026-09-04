import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUserFromToken } from "@/services/server/userService";
import { AppError } from "@/Errors/AppError";

/**
 * Extracts and validates the customer session from the request cookie.
 * Returns the userId string on success.
 * Throws AppError(401) if the token is missing or invalid.
 *
 * Mirrors requireAdmin() / requireStaffOrAdmin() used in admin routes.
 */
export async function requireCustomer(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new AppError("Unauthorized. Please login first.", 401);
  }

  const userId = getUserFromToken(token);

  if (!userId) {
    throw new AppError("Invalid token", 401);
  }

  return userId;
}

/**
 * Standard error response for customer routes.
 * Mirrors adminErrorResponse() used in admin routes.
 */
export function customerErrorResponse(error: any) {
  const status = error?.statusCode || 500;
  return NextResponse.json(
    { message: error?.message || "Server Error" },
    { status },
  );
}
