"use client"
import { Box, Button, Container, Fade, Slide, Typography } from "@mui/material";
import Image from "next/image";

const Landing = () => {
  return (
    <Box
      className="landing"
      sx={{
        minHeight: "calc(100vh - 64px)",
        background:
          "linear-gradient(90deg, #939393 0%, #d1d5db 50%, #e5e7eb 100%)",
        display: "flex",
        alignItems: "center",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        mt: "64px",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          height: { xs: "80%", sm: "90%", md: "98%" },
          width: { xs: "100%", md: "50%" },
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1,
        }}
      >
        <Slide direction="up" in={true} timeout={1000}>
          <Box
            sx={{
              height: "100%",
            }}
          >
            <Fade in={true} timeout={2000}>
              <Image
                src="/landing.png"
                alt="landing"
                width={800}
                height={600}
                style={{
                  height: "100%",
                  width: "auto",
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              />
            </Fade>
          </Box>
        </Slide>
      </Box>
      <Container>
        <Box>
          <Fade in={true} timeout={1000}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, mb: 1, color: "white" }}
            >
              Power Meets Purpose
            </Typography>
          </Fade>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Slide direction="right" in={true} timeout={500}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: "700",
                  fontSize: { xs: "3.7rem", sm: "5rem", md: "10rem" },
                  letterSpacing: "0.2em",
                  lineHeight: 1,
                  mb: 4,
                  color: "#222",
                }}
              >
                VELV
              </Typography>
            </Slide>
            <Slide direction="left" in={true} timeout={800}>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: "700",
                  fontSize: { xs: "3.7rem", sm: "5rem", md: "10rem" },
                  letterSpacing: "0.2em",
                  lineHeight: 1,
                  mb: 4,
                  color: "#222",
                }}
              >
                ORN
              </Typography>
            </Slide>
          </Box>
          <Fade in={true} timeout={1000}>
            <Box>
              <Typography
                variant="body1"
                sx={{
                  maxWidth: "400px",
                  mb: 4,
                  color: "#fff",
                  lineHeight: 1.6,
                }}
              >
                If you want it more aggressive, luxury, streetwear, or
                gym-focused, tell me and I'll tailor it exactly.If you want it
                more aggressive, luxury, streetwear, or gym-focused.
              </Typography>
              <Box>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#222",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "0",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "#444",
                    },
                    zIndex: 2,
                  }}
                >
                  Explore All Categories
                </Button>
              </Box>
            </Box>
          </Fade>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;
