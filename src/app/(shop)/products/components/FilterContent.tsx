"use client";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { formatCategoryLabel } from "../lib/filterProducts";

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

type FilterContentProps = {
  categories: string[];
  maxPrice: number;
};

export default function FilterContent({
  categories,
  maxPrice,
}: FilterContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedCategories = useMemo(
    () =>
      searchParams
        .get("category")
        ?.split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean) ?? [],
    [searchParams],
  );

  const selectedSizes = useMemo(
    () =>
      searchParams
        .get("size")
        ?.split(",")
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean) ?? [],
    [searchParams],
  );

  const minPrice = Number(searchParams.get("minPrice") ?? 0);
  const maxPriceParam = Number(searchParams.get("maxPrice") ?? maxPrice);
  const inOffer = searchParams.get("offer") === "true";

  const [price, setPrice] = useState<number[]>([
    Number.isFinite(minPrice) ? minPrice : 0,
    Number.isFinite(maxPriceParam) ? maxPriceParam : maxPrice,
  ]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (!value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const debouncedPriceUpdate = useDebouncedCallback((values: number[]) => {
    updateParams({
      minPrice: values[0] > 0 ? String(values[0]) : null,
      maxPrice: values[1] < maxPrice ? String(values[1]) : null,
    });
  }, 400);

  const toggleCategory = (category: string) => {
    const normalized = category.toLowerCase();
    const next = selectedCategories.includes(normalized)
      ? selectedCategories.filter((value) => value !== normalized)
      : [...selectedCategories, normalized];

    updateParams({
      category: next.length ? next.join(",") : null,
    });
  };

  const toggleSize = (size: string) => {
    const next = selectedSizes.includes(size)
      ? selectedSizes.filter((value) => value !== size)
      : [...selectedSizes, size];

    updateParams({
      size: next.length ? next.join(",") : null,
    });
  };

  const handleClearAll = () => {
    setPrice([0, maxPrice]);
    const sort = searchParams.get("sort");
    router.push(sort ? `${pathname}?sort=${sort}` : pathname, { scroll: false });
  };

  return (
    <Box sx={{ pr: { xs: 0, md: 3 } }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          letterSpacing: 2,
          mb: 2,
          display: { xs: "none", md: "block" },
        }}
      >
        FILTERS
      </Typography>

      <Typography
        sx={{
          fontWeight: 700,
          letterSpacing: 2,
          mb: 1,
          fontSize: 14,
        }}
      >
        CATEGORY
      </Typography>

      <Stack mb={1}>
        {categories.map((category) => (
          <FormControlLabel
            key={category}
            control={
              <Checkbox
                checked={selectedCategories.includes(category.toLowerCase())}
                onChange={() => toggleCategory(category)}
                sx={{
                  color: "#666",
                  "&.Mui-checked": {
                    color: "#222",
                  },
                }}
              />
            }
            label={formatCategoryLabel(category)}
          />
        ))}
      </Stack>

      <Typography
        sx={{
          fontWeight: 700,
          letterSpacing: 2,
          mb: 2,
          fontSize: 14,
        }}
      >
        SIZE
      </Typography>

      <Stack direction="row" spacing={1} flexWrap="wrap" mb={4} useFlexGap>
        {SIZES.map((size) => {
          const isSelected = selectedSizes.includes(size);

          return (
            <Button
              key={size}
              variant={isSelected ? "contained" : "outlined"}
              onClick={() => toggleSize(size)}
              sx={{
                borderRadius: "25px",
                minWidth: { xs: 30, md: 60 },
                height: "40px",
                textTransform: "none",
                color: isSelected ? "#fff" : "#222",
                borderColor: "#ccc",
                bgcolor: isSelected ? "#222" : "transparent",
                "&:hover": {
                  bgcolor: isSelected ? "#333" : "#f5f5f5",
                  borderColor: "#222",
                },
              }}
            >
              {size.toUpperCase()}
            </Button>
          );
        })}
      </Stack>

      <Typography
        sx={{
          fontWeight: 700,
          letterSpacing: 2,
          mb: 1,
          fontSize: 14,
        }}
      >
        OFFERS
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={inOffer}
            onChange={(_, checked) =>
              updateParams({ offer: checked ? "true" : null })
            }
            sx={{
              color: "#666",
              "&.Mui-checked": {
                color: "#222",
              },
            }}
          />
        }
        label="On offer only"
        sx={{ mb: 1 }}
      />

      <Typography
        sx={{
          fontWeight: 700,
          letterSpacing: 2,
          mb: 2,
          fontSize: 14,
        }}
      >
        PRICE
      </Typography>

      <Slider
        value={price}
        onChange={(_, value) => {
          const nextPrice = value as number[];
          setPrice(nextPrice);
          debouncedPriceUpdate(nextPrice);
        }}
        min={0}
        max={maxPrice || 1}
        sx={{
          color: "#222",
        }}
      />

      <Stack direction="row" justifyContent="space-between" sx={{ mb: 4 }}>
        <Typography>{price[0]} $</Typography>
        <Typography>{price[1]} $</Typography>
      </Stack>

      <Button
        fullWidth
        variant="outlined"
        onClick={handleClearAll}
        sx={{
          color: "#222",
          borderColor: "#ccc",
        }}
      >
        Clear All
      </Button>
    </Box>
  );
}
