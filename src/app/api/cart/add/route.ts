import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { requireCustomer, customerErrorResponse } from "@/lib/customerAuth";
import { addItemToCart } from "@/services/server/cartService";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const userId = await requireCustomer();

    const { productId, quantity, size } = await req.json();

    if (!productId || !quantity || !size) {
      return NextResponse.json({ message: "Missing some data!" }, { status: 400 });
    }

    const cart = await addItemToCart({
      productId,
      quantity,
      size,
      userId,
    });

    return NextResponse.json(
      {
        message: "Product added to cart successfully",
        cart,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return customerErrorResponse(err);
  }
}
