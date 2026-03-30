import { create } from "zustand";
import { getProducts } from "../lib/actions";

export interface Product {
  _id: string;
  title: string;
  category: string;
  style: string[];
  imgs: string[];
  price: number;
  offerPrice: number | null;
  stock: { xs: number; sm: number; md: number; lg: number; xl: number };
  desc: string;
}

interface ProductsState {
  allProducts: Product[];
  searchQuery: string;
  searchProducts: Product[];
  similarProducts: Product[];

  getProducts: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  getSimilarProducts: (data: {
    style: string[];
    id: string;
    category: string;
  }) => void;
}

export const useProductsStore = create<ProductsState>((set, get) => ({
  allProducts: [],
  searchQuery: "",
  searchProducts: [],

  getProducts: async () => {
    const productsData = await getProducts();

    set({
      allProducts: productsData.products,
    });
  },

  setSearchQuery: (query) => {
    const { allProducts } = get();
    const normalized = (query ?? "").trim();

    if (!normalized) {
      set({
        searchQuery: "",
        searchProducts: allProducts.slice(0, 5),
      });
      return;
    }

    const lowered = normalized.toLowerCase();
    const filtered = allProducts
      .filter((product) => product.title.toLowerCase().includes(lowered))
      .slice(0, 5);

    set({ searchQuery: normalized, searchProducts: filtered });
  },

  clearSearch: () => {
    const { allProducts } = get();
    set({
      searchQuery: "",
      searchProducts: allProducts.slice(0, 5),
    });
  },

  similarProducts: [],
  getSimilarProducts: ({
    style,
    id,
    category,
  }: {
    style: string[];
    id: string;
    category: string;
  }) => {
    const { allProducts } = get();

    if (style && style.length > 0) {
      const targetCategory = category.toLowerCase();

      const filtered = allProducts.filter(
        (product) =>
          product._id !== id &&
          product.style.some((s) =>
            style.map((str) => str.toLowerCase()).includes(s.toLowerCase()),
          ),
      );

      const sorted = filtered.sort((a, b) => {
        const isACatMatch = a.category.toLowerCase() === targetCategory;
        const isBCatMatch = b.category.toLowerCase() === targetCategory;

        if (isACatMatch && !isBCatMatch) return -1;
        if (!isACatMatch && isBCatMatch) return 1;
        return 0;
      });

      set({ similarProducts: sorted });
    } else {
      set({ similarProducts: [] });
    }
  },
}));
