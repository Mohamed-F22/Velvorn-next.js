import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import userModel from "@/models/userModel";
import orderModel from "@/models/orderModel";
import { requireAdmin, adminErrorResponse } from "@/lib/adminAuth";

export async function GET() {
  try {
    await requireAdmin();
    await dbConnect();

    const users = await userModel.find({}).lean();
    const aggregates = await orderModel.aggregate([
      {
        $match: {
          userId: { $ne: null },
          status: { $nin: ["cancelled"] },
        },
      },
      {
        $group: {
          _id: "$userId",
          orderCount: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" },
        },
      },
    ]);

    const statsMap = new Map(
      aggregates.map((a) => [
        a._id.toString(),
        { orderCount: a.orderCount, totalSpent: a.totalSpent },
      ]),
    );

    const customers = users
      .map((u: any) => {
        const stats = statsMap.get(u._id.toString()) || {
          orderCount: 0,
          totalSpent: 0,
        };
        return {
          _id: u._id.toString(),
          fullName: u.fullName,
          email: u.email,
          orderCount: stats.orderCount,
          totalSpent: stats.totalSpent,
        };
      })
      .sort((a, b) => b.totalSpent - a.totalSpent);

    return NextResponse.json({ customers });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
