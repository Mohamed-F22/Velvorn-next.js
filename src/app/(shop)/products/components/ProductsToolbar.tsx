"use client";

import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type ProductsToolbarProps = {
  productCount: number;
};

const SORT_OPTIONS = [
  { value: "", label: "DEFAULT" },
  { value: "price-asc", label: "PRICE: LOW TO HIGH" },
  { value: "price-desc", label: "PRICE: HIGH TO LOW" },
] as const;

export default function ProductsToolbar({ productCount }: ProductsToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") ?? "";

  const handleSortChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const params = new URLSearchParams(searchParams.toString());
      const value = event.target.value;

      if (!value) {
        params.delete("sort");
      } else {
        params.set("sort", value);
      }

      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
        mb: 2,
      }}
    >
      <Typography sx={{ color: "#666", fontSize: 14 }}>
        Showing {productCount} {productCount === 1 ? "product" : "products"}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography
          sx={{
            fontWeight: 700,
            letterSpacing: 1,
            fontSize: 13,
            color: "#666",
          }}
        >
          SORT:
        </Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select
            value={currentSort}
            onChange={handleSortChange}
            displayEmpty
            sx={{
              borderRadius: 0,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 0.5,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#ccc",
              },
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <MenuItem
                key={option.value || "default"}
                value={option.value}
                sx={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.5 }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
}
