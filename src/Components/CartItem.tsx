"use client";
import { Box, IconButton, Typography } from "@mui/material";
import { useCartStore } from "@/Stores/CartState";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import { useDebouncedCallback } from "use-debounce";

interface item {
  _id: string;
  title: string;
  imgs: string[];
  price: number;
  offerPrice: number | null;
  stock: { xs: number; sm: number; md: number; lg: number; xl: number };
  quantity: number;
  selectedSize: string;
}

const CartItem = (params: { item: item }) => {
  const { item } = params;
  const { removeItemFromCart, updateItemInCart, updateLocalQuantity } =
    useCartStore();

  const debouncedUpdateApi = useDebouncedCallback(
    (id: string, size: string, quantity: number) => {
      updateItemInCart(id, size, quantity);
    },
    500,
  );

  const handleQuantityChange = (newQty: number) => {
    updateLocalQuantity(item._id, item.selectedSize, newQty);

    debouncedUpdateApi(item._id, item.selectedSize, newQty);
  };

  return (
    <Box
      p={1}
      display={"flex"}
      borderBottom={1}
      borderColor={"#a7a7a7ff"}
      pb={1}
      sx={{
        overflow: "hidden",
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
                if (item.quantity > 1) {
                  handleQuantityChange(item.quantity - 1);
                }
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
                  handleQuantityChange(item.quantity + 1);
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
