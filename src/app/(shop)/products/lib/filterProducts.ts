import { Product } from "@/lib/actions";

export type ProductFilters = {
  categories?: string[];
  sizes?: string[];
  minPrice?: number;
  maxPrice?: number;
  offer?: boolean;
};

const STOCK_SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

export function getEffectivePrice(product: Product) {
  if (product.offerPrice !== null && product.offerPrice < product.price) {
    return product.offerPrice;
  }
  return product.price;
}

export function isOnOffer(product: Product) {
  return product.offerPrice !== null && product.offerPrice < product.price;
}

export function filterProducts(products: Product[], filters: ProductFilters) {
  return products.filter((product) => {
    if (filters.categories?.length) {
      const productCategory = product.category.toLowerCase();
      const matchesCategory = filters.categories.some(
        (category) => category.toLowerCase() === productCategory,
      );
      if (!matchesCategory) return false;
    }

    if (filters.sizes?.length) {
      const matchesSize = filters.sizes.some((size) => {
        const key = size.toLowerCase() as (typeof STOCK_SIZES)[number];
        return STOCK_SIZES.includes(key) && product.stock[key] > 0;
      });
      if (!matchesSize) return false;
    }

    const effectivePrice = getEffectivePrice(product);

    if (filters.minPrice !== undefined && effectivePrice < filters.minPrice) {
      return false;
    }

    if (filters.maxPrice !== undefined && effectivePrice > filters.maxPrice) {
      return false;
    }

    if (filters.offer && !isOnOffer(product)) {
      return false;
    }

    return true;
  });
}

export function parseProductFilters(searchParams: {
  category?: string;
  size?: string;
  minPrice?: string;
  maxPrice?: string;
  offer?: string;
}): ProductFilters {
  const categories = searchParams.category
    ?.split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  const sizes = searchParams.size
    ?.split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  const minPrice = searchParams.minPrice
    ? Number(searchParams.minPrice)
    : undefined;
  const maxPrice = searchParams.maxPrice
    ? Number(searchParams.maxPrice)
    : undefined;

  return {
    categories: categories?.length ? categories : undefined,
    sizes: sizes?.length ? sizes : undefined,
    minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    offer: searchParams.offer === "true",
  };
}

export function formatCategoryLabel(category: string) {
  return category
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getUniqueCategories(products: Product[]) {
  return [...new Set(products.map((product) => product.category.toLowerCase()))].sort();
}

export type SortOption = "price-asc" | "price-desc";

export function sortProducts(products: Product[], sort?: string) {
  if (sort !== "price-asc" && sort !== "price-desc") {
    return products;
  }

  const sorted = [...products];

  if (sort === "price-asc") {
    sorted.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
  } else {
    sorted.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
  }

  return sorted;
}
