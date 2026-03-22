"use client";
import { Box, Container, IconButton, Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { useRender } from "../Context/visibility/RenderContext";
import Swal from "sweetalert2";
import { useCartStore } from "@/app/Zustand/CartState";
import CartItem from "./CartItem";

const Cart = () => {
  const { overlayOff } = useRender();
  const { cartItems, totalAmount, clearCart } = useCartStore();

  const handleClearCart = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#9c27b0",
      confirmButtonText: "Yes, Clear it!",
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        Swal.fire({
          title: "Cart has been cleared!",
          icon: "success",
        });
      }
    });
  };

  const handleCloseCart = () => {
    const cart = document.getElementById("cart");
    cart?.classList.remove("active-cart");
    overlayOff();
  };

  const handleGoToCheckout = () => {};

  return (
    <Box
      id="cart"
      className="cart"
      sx={{
        width: {
          xs: "90%",
          sm: "80%",
          md: "60%",
          lg: "40%",
        },
        transition: "0.5s",
        position: "fixed",
        height: "100vh",
        overflowY: "scroll",
        overflowX: "hidden",
        zIndex: 100,
        backgroundColor: "#fff",
      }}
    >
      <Container sx={{ pt: 3, pb: 3 }}>
        <Box textAlign={"right"}></Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          flexDirection={"row"}
          mb={1}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 30,
                sm: 40,
              },
            }}
            variant="h3"
          >
            Your Cart
          </Typography>{" "}
          <IconButton onClick={handleCloseCart}>
            <CloseIcon sx={{ color: "#222" }} />
          </IconButton>
        </Box>
        {cartItems.length > 0 ? (
          <>
            <Box
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              gap={3}
            >
              {cartItems.map((item) => (
                <CartItem item={item} key={item.title + item.selectedSize} />
              ))}
            </Box>

            <Box
              display={"flex"}
              justifyContent={"space-between"}
              flexDirection={"column"}
            >
              <Box display={"flex"} justifyContent={"space-between"} flexWrap={"wrap"}>
                <Typography variant="h5" sx={{ fontSize: { xs: 18, sm: 25 } }}>
                  <span style={{ fontWeight: "bold" }}>Total Amount:</span>{" "}
                  {totalAmount} $
                </Typography>{" "}
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleClearCart()}
                >
                  Clear your cart
                </Button>
              </Box>
              <Button
                variant="contained"
                onClick={handleGoToCheckout}
                sx={{
                  width: "100%",
                  backgroundColor: "#222",
                  color: "white",
                  padding: "10px 30px",
                  borderRadius: "0",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#444",
                  },
                }}
              >
                Checkout
              </Button>
            </Box>
          </>
        ) : (
          <>
            {" "}
            <Typography variant="h5" color="#fff">
              Cart is empety.
            </Typography>
            <Typography color="#7e7e7eff">
              Please start shopping and add itemas first
            </Typography>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Cart;
