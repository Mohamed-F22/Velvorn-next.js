"use client";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import SearchIcon from "@mui/icons-material/Search";
import { useRender } from "../Context/visibility/RenderContext";
import { Badge, badgeClasses } from "@mui/material";
import styled from "@emotion/styled";
import { useCartStore } from "../Zustand/zustand";
import { MouseEvent, useState } from "react";

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -8px;
    right: 0px;
  }
`;

function Navbar() {
  const { cartItems } = useCartStore();
  const { overlayOn } = useRender();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(
    null,
  );

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCart = () => {
    const cart = document.getElementById("cart");
    if (cart?.classList.contains("active-cart")) {
      cart.classList.remove("active-cart");
    } else cart?.classList.add("active-cart");
    overlayOn();
  };

  return (
    <AppBar
      position="fixed"
      sx={{ backgroundColor: "#fff", color: "#222", height: "64px", zIndex: 10 }}
      
    >
      <Container>
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 10,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            VELVORN
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {" "}
            <Button sx={{ my: 2, color: "black", display: "block" }}>
              Women
            </Button>
            <Button sx={{ my: 2, color: "black", display: "block" }}>
              Men
            </Button>
            <Button sx={{ my: 2, color: "black", display: "block" }}>
              Categories
            </Button>
          </Box>
          <Box
            sx={{
              flexGrow: 0,
              display: { xs: "none", md: "flex" },
              alignItems: "center",
            }}
          >
            {" "}
            <IconButton sx={{ color: "#222" }}>
              <SearchIcon sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }} />
            </IconButton>
            <IconButton onClick={handleCart} sx={{ color: "#222" }}>
              <CardGiftcardIcon
                sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }}
              />
              <CartBadge
                badgeContent={cartItems.length}
                color="primary"
                overlap="circular"
              />
            </IconButton>
          </Box>
          {/* small */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box sx={{ flexGrow: 1, display: { xs: "flex" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                <MenuItem>
                  <Typography sx={{ textAlign: "center" }}>Women</Typography>
                </MenuItem>
                <MenuItem>
                  <Typography sx={{ textAlign: "center" }}>Men</Typography>
                </MenuItem>
                <MenuItem>
                  <Typography sx={{ textAlign: "center" }}>
                    Categories
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
              }}
            >
              Velvorn
            </Typography>
            <Box sx={{ flexGrow: 0, display: " flex", alignItems: "center" }}>
              {" "}
              <IconButton sx={{ color: "#222" }}>
                <SearchIcon sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }} />
              </IconButton>
              <IconButton onClick={handleCart} sx={{ color: "#222" }}>
                <CardGiftcardIcon
                  sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }}
                />
                <CartBadge
                  badgeContent={cartItems.length}
                  color="primary"
                  overlap="circular"
                />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
