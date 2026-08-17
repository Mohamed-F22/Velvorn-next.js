"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory2";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import BarChartIcon from "@mui/icons-material/BarChart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useAdminAuthStore } from "@/Stores/AdminAuthStore";

const DRAWER_WIDTH = 240;
const MD_DRAWER_WIDTH = 180;

const adminLinks = [
  { label: "Overview", href: "/dashboard", icon: <DashboardIcon /> },
  { label: "Products", href: "/dashboard/products", icon: <InventoryIcon /> },
  { label: "Coupons", href: "/dashboard/coupons", icon: <LocalOfferIcon /> },
  { label: "Reports", href: "/dashboard/reports", icon: <BarChartIcon /> },
  {
    label: "Shipping",
    href: "/dashboard/shipping",
    icon: <LocalShippingIcon />,
  },
  { label: "Customers", href: "/dashboard/customers", icon: <PeopleIcon /> },
  { label: "Orders", href: "/dashboard/orders", icon: <ReceiptLongIcon /> },
  { label: "Staff", href: "/dashboard/staff", icon: <ManageAccountsIcon /> },
];

const staffLinks = [
  { label: "Orders", href: "/dashboard/orders", icon: <ReceiptLongIcon /> },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, hydrated, fetchMe, logout } = useAdminAuthStore();

  const isLoginPage = pathname === "/dashboard/login";

  useEffect(() => {
    if (!isLoginPage) fetchMe();
  }, [fetchMe, isLoginPage]);

  useEffect(() => {
    if (isLoginPage || !hydrated) return;
    if (!user) {
      router.replace("/dashboard/login");
      return;
    }
    if (user.role === "staff" && !pathname.startsWith("/dashboard/orders")) {
      router.replace("/dashboard/orders");
    }
  }, [hydrated, user, isLoginPage, pathname, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!hydrated || !user) {
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

  const links = user.role === "admin" ? adminLinks : staffLinks;

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2.5 }}>
        <Typography sx={{ fontWeight: 700, letterSpacing: 2 }}>
          VELVORN
        </Typography>
        <Typography variant="caption" sx={{ color: "#888" }}>
          {user.role.toUpperCase()} · {user.fullName}
        </Typography>
      </Box>
      <List sx={{ flex: 1, px: 1 }}>
        {links.map((link) => {
          const selected =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);
          return (
            <ListItemButton
              key={link.href}
              component={Link}
              href={link.href}
              selected={selected}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                "&.Mui-selected": {
                  bgcolor: "#222",
                  color: "#fff",
                  "& .MuiListItemIcon-root": { color: "#fff" },
                  "&:hover": { bgcolor: "#333" },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={async () => {
            await logout();
            router.replace("/dashboard/login");
          }}
          sx={{ borderColor: "#ccc", color: "#222", borderRadius: 0 }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f7f7f7" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "#fff",
          color: "#222",
          borderBottom: "1px solid #e5e5e5",
          width: {
            xs: "100%",
            md: `calc(100% - ${MD_DRAWER_WIDTH}px)`,
            lg: `calc(100% - ${DRAWER_WIDTH}px)`,
          },
          ml: { xs: 0, md: MD_DRAWER_WIDTH, lg: DRAWER_WIDTH },
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography sx={{ fontWeight: 600, flexGrow: 1 }}>
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { xs: "0", md: MD_DRAWER_WIDTH, lg: DRAWER_WIDTH },
          flexShrink: { md: 0 },
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: {
                xs: DRAWER_WIDTH,
                md: MD_DRAWER_WIDTH,
                lg: DRAWER_WIDTH,
              },
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: {
                xs: DRAWER_WIDTH,
                md: MD_DRAWER_WIDTH,
                lg: DRAWER_WIDTH,
              },
              borderRight: "1px solid #e5e5e5",
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: {
            xs: `100%`,
            md: `calc(100% - ${MD_DRAWER_WIDTH}px)`,
            lg: `calc(100% - ${DRAWER_WIDTH}px)`,
          },
          mt: "64px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
