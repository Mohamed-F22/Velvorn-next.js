"use client";

import { useCartStore } from "@/Zustand/CartState";
import { useEffect } from "react";

const RunFetch = () => {
  const { fetchProducts } = useCartStore();
  useEffect(() => {
    fetchProducts();
  }, []);
  return null;
};

export default RunFetch;
