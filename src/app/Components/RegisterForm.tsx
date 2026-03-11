"use client";

import { TextField, Button, Box, Typography, Link } from "@mui/material";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../Zustand/AuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Alert } from "./Alert";

type RegisterInputs = {
  fullName: string;
  email: string;
  password: string;
};

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterInputs>();

  const registerUser = useAuthStore((state) => state.register);
  const router = useRouter();

  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const onSubmit = async (data: RegisterInputs) => {
    try {
      const result = await registerUser(data);
      if (result.status === 400) {
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
      router.push("/");
      reset();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
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
          width: { xs: "85%", sm: "60%", md: "30%" },
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
          Create an Account
        </Typography>

        <TextField
          label="Full Name"
          fullWidth
          margin="normal"
          {...register("fullName", {
            required: "Full Name is required",
            pattern: {
              value: /^[a-zA-Z]{2,}\s+[a-zA-Z]{2,}/,
              message: "Please enter at least two names (First and Last name)",
            },
            minLength: {
              value: 3,
              message: "Name must be at least 3 characters",
            },
          })}
          error={!!errors.fullName}
          helperText={errors.fullName ? errors.fullName.message : ""}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
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
          Register
        </Button>

        <Typography variant="body2" mt={2} textAlign="center">
          <Link
            sx={{
              cursor: "pointer",
              color: "#222",
              "&:hover": { color: "#333" },
              textAlign: "center",
            }}
            onClick={() => router.push("/login")}
            underline="hover"
          >
            Already have an account? Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}
