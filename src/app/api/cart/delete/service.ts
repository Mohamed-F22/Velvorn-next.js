import { NextResponse } from "next/server";
import cartModel from "@/app/models/cartModel";

interface deleteItem {
  productId: string;
  size: string;
  userId: string;
}

export const deleteItem = async ({ productId, size, userId }: deleteItem) => {
  if (!productId || !size) {
    return NextResponse.json(
      { message: "Missing productId or size" },
      { status: 400 },
    );
  }

  const cart = await cartModel.findOne({ userId, status: "active" });

  if (!cart) {
    return NextResponse.json({ message: "Cart not found" }, { status: 404 });
  }

  const originalLength = cart.items.length;
  cart.items = cart.items.filter(
    (item: any) =>
      !(item.product.toString() === productId && item.size === size),
  );

  if (cart.items.length === originalLength) {
    return NextResponse.json(
      { message: "Item not found in cart" },
      { status: 404 },
    );
  }

  cart.totalAmount = cart.items.reduce((acc: number, item: any) => {
    return acc + item.quantity * item.unitPrice;
  }, 0);

  await cart.save();
  return cart;
};
