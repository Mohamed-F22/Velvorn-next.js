import { NextResponse } from "next/server";
import { getAdminSession, adminErrorResponse } from "@/lib/adminAuth";

export async function GET() {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
