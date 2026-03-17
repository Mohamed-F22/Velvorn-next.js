import { create } from "zustand";
import { getProducts } from "../lib/actions";

export interface Product {
  _id: string;
  title: string;
  imgs: string[];
  price: number;
  offerPrice: number | null;
  stock: { xs: number; sm: number; md: number; lg: number; xl: number };
  desc: string;
}

interface ProductsState {
  allProducts: Product[];
  offerProducts: Product[];
  latestDrop: Product[];
  searchProducts: Product[];

  getProducts: () => Promise<void>;
  search: (query: string) => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  allProducts: [],
  offerProducts: [],
  latestDrop: [],
  searchProducts: [],

  getProducts: async () => {
    const productsData = await getProducts();

    set({
      allProducts: productsData.products,
      offerProducts: productsData.offerProducts,
      latestDrop: productsData.latestDrop,
    });
  },

  search: (query) => {
    const { allProducts } = get();

    if (query) {
      const filtered = allProducts.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase()),
      );
      set({ searchProducts: filtered });
    } else {
      set({ searchProducts: [] });
    }
  },
}));
