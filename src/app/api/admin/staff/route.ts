import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import adminModel from "@/models/adminModel";
import {
  requireAdmin,
  adminErrorResponse,
} from "@/lib/adminAuth";
import { createAdminAccount } from "@/services/server/adminAuthService";

export async function GET() {
  try {
    await requireAdmin();
    await dbConnect();
    const staff = await adminModel.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      staff: staff.map((s: any) => ({
        _id: s._id.toString(),
        fullName: s.fullName,
        email: s.email,
        role: s.role,
        createdAt: s.createdAt,
      })),
    });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    await dbConnect();
    const body = await req.json();
    const admin = await createAdminAccount(body);

    return NextResponse.json(
      {
        staff: {
          _id: admin._id.toString(),
          fullName: admin.fullName,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
