"use client";
import { MouseEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
  Avatar,
  Badge,
  badgeClasses,
  Divider,
  styled,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";

import { useRender } from "../Context/visibility/RenderContext";
import { useCartStore } from "@/app/Zustand/CartState";
import { useAuthStore } from "../Zustand/AuthStore";

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -8px;
    right: 0px;
  }
`;

function Navbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { getCartCount } = useCartStore();
  const { overlayOn } = useRender();
  const router = useRouter();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) =>
    setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) =>
    setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleCart = () => {
    const cart = document.getElementById("cart");
    cart?.classList.toggle("active-cart");
    overlayOn();
  };

  const navPages = ["Women", "Men", "Categories"];

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "#fff",
        color: "#222",
        height: "64px",
        zIndex: 10,
      }}
    >
      <Container>
        <Toolbar disableGutters>
          {/* LOGO - Desktop */}
          <Typography
            variant="h6"
            noWrap
            onClick={() => router.push("/")}
            sx={{
              mr: 4,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: ".3rem",
              color: "inherit",
              fontFamily: "monospace",
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
            }}
          >
            VELVORN
          </Typography>

          {/* Mobile Menu Icon */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {navPages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* LOGO - Mobile */}
          <Typography
            variant="h5"
            noWrap
            onClick={() => router.push("/")}
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              fontWeight: 700,
              cursor: "pointer",
              letterSpacing: ".3rem",
              color: "inherit",
              fontFamily: "monospace",
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
            }}
          >
            VELVORN
          </Typography>

          {/* Desktop Links */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {navPages.map((page) => (
              <Button
                key={page}
                sx={{ my: 2, color: "black", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Right Icons (Search, User, Cart) */}
          <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
            <IconButton sx={{ color: "#222" }}>
              <SearchIcon />
            </IconButton>

            {user ? (
              <Avatar
                onClick={handleOpenUserMenu}
                sx={{
                  bgcolor: "#1976d2",
                  width: 30,
                  height: 30,
                  fontSize: "small",
                  mx: 1,
                  cursor: "pointer",
                }}
              >
                {user.fullName?.charAt(0)}
              </Avatar>
            ) : (
              <IconButton
                onClick={() => router.push("/login")}
                sx={{ color: "#222" }}
              >
                <PersonIcon />
              </IconButton>
            )}

            <IconButton onClick={handleCart} sx={{ color: "#222" }}>
              <CartBadge badgeContent={getCartCount()} color="primary">
                <CardGiftcardIcon />
              </CartBadge>
            </IconButton>
          </Box>

          {/* Common User Menu (Rendered Once) */}
          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            PaperProps={{ sx: { width: 220, mt: "7px" } }}
          >
            <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar sx={{ bgcolor: "#1976d2" }}>
                {user?.fullName?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="subtitle2">{user?.fullName}</Typography>
                <Typography
                  variant="caption"
                  color="primary"
                  sx={{ cursor: "pointer" }}
                >
                  View Profile
                </Typography>
              </Box>
            </Box>
            <Divider />
            <MenuItem onClick={handleCloseUserMenu}>My Orders</MenuItem>
            <MenuItem
              onClick={() => {
                logout();
                handleCloseUserMenu();
              }}
            >
              <Typography color="error">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
