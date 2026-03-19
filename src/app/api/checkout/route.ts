import { dbConnect } from "@/app/lib/mongodb";
import cartModel from "@/app/models/cartModel";
import orderModel from "@/app/models/orderModel";
import productModel from "@/app/models/ProductModel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { shippingAddress, userId, notes, guestItems } = body;

    let finalOrderItems = [];
    let calculatedTotal = 0;

    if (userId) {
      const userCart = await cartModel
        .findOne({ userId, status: "active" })
        .populate("items.product");

      if (!userCart || userCart.items.length === 0) {
        return NextResponse.json(
          { message: "There's no items in your cart!" },
          { status: 400 },
        );
      }

      finalOrderItems = userCart.items.map((item: any) => ({
        productTitle: item.product.title,
        productImage: item.product.imgs[0],
        unitPrice: item.product.unitPrice,
        offerPrice: item.product.offerPrice,
        quantity: item.quantity,
        size: item.size,
      }));

      calculatedTotal = userCart.totalAmount;
    }
    else if (guestItems && guestItems.length > 0) {
      for (const item of guestItems) {
        const product = await productModel.findById(item.productId);
        if (product) {
          finalOrderItems.push({
            productTitle: product.title,
            productImage: product.imgs[0],
            unitPrice: product.unitPrice,
            offerPrice: product.offerPrice,
            quantity: item.quantity,
            size: item.size,
          });
          calculatedTotal +=
            (product.offerPrice || product.unitPrice) * item.quantity;
        }
      }
    } else {
      return NextResponse.json(
        { message: "لا توجد منتجات للطلب" },
        { status: 400 },
      );
    }

    const finalAmount = calculatedTotal + 50;

    const newOrder = await orderModel.create({
      orderItems: finalOrderItems,
      totalAmount: finalAmount,
      shippingAddress,
      userId: userId || null,
      notes,
    });

    if (userId) {
      await cartModel.findOneAndUpdate(
        { userId, status: "active" },
        { items: [], totalAmount: 0 },
      );
    }

    return NextResponse.json(
      { success: true, orderId: newOrder._id },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error", error: error.message },
      { status: 500 },
    );
  }
}
