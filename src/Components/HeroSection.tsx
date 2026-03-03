"use client"

import { Box, Typography, Button, Container } from "@mui/material";

const HeroSection = () => {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(180deg, #939393 0%, #8b8b8bff 0%, #8b8b8bff 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: {
          md: "100px 20px",
          xs: "40px 10px",
        },
        color: "#ffffff",
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: "bold",
            mb: 2,
            whiteSpace: "normal",
            fontSize: {
              xs: 25,
              sm: 45,
            },
          }}
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-offset="100"
        >
          Empower Every Move <br /> with Style
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            opacity: 0.9,
            maxWidth: "600px",
            margin: "0 auto 32px",
          }}
          data-aos="fade-up"
          data-aos-duration="1250"
          data-aos-offset="100"
        >
          Discover a collection that champions both performance and design. Each
          piece is meticulously created to elevate your workout.
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1a1a1a",
            color: "white",
            padding: "12px 30px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#333333",
            },
          }}
          data-aos="fade-up"
          data-aos-duration="1500"
          data-aos-offset="100"
        >
          Shop the Collection
        </Button>
      </Container>
    </Box>
  );
};

export default HeroSection;
