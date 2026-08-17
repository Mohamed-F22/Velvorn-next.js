import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getAdminFromToken,
  AdminTokenPayload,
} from "@/services/server/adminAuthService";
import { AppError } from "@/Errors/AppError";

export async function getAdminSession(): Promise<AdminTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return getAdminFromToken(token);
}

export async function requireStaffOrAdmin(): Promise<AdminTokenPayload> {
  const admin = await getAdminSession();
  if (!admin) {
    throw new AppError("Unauthorized", 401);
  }
  return admin;
}

export async function requireAdmin(): Promise<AdminTokenPayload> {
  const admin = await requireStaffOrAdmin();
  if (admin.role !== "admin") {
    throw new AppError("Forbidden", 403);
  }
  return admin;
}

export function adminErrorResponse(error: any) {
  const status = error?.statusCode || 500;
  return NextResponse.json(
    { message: error?.message || "Server Error" },
    { status },
  );
}
