import productModel from "@/models/Product";
import { dbConnect } from "./mongodb";

export interface Product {
  _id: string;
  title: string;
  img: string;
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

  function splitProducts(products: Product[]) {
    const offerProducts: Product[] = [];
    const latestDrop: Product[] = [];

    for (const product of products) {
      const hasValidOffer =
        product.offerPrice !== null && product.offerPrice < product.price;

      if (hasValidOffer) {
        offerProducts.push(product);
      } else {
        latestDrop.push(product);
      }
    }

    return {
      offerProducts,
      latestDrop,
    };
  }

  const { offerProducts, latestDrop } = splitProducts(products);

  return { offerProducts, latestDrop, products };
}
