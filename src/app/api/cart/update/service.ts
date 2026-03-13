import { NextResponse } from "next/server";
import cartModel from "@/app/models/cartModel";

interface updateItemInCart {
  productId: string;
  size: string;
  quantity: number;
  userId: string;
}

export const updateItemInCart = async ({
  productId,
  size,
  quantity,
  userId,
}: updateItemInCart) => {
  if (!productId || !size || quantity === undefined) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 },
    );
  }

  if (quantity < 1) {
    return NextResponse.json(
      { message: "Quantity must be at least 1" },
      { status: 400 },
    );
  }

  const cart = await cartModel.findOne({ userId, status: "active" });

  if (!cart) {
    return NextResponse.json({ message: "Cart not found" }, { status: 404 });
  }

  const itemIndex = cart.items.findIndex(
    (item: any) => item.product.toString() === productId && item.size === size,
  );

  if (itemIndex === -1) {
    return NextResponse.json(
      { message: "Item not found in cart" },
      { status: 404 },
    );
  }

  cart.items[itemIndex].quantity = quantity;

  cart.totalAmount = cart.items.reduce((acc: number, item: any) => {
    return acc + item.quantity * item.unitPrice;
  }, 0);

  await cart.save();
  return cart;
};
