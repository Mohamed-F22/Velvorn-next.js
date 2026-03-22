"use client";
import { MouseEvent, useEffect, useState } from "react";
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
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  ClickAwayListener,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import { useRender } from "../Context/visibility/RenderContext";
import { useCartStore } from "@/app/Zustand/CartState";
import { useAuthStore } from "../Zustand/AuthStore";
import { useDebouncedCallback } from "use-debounce";
import { useProductsStore } from "../Zustand/ProductsStore";
import Link from "next/link";

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -8px;
    right: 0px;
  }
`;
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: "rgba(0,0,0,0.1)",
  "&:hover": {
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "30ch",
      },
    },
  },
}));
const SearchResults = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  zIndex: 10,
  marginTop: theme.spacing(1),
  maxHeight: "400px",
  overflowY: "auto",
  boxShadow: theme.shadows[4],
}));

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

  const [open, setOpen] = useState(false);
  const [showSearchField, setShowSearchField] = useState(false);

  const { search, searchProducts, getProducts } = useProductsStore();
  useEffect(() => {
    getProducts();
  }, []);

  const handleSearch = useDebouncedCallback((term: string) => {
    search(term);
    setOpen(term.length > 0);
  }, 300);

  const handleClickAway = () => {
    setOpen(false);
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
          {!showSearchField && (
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
          )}

          {/* LOGO - Mobile */}
          {!showSearchField && (
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
          )}

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
          {/* Search */}
          <ClickAwayListener
            onClickAway={() => {
              handleClickAway();
              setShowSearchField(false);
            }}
          >
            <Box
              sx={{
                flexGrow: showSearchField ? 1 : 0,
                display: "flex",
                alignItems: "center",
                transition: "all 0.3s ease",
              }}
            >
              {!showSearchField && (
                <IconButton
                  onClick={() => setShowSearchField(true)}
                  sx={{ display: { xs: "flex", md: "none" }, color: "#222" }}
                >
                  <SearchIcon />
                </IconButton>
              )}
              <Search
                sx={{
                  display: {
                    xs: showSearchField ? "block" : "none",
                    md: "block",
                  },
                  width: { xs: "100%", md: "auto" },
                }}
              >
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  autoFocus={showSearchField}
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => {
                    if (searchProducts.length > 0) setOpen(true);
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      width: {
                        xs: showSearchField ? "100%" : "12ch",
                        md: "20ch",
                      },
                    },
                  }}
                />
                {open && searchProducts.length > 0 && (
                  <SearchResults>
                    <Typography
                      variant="overline"
                      sx={{
                        px: 2,
                        py: 1,
                        display: "block",
                        color: "text.secondary",
                      }}
                    >
                      PRODUCTS
                    </Typography>
                    <Divider />
                    <List sx={{ p: 0 }}>
                      {searchProducts.map((product) => (
                        <Link
                          style={{ textDecoration: "none" }}
                          href={`/${product._id}`}
                          key={product._id}
                        >
                          <ListItem disablePadding>
                            <ListItemButton
                              onClick={() => {
                                setOpen(false);
                                setShowSearchField(false);
                              }}
                              sx={{ gap: 2 }}
                            >
                              <Box
                                component="img"
                                src={product.imgs[0]}
                                alt={product.title}
                                sx={{
                                  width: 50,
                                  height: 60,
                                  objectFit: "cover",
                                  borderRadius: 1,
                                }}
                              />
                              <ListItemText
                                primary={product.title}
                                primaryTypographyProps={{
                                  fontSize: "0.9rem",
                                  fontWeight: 500,
                                  color: "black",
                                }}
                              />
                            </ListItemButton>
                          </ListItem>
                        </Link>
                      ))}
                    </List>
                  </SearchResults>
                )}
              </Search>
            </Box>
          </ClickAwayListener>
          {/* Right Icons ( User, Cart) */}
          {!showSearchField && (
            <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
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
              {/* --------------------------- */}
                 <IconButton
                  onClick={() => router.push("/login")}
                  sx={{ color: "#222" }}
                >
                  <PersonIcon />
                </IconButton>
                {/* ------------------------ */}
              <IconButton onClick={handleCart} sx={{ color: "#222" }}>
                <CardGiftcardIcon
                  sx={{ fontSize: { xs: "1.2rem", md: "1.5rem" } }}
                />
                <CartBadge
                  badgeContent={getCartCount()}
                  color="primary"
                  overlap="circular"
                />
              </IconButton>
            </Box>
          )}

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
