"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import Link from "next/link";

function CheckoutNavbar() {
  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#fff",
        color: "#222",
        height: "56px",
        zIndex: 10,
        borderBottom: "1px solid #eee",
      }}
      elevation={0}
    >
      <Container>
        <Toolbar disableGutters sx={{ minHeight: "56px !important", gap: 2 }}>
          <Typography
            component={Link}
            href="/"
            sx={{
              textDecoration: "none",
              color: "inherit",
              fontWeight: 700,
              letterSpacing: ".2rem",
              fontFamily: "monospace",
            }}
          >
            VELVORN
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            component={Link}
            href="/"
            startIcon={<ArrowBackIcon />}
            sx={{ textTransform: "none", color: "#222" }}
          >
            Continue Shopping
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default CheckoutNavbar;
