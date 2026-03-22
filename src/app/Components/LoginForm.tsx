"use client";

import { TextField, Button, Box, Typography, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../Zustand/AuthStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert } from "./Alert";
import { useCartStore } from "../Zustand/CartState";
import { v4 as uuidv4 } from "uuid";

type LoginInputs = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginInputs>();
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const [idempotencyKey, setIdempotencyKey] = useState(uuidv4());

  const onSubmit = async (data: LoginInputs) => {
    try {
      // console.log("Before Login:", idempotencyKey);

      const result = await login(data, idempotencyKey);

      console.log(result);
      

      if (result.status === 401) {
        if (result.message !== "Request already processed") {
          setIdempotencyKey(uuidv4());
          return;
        }
        Alert.fire({
          icon: "error",
          title: result.message,
        });
        return;
      }

      Alert.fire({
        icon: "success",
        title: result.message,
      });
      setIdempotencyKey(uuidv4());

      router.push("/");

      const { cartItems } = useCartStore.getState();

      // console.log("After Login:", idempotencyKey);
      if (cartItems.length > 0) {
        await useCartStore.getState().syncCartWithServer();
      } else {
        await useCartStore.getState().fetchUserCart();
      }

      reset();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#f5f5f5",
          width: "100vw",
          height: "100vh",
          position: "relative",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            width: { xs: "70%", sm: "60%", md: "30%" },
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: "1px solid #ccc",
            borderRadius: 2,
            padding: 4,
            backgroundColor: "white",
            boxShadow: "0px 0px 25px 3px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography variant="h5" mb={1}>
            Login to your Account
          </Typography>

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ""}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min length is 6" },
            })}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ""}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#1c1f22",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            Login
          </Button>
          <Typography variant="body2" mt={2} textAlign="center">
            <Link
              sx={{
                cursor: "pointer",
                color: "#222",
                "&:hover": { color: "#333" },
                textAlign: "center",
              }}
              onClick={() => router.push("/register")}
              underline="hover"
            >
              Don't have an account? Register
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
}
