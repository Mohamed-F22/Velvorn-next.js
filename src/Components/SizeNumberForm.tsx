"use client";
import { useState } from "react";
import { Box, Button, Typography, Stack, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useCartStore } from "../Stores/CartState";

interface stock {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

const SizeNumberForm = (params: { stock: stock; productId: string }) => {
  const [size, setSize] = useState("MD");
  const [quantity, setQuantity] = useState(1);
  const { addItemToCart } = useCartStore();
  const sizes = ["XS", "SM", "MD", "LG", "XL"];

  const handleAddItemToCart = () => {
    addItemToCart(params.productId, size.toLowerCase() as string, quantity);
  };

  return (
    <Box>
      <Typography
        variant="body2"
        color="text.secondary"
        gutterBottom
        sx={{ mb: 1.5 }}
      >
        Size
      </Typography>
      <Stack direction="row" spacing={{ xs: 1, md: 2 }} sx={{ mb: 3 }}>
        {sizes.map((s) => {
          if (params.stock[s.toLowerCase() as keyof stock] === 0) {
            return;
          }
          return (
            <Button
              key={s}
              variant={size === s ? "contained" : "outlined"}
              onClick={() => {
                (setSize(s), setQuantity(1));
              }}
              sx={{
                borderRadius: "25px",
                minWidth: { xs: 30, md: 60 },
                height: "40px",
                textTransform: "none",
                backgroundColor: size === s ? "#222" : "transparent",
                color: size === s ? "#fff" : "#222",
                borderColor: "#ccc",
                "&:hover": {
                  backgroundColor: size === s ? "#333" : "#f5f5f5",
                  borderColor: "#222",
                },
              }}
            >
              {s}
            </Button>
          );
        })}
      </Stack>

      <Typography
        variant="body2"
        color="text.secondary"
        gutterBottom
        sx={{ mb: 1.5 }}
      >
        Quantity (
        {`Stock: ${params.stock[size.toLowerCase() as keyof stock]} items of this size`}
        )
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #ccc",
          width: "fit-content",
          mb: 3,
        }}
      >
        <IconButton
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          size="small"
          sx={{ borderRadius: 0, p: 1.5 }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Typography sx={{ width: 40, textAlign: "center" }}>
          {quantity}
        </Typography>
        <IconButton
          onClick={() => {
            const currentStock =
              params.stock[size.toLowerCase() as keyof typeof params.stock];
            if (quantity < currentStock) {
              setQuantity(quantity + 1);
            }
          }}
          size="small"
          sx={{
            borderRadius: 0,
            p: 1.5,
            color:
              quantity >=
              params.stock[size.toLowerCase() as keyof typeof params.stock]
                ? "#ccc"
                : "inherit",
          }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <Stack spacing={1.5}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => handleAddItemToCart()}
          sx={{
            py: 1.5,
            color: "#222",
            borderColor: "#222",
            textTransform: "none",
            fontSize: "1rem",
            "&:hover": { borderColor: "#222", backgroundColor: "#f9f9f9" },
          }}
        >
          Add to cart
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{
            py: 1.5,
            backgroundColor: "#222",
            color: "#fff",
            textTransform: "none",
            fontSize: "1rem",
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          Buy it now
        </Button>
      </Stack>
    </Box>
  );
};

export default SizeNumberForm;
