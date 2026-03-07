// app/actions.ts
"use server";

import productModel from "../models/ProductModel";
import { dbConnect } from "./mongodb";

export interface Product {
  _id: string;
  title: string;
  imgs: string[];
  price: number;
  offerPrice: number | null;
  stock: { xs: number; sm: number; md: number; lg: number; xl: number };
  desc: string;
}

export async function getProducts() {
  await dbConnect();

  const productsFromDB = await productModel.find({}).lean();

  const products: Product[] = productsFromDB.map((product: any) => ({
    ...product,
    _id: product._id.toString(),
  }));

  const offerProducts = products.filter(
    (p) => p.offerPrice !== null && p.offerPrice < p.price,
  );
  const latestDrop = products.filter(
    (p) => p.offerPrice === null || p.offerPrice >= p.price,
  );

  return { offerProducts, latestDrop, products };
}

export async function getProduct(id: string) {
  try {
    await dbConnect();

    const product = await productModel
      .findById(id)
      .lean();

    if (!product) return null;

    return {
      ...product,
      _id: product._id.toString(),
    };
  } catch (error) {
    console.error("Database error fetching product for cart:", error);
    return null;
  }
}
