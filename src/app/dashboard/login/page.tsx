"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useAdminAuthStore } from "@/Stores/AdminAuthStore";

type LoginInputs = {
  email: string;
  password: string;
};

export default function DashboardLoginPage() {
  const router = useRouter();
  const { login, fetchMe, user, hydrated } = useAdminAuthStore();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>({
    defaultValues: { email: "example@gmail.com", password: "" },
  });

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (hydrated && user) {
      router.replace(
        user.role === "staff" ? "/dashboard/orders" : "/dashboard",
      );
    }
  }, [hydrated, user, router]);

  const onSubmit = async (data: LoginInputs) => {
    setError("");
    const result = await login(data.email, data.password);
    if (!result.success) {
      setError(result.message || "Login failed");
      return;
    }
    const me = useAdminAuthStore.getState().user;
    router.replace(me?.role === "staff" ? "/dashboard/orders" : "/dashboard");
  };

  if (!hydrated) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress sx={{ color: "#222" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: 4,
          border: "1px solid #e0e0e0",
          borderRadius: 0,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, letterSpacing: 2, mb: 1 }}
        >
          VELVORN
        </Typography>
        <Typography sx={{ color: "#666", mb: 3 }}>Dashboard Login</Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Email"
            sx={{ mb: 2 }}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            sx={{ mb: 2 }}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min length is 6" },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          {error && (
            <Typography color="error" sx={{ mb: 2, fontSize: 14 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{
              bgcolor: "#222",
              borderRadius: 0,
              py: 1.25,
              "&:hover": { bgcolor: "#444" },
            }}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
