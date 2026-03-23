import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  IconButton,
  Divider,
  Link,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ bgcolor: "white", pt: 8, pb: 4, color: "#333" }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid size={{ xs: 6, md: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                mb: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              VELVORN
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton size="small" sx={{ color: "black" }}>
                <FacebookIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: "black" }}>
                <InstagramIcon />
              </IconButton>
              <IconButton size="small" sx={{ color: "black" }}>
                <XIcon />
              </IconButton>
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
              Shop
            </Typography>
            <Stack spacing={1}>
              <Link href="#" underline="hover" color="inherit" variant="body2">
                Women
              </Link>
              <Link href="#" underline="hover" color="inherit" variant="body2">
                Men
              </Link>
              <Link href="#" underline="hover" color="inherit" variant="body2">
                Accessories
              </Link>
              <Link href="#" underline="hover" color="inherit" variant="body2">
                Performance wear
              </Link>
              <Link href="#" underline="hover" color="inherit" variant="body2">
                Lookbook
              </Link>
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
              Help
            </Typography>
            <Stack spacing={1}>
              <Link href="#" underline="hover" color="inherit" variant="body2">
                Customer support
              </Link>
              <Link href="#" underline="hover" color="inherit" variant="body2">
                My Velvorn account
              </Link>
              <Link href="#" underline="hover" color="inherit" variant="body2">
                Store locator
              </Link>
              <Link href="#" underline="hover" color="inherit" variant="body2">
                Terms & privacy
              </Link>
              <Link href="#" underline="hover" color="inherit" variant="body2">
                Contact us
              </Link>
              <Link href="#" underline="hover" color="inherit" variant="body2">
                Secure shopping
              </Link>
              <Link href="#" underline="hover" color="inherit" variant="body2">
                Cookie policy
              </Link>
              <Link href="#" underline="hover" color="inherit" variant="body2">
                Cookie preferences
              </Link>
            </Stack>
          </Grid>

          <Grid size={{ xs: 6, md: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
              Be first to know
            </Typography>
            <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.6 }}>
              Sign up now and be the first to hear about new drops, exclusive
              offers, collabs, and performance gear updates!
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />
        <Typography
          variant="caption"
          display="block"
          align="center"
          sx={{ color: "#999" }}
        >
          © Created By: Mohamed Amr - 2026
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
