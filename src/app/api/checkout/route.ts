import { dbConnect } from "@/app/lib/mongodb";
import cartModel from "@/app/models/cartModel";
import orderModel from "@/app/models/orderModel";
import productModel from "@/app/models/ProductModel";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const SECRET = process.env.SECRET_JWT as string;
const SHIPPING_FEES = 50;

// ================= UTIL =================
function getUserFromToken(token?: string): string | null {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, SECRET) as { id: string };
    return decoded.id;
  } catch {
    return null;
  }
}

function validateAddress(address: any) {
  const required = [
    "fullName",
    "email",
    "phone",
    "governorate",
    "city",
    "addressDetails",
  ];

  return required.every((field) => address?.[field]);
}

// ================= SERVICE =================
async function buildGuestOrderItems(guestItems: any[]) {
  const productIds = guestItems.map((i) => i.productId);

  const products = await productModel.find({
    _id: { $in: productIds },
  });

  const productMap = new Map();
  products.forEach((p) => productMap.set(p._id.toString(), p));

  let total = 0;
  const items: any[] = [];

  for (const item of guestItems) {
    const product = productMap.get(item.productId);
    if (!product) continue;

    if (product.stock < item.quantity) {
      throw new Error("Not enough stock for some products");
    }

    const price = product.offerPrice || product.price;

    items.push({
      productTitle: product.title,
      productImage: product.imgs[0],
      unitPrice: product.price,
      offerPrice: product.offerPrice || null,
      quantity: item.quantity,
      size: item.size,
    });

    total += price * item.quantity;
  }

  return { items, total };
}

async function buildUserOrderItems(userId: string) {
  const userCart = await cartModel
    .findOne({ userId, status: "active" })
    .populate("items.product");

  if (!userCart || userCart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  const items = userCart.items.map((item: any) => {
    if (item.product.stock < item.quantity) {
      throw new Error("Not enough stock");
    }

    return {
      productTitle: item.product.title,
      productImage: item.product.imgs[0],
      unitPrice: item.product.price,
      offerPrice: item.product.offerPrice,
      quantity: item.quantity,
      size: item.size,
    };
  });

  return { items, total: userCart.totalAmount };
}

// ================= API =================
export async function POST(req: Request) {
  const session = await mongoose.startSession();

  try {
    await dbConnect();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const userId = getUserFromToken(token);

    const body = await req.json();
    const { shippingAddress, notes, guestItems } = body;

    if (!validateAddress(shippingAddress)) {
      return NextResponse.json(
        { message: "Invalid address data!" },
        { status: 400 },
      );
    }

    let orderData;

    if (userId) {
      orderData = await buildUserOrderItems(userId);
    } else if (guestItems?.length > 0) {
      orderData = await buildGuestOrderItems(guestItems);
    } else {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    const finalAmount = orderData.total + SHIPPING_FEES;

    let newOrder: any[] | undefined;
    
    await session.withTransaction(async () => {
      newOrder = await orderModel.create(
        [
          {
            orderItems: orderData.items,
            totalAmount: finalAmount,
            shippingAddress,
            userId: userId || null,
            notes,
          },
        ],
        { session },
      );

      if (userId) {
        await cartModel.findOneAndUpdate(
          { userId, status: "active" },
          { items: [], totalAmount: 0 },
          { session },
        );
      }
    });

    return NextResponse.json(
      { success: true, orderId: newOrder?.[0]._id },
      { status: 201 },
    );
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      { message: error.message || "Server Error" },
      { status: 500 },
    );
  } finally {
    session.endSession();
  }
}
