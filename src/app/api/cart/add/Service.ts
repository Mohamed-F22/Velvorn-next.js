
import { NextResponse } from "next/server";
import cartModel from "@/app/models/cartModel";

interface addItemToCart {
  productId: any;
  quantity: number;
  unitPrice: number;
  size: string;
  userId: string;
}

export const addItemToCart = async ({
  productId,
  quantity,
  unitPrice,
  size,
  userId,
}: addItemToCart) => {
  if (!productId || !quantity || !unitPrice || !size) {
    return NextResponse.json(
      { message: "Missing product data (including size)" },
      { status: 400 },
    );
  }

  let cart = await cartModel.findOne({ userId, status: "active" });

  if (!cart) {
    cart = await cartModel.create({
      userId,
      items: [],
      totalAmount: 0,
    });
  }

  const itemIndex = cart.items.findIndex(
    (item: any) => item.product.toString() === productId && item.size === size,
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      unitPrice,
      size,
    });
  }

  cart.totalAmount = cart.items.reduce((acc: number, item: any) => {
    return acc + item.quantity * item.unitPrice;
  }, 0);

  await cart.save();
  return cart;
};
