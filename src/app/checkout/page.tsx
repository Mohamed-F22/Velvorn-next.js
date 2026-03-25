"use client";
import { useAuthStore } from "@/Stores/AuthStore";
import { useCartStore } from "@/Stores/CartState";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  MenuItem,
  Divider,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

const GOVERNORATES = [
  "Cairo",
  "Alexandria",
  "Giza",
  "Dakahlia",
  "Red Sea",
  "Beheira",
  "Fayoum",
  "Gharbia",
  "Ismailia",
  "Monufia",
  "Minya",
  "Qalyubia",
  "New Valley",
  "Suez",
  "Aswan",
  "Assiut",
  "Beni Suef",
  "Port Said",
  "Damietta",
  "South Sinai",
  "Kafr El Sheikh",
  "Matrouh",
  "Luxor",
  "Qena",
  "North Sinai",
  "Soag",
];

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

const Checkout = () => {
  const { cartItems, totalAmount, clearCart } = useCartStore();
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  interface OrderFormData {
    fullName: string;
    email: string;
    phone: string;
    governorate: string;
    city: string;
    addressDetails: string;
    postalCode: string;
    notes: string;
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: "",
      governorate: "Cairo",
      city: "",
      addressDetails: "",
      postalCode: "",
      notes: "",
    },
  });

  const [idempotencyKey, setIdempotencyKey] = useState(uuidv4());

  const onSubmit = async (data: OrderFormData) => {
    const { notes, ...shippingAddress } = data;

    const finalData = {
      guestItems: user
        ? []
        : cartItems.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
            size: item.selectedSize,
          })),
      shippingAddress,
      notes,
    };

    Swal.fire({
      title: "Confirm Order!",
      text: "You won't be able to revert this!",
      confirmButtonColor: "#222",
      confirmButtonText: "Order Now",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Idempotency-Key": idempotencyKey,
          },
          body: JSON.stringify(finalData),
        });

        const fetchResult = await res.json();
        
        if (res.ok) {
          if (fetchResult.message === "Request already processed") {
            setIdempotencyKey(uuidv4());
            return;
          }
          Swal.fire({
            title: "Your order confirmed successfully",
            text: "We started working on it",
            icon: "success",
          });
          router.push("/");
          clearCart();
        }
        setIdempotencyKey(uuidv4());
      }
    });
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container sx={{ minHeight: "100vh" }}>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: "flex",
              justifyContent: "right",
              px: { xs: 1.5, md: 4 },
              pt: "90px",
              mb: "10px",
            }}
          >
            <Box sx={{ width: { xs: "100%", lg: "544px" } }}>
              <Typography variant="h5" mb={3} fontWeight="bold">
                Delivery
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="fullName"
                    control={control}
                    rules={{
                      required: "Full name is required",
                      pattern: {
                        value: /^[a-zA-Z]{2,}\s+[a-zA-Z]{2,}/,
                        message:
                          "Please enter at least two names (First and Last name)",
                      },
                      minLength: {
                        value: 3,
                        message: "Name must be at least 3 characters",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Full name"
                        fullWidth
                        error={!!errors.fullName}
                        helperText={errors.fullName?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email"
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="governorate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        select
                        label="Governorate"
                        fullWidth
                      >
                        {GOVERNORATES.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {opt}
                          </MenuItem>
                        ))}
                      </TextField>
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="city"
                    control={control}
                    rules={{ required: "City is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="City"
                        fullWidth
                        error={!!errors.city}
                        helperText={errors.city?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="addressDetails"
                    control={control}
                    rules={{ required: "Address details are required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Address details"
                        fullWidth
                        multiline
                        rows={2}
                        error={!!errors.addressDetails}
                        helperText={errors.addressDetails?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{ required: "Phone is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Phone"
                        fullWidth
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="postalCode"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Postal code (optional)"
                        fullWidth
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Notes"
                        fullWidth
                        multiline
                        rows={2}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Box mt={4}>
                <Typography variant="h6" mb={2}>
                  Shipping method
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: "#f9faff",
                    borderColor: "#1976d2",
                  }}
                >
                  <Typography>Cash On Delivery</Typography>
                  <Typography fontWeight="bold">15.00 $</Typography>
                </Paper>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  mt: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                Complete order
              </Button>
            </Box>
          </Grid>

          {/* Cart Summary */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              borderLeft: { md: "1px solid #eee" },
              bgcolor: { xs: "transparent", md: "#f5f5f5" },
              px: { xs: 1.5, md: 4 },
              pt: { xs: "15px", md: "90px" },
              mb: "10px",
            }}
          >
            <Box sx={{ width: { xs: "100%", lg: "544px" } }}>
              <Typography variant="h5" mb={3} fontWeight="bold">
                Cart Summary
              </Typography>
              {cartItems.map((item: item) => (
                <Box
                  key={item._id}
                  sx={{ display: "flex", alignItems: "center", mb: 2 }}
                >
                  <Box sx={{ position: "relative", mr: 2 }}>
                    <Box
                      component="img"
                      src={item.imgs[0]}
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 1,
                        border: "1px solid #ddd",
                        objectFit: "cover",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        top: -10,
                        right: -10,
                        bgcolor: "#666",
                        color: "white",
                        borderRadius: "50%",
                        width: 20,
                        height: 20,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                      }}
                    >
                      {item.quantity}
                    </Box>
                  </Box>
                  <Box flexGrow={1}>
                    <Typography variant="body2" fontWeight="500">
                      {item.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.selectedSize || "md"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      color="text.primary"
                      sx={{
                        fontWeight: "bold",
                        mr: 1,
                      }}
                    >
                      {item.offerPrice
                        ? item.offerPrice.toFixed(2)
                        : (item.price * item.quantity).toFixed(2)}{" "}
                      $
                    </Typography>
                    {item.offerPrice && (
                      <Typography
                        sx={{
                          textDecoration: "line-through",
                          color: "text.disabled",
                        }}
                      >
                        {item.price.toFixed(2)} $
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}

              <Divider sx={{ mt: 3, mb: 1 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography fontWeight="500">
                  {totalAmount.toLocaleString()} $
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Typography color="text.secondary">Shipping</Typography>
                <Typography fontWeight="500">15.00 $</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 1,
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  Total
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {(totalAmount + 15).toLocaleString()} $
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default Checkout;
