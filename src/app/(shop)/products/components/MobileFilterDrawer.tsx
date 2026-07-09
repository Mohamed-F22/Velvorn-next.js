"use client";

import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import FilterContent from "./FilterContent";

type MobileFilterDrawerProps = {
  categories: string[];
  maxPrice: number;
};

export default function MobileFilterDrawer({
  categories,
  maxPrice,
}: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        startIcon={<TuneIcon />}
        onClick={() => setOpen(true)}
        sx={{
          display: { xs: "flex", md: "none" },
          mb: 2,
          py: 1.5,
          color: "#222",
          borderColor: "#ccc",
          borderRadius: 0,
          fontWeight: 700,
          letterSpacing: 2,
          justifyContent: "center",
        }}
      >
        FILTERS
      </Button>

      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: "min(320px, 85vw)",
            p: 3,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, letterSpacing: 2 }}
          >
            FILTERS
          </Typography>
          <IconButton onClick={() => setOpen(false)} aria-label="Close filters">
            <CloseIcon />
          </IconButton>
        </Box>

        <FilterContent categories={categories} maxPrice={maxPrice} />
      </Drawer>
    </>
  );
}
