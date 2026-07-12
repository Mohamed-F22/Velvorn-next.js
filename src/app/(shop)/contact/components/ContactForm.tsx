"use client";

import { Alert } from "@/Components/Alert";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

type ContactInputs = {
  name: string;
  email: string;
  phone: string;
  comment: string;
};

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactInputs>();

  const onSubmit = async () => {
    Alert.fire({
      icon: "success",
      title: "Message sent successfully",
    });
    reset();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 720, mx: "auto" }}
    >
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography sx={{ mb: 1 }}>
          for exchange contact us on social media platforms.
        </Typography>
        <Typography sx={{ mb: 1 }}>
          for any other issues send us on our e-mail.
        </Typography>
        <Typography sx={{ fontWeight: 700 }}>support@velvorn.com</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            placeholder="Name"
            variant="outlined"
            {...register("name")}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 0,
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            placeholder="Email *"
            variant="outlined"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Invalid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 0,
              },
            }}
          />
        </Grid>
      </Grid>

      <TextField
        fullWidth
        placeholder="Phone number"
        variant="outlined"
        {...register("phone")}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
          },
        }}
      />

      <TextField
        fullWidth
        placeholder="Comment"
        variant="outlined"
        multiline
        rows={6}
        {...register("comment")}
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
          },
        }}
      />

      <Button
        type="submit"
        variant="contained"
        sx={{
          bgcolor: "#222",
          color: "#fff",
          borderRadius: 0,
          px: 5,
          py: 1.25,
          textTransform: "none",
          fontWeight: 600,
          "&:hover": {
            bgcolor: "#444",
          },
        }}
      >
        Send
      </Button>
    </Box>
  );
}
