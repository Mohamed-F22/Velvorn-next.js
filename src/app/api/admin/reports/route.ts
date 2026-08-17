import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import orderModel from "@/models/orderModel";
import { requireAdmin, adminErrorResponse } from "@/lib/adminAuth";
import {
  buildCreatedAtFilter,
  parseDatePeriodFromSearchParams,
} from "@/lib/datePeriod";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const period = parseDatePeriodFromSearchParams(searchParams);
    const createdAt = buildCreatedAtFilter(period);

    const filter: Record<string, unknown> = {};
    if (createdAt) filter.createdAt = createdAt;

    const orders = await orderModel.find(filter).lean();

    const nonCancelled = orders.filter((o) => o.status !== "cancelled");
    const returned = orders.filter((o) => o.status === "returned");
    const salesOrders = nonCancelled.filter((o) => o.status !== "returned");

    const totalSales = salesOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const orderCount = salesOrders.length;
    const averageOrderValue = orderCount ? totalSales / orderCount : 0;
    const returnsRate = nonCancelled.length
      ? (returned.length / nonCancelled.length) * 100
      : 0;

    const productMap = new Map<
      string,
      { title: string; quantity: number; revenue: number }
    >();

    for (const order of salesOrders) {
      for (const item of order.orderItems) {
        const key = item.productTitle;
        const existing = productMap.get(key) || {
          title: item.productTitle,
          quantity: 0,
          revenue: 0,
        };
        const unit = item.offerPrice ?? item.unitPrice;
        existing.quantity += item.quantity;
        existing.revenue += unit * item.quantity;
        productMap.set(key, existing);
      }
    }

    const ranked = [...productMap.values()].sort(
      (a, b) => b.quantity - a.quantity,
    );

    return NextResponse.json({
      period,
      totalSales,
      orderCount,
      averageOrderValue,
      returnsRate,
      topProducts: ranked.slice(0, 5),
      bottomProducts: [...ranked].reverse().slice(0, 5),
    });
  } catch (error: any) {
    return adminErrorResponse(error);
  }
}
