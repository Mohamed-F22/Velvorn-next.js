"use client";

import FilterContent from "./FilterContent";

type FilterSidebarProps = {
  categories: string[];
  maxPrice: number;
};

export default function FilterSidebar({
  categories,
  maxPrice,
}: FilterSidebarProps) {
  return <FilterContent categories={categories} maxPrice={maxPrice} />;
}
