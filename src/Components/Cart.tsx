"use client"
import { Box, Container, IconButton, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRender } from "../Context/visibility/RenderContext";
import Swal from "sweetalert2";
import { useCartStore } from "../Zustand/zustand";

const Cart = () => {
  const { overlayOff } = useRender();
  const {
    cartItems,
    getTotalAmount,
    removeItemFromCart,
    updateItemInCart,
    clearCart,
  } = useCartStore();

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
          lg: "50%",
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
        <Box textAlign={"right"}>
          <IconButton onClick={handleCloseCart}>
            <CloseIcon sx={{ color: "#222" }} />
          </IconButton>
        </Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          flexDirection={"row"}
          mb={5}
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
          </Typography>
          <Button color="error" onClick={() => handleClearCart()}>
            <DeleteIcon />
          </Button>
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
                <Box
                  key={item.title}
                  p={1}
                  display={"flex"}
                  borderBottom={1}
                  borderColor={"#a7a7a7ff"}
                  pb={4}
                  sx={{
                    gap: {
                      xs: 1,
                      sm: 2,
                    },
                  }}
                >
                  <Box
                    component={"img"}
                    src={item.img}
                    sx={{
                      width: { xs: 80, sm: 150, lg: 150 },
                      height: { xs: 90, sm: 160, lg: 160 },
                    }}
                    alt=""
                  />
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
                      {"  "}
                      <Typography color="#555" ml={1} display={"inline"}>
                        ({item.offerPrice ?? item.price} $)
                      </Typography>
                    </Typography>
                    <Box display={"flex"} alignItems={"center"}>
                      <ButtonGroup
                        variant="outlined"
                        aria-label="Basic button group"
                        size="small"
                      >
                        <Button
                          onClick={() =>
                            updateItemInCart(
                              item.id,
                              item.selectedSize,
                              item.quantity - 1,
                              item.selectedSize,
                            )
                          }
                          sx={{ border: "none !important", color: "#222" }}
                        >
                          -
                        </Button>
                        <Button
                          sx={{ border: "none !important", color: "#222" }}
                        >
                          <Typography>{item.quantity}</Typography>
                        </Button>
                        <Button
                          sx={{ border: "none !important", color: "#222" }}
                          onClick={() =>
                            updateItemInCart(
                              item.id,
                              item.selectedSize,
                              item.quantity + 1,
                              item.selectedSize,
                            )
                          }
                        >
                          +
                        </Button>
                      </ButtonGroup>
                      <IconButton
                        onClick={() => {
                          removeItemFromCart(item.id, item.selectedSize);
                        }}
                        sx={{ color: "#cc0000ff" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    <ButtonGroup variant="contained">
                      {["xs", "sm", "m", "lg", "xl"].map((size) => (
                        <Button
                          key={size}
                          onClick={() => {
                            updateItemInCart(
                              item.id,
                              item.selectedSize,
                              item.quantity,
                              size,
                            );
                          }}
                          size="small"
                          sx={{
                            backgroundColor:
                              item.selectedSize === size
                                ? "#c2c2c2ff"
                                : "#e9e9e9ff",
                            color: "#222",
                            outline: "none",
                            border: "none !important",
                            "&:hover": {
                              backgroundColor:
                                item.selectedSize === size
                                  ? "#686868ff"
                                  : "#dcdcdc",
                            },
                          }}
                        >
                          {size}
                        </Button>
                      ))}
                    </ButtonGroup>
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: { xs: 14, sm: 16 },
                        mt: { xs: 1, sm: 0 },
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          display: "inline",
                          fontSize: { xs: 14, sm: 20 },
                        }}
                      >
                        Total Price:
                      </Typography>{" "}
                      {item.offerPrice ?? item.price * item.quantity} $
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              flexDirection={"column"}
            >
              <Typography
                variant="h5"
                sx={{ fontSize: { xs: 18, sm: 25 } }}
                p={2}
              >
                <span style={{ fontWeight: "bold" }}>Total Amount:</span>{" "}
                {getTotalAmount()} $
              </Typography>
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
