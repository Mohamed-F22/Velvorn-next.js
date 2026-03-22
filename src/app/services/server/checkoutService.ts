import { AppError } from "../../Errors/AppError";
import cartModel from "../../models/cartModel";
import productModel from "../../models/ProductModel";

export function validateAddress(address: any) {
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

export async function buildGuestOrderItems(guestItems: any[]) {
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
      throw new AppError("Not enough stock for some products", 400);
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

export async function buildUserOrderItems(userId: string) {
  const userCart = await cartModel
    .findOne({ userId, status: "active" })
    .populate("items.product");

  if (!userCart || userCart.items.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  const items = userCart.items.map((item: any) => {
    if (item.product.stock < item.quantity) {
      throw new AppError("Not enough stock", 400);
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
