"use client";
import { Box, IconButton, Typography } from "@mui/material";
import { useCartStore } from "@/app/Zustand/CartState";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";

interface item {
  _id: string;
  title: string;
  imgs: string[];
  price: number;
  offerPrice: number | null;
  stock: { xs: number; sm: number; md: number; lg: number; xl: number };
  desc: string;
  quantity: number;
  selectedSize: string;
}

const CartItem = (params: { item: item }) => {
  const { item } = params;
  const { removeItemFromCart, updateItemInCart } = useCartStore();

  return (
    <Box
      p={1}
      display={"flex"}
      borderBottom={1}
      borderColor={"#a7a7a7ff"}
      pb={1}
      sx={{
        gap: {
          xs: 1,
          sm: 2,
        },
      }}
    >
      <Box
        sx={{
          width: { xs: 80, sm: 150, lg: 150 },
          height: { xs: 90, sm: 160, lg: 160 },
        }}
      >
        <Image
          src={item.imgs[0]}
          alt={item.title}
          height={160}
          width={150}
          style={{ width: "100%", height: "auto" }}
        />
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        sx={{ gap: { xs: 0, sm: 1 } }}
      >
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: 16, sm: 20, md: 25 },
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}
        >
          {item.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <Typography
            component="span"
            sx={{ fontWeight: "bold", color: "text.primary", mr: 1 }}
          >
            Price:
          </Typography>
          <Typography
            component="span"
            color="text.primary"
            sx={{
              fontWeight: "bold",
              mr: 1,
            }}
          >
            $
            {item.offerPrice
              ? item.offerPrice.toFixed(2)
              : (item.price * item.quantity).toFixed(2)}
          </Typography>
          {item.offerPrice && (
            <Typography
              component="span"
              sx={{
                textDecoration: "line-through",
                color: "text.disabled",
              }}
            >
              ${item.price.toFixed(2)}
            </Typography>
          )}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #ccc",
              width: "fit-content",
            }}
          >
            <IconButton
              onClick={() => {
                updateItemInCart(
                  item._id,
                  item.selectedSize,
                  item.quantity - 1,
                  item.selectedSize,
                );
              }}
              size="small"
              sx={{ borderRadius: 0, p: 1.5 }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography sx={{ width: 40, textAlign: "center" }}>
              {item.quantity}
            </Typography>
            <IconButton
              onClick={() => {
                const currentStock =
                  item.stock[
                    item.selectedSize.toLowerCase() as keyof typeof item.stock
                  ];
                if (item.quantity < currentStock) {
                  updateItemInCart(
                    item._id,
                    item.selectedSize,
                    item.quantity + 1,
                    item.selectedSize,
                  );
                }
              }}
              size="small"
              sx={{
                borderRadius: 0,
                p: 1.5,
                color:
                  item.quantity >=
                  item.stock[
                    item.selectedSize.toLowerCase() as keyof typeof item.stock
                  ]
                    ? "#ccc"
                    : "inherit",
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
          <IconButton
            onClick={() => {
              removeItemFromCart(item._id, item.selectedSize);
            }}
            sx={{ color: "#cc0000ff" }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Size: {item.selectedSize}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontSize: { xs: 14, sm: 16 },
          }}
        >
          <Typography
            component="span"
            sx={{
              fontWeight: "bold",
              display: "inline",
              fontSize: { xs: 14, sm: 20 },
            }}
          >
            Total Price:
          </Typography>{" "}
          <Typography
            component="span"
            color="text.primary"
            sx={{
              fontWeight: "bold",
              mr: 1,
            }}
          >
            {item.offerPrice
              ? item.offerPrice * item.quantity
              : item.price * item.quantity}{" "}
            $
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default CartItem;
