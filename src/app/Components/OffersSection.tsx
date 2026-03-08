import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { Product } from "@/app/lib/actions";
import ProductsCarousel from "./ProductsCarousel";

const OffersSection = ({ offerProducts }: { offerProducts: Product[] }) => {
  return (
    <Box sx={{ pt: 5, pb: 5, overflow: "hidden" }}>
      <Container>
        <Grid sx={{ pt: 5, pb: 5 }} container justifyContent={"space-between"}>
          <Grid
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-offset="300"
            size={{ xs: 12, md: 6 }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "600",
                color: "#222",
                lineHeight: 1.5,
                fontSize: {
                  md: 35,
                  lg: 40,
                },
              }}
            >
              Hot Style Steals Up to
              <br />
              70% Off Now
            </Typography>
          </Grid>
          <Grid
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-offset="300"
            size={{ xs: 12, md: 5 }}
          >
            <Typography sx={{ color: "#919191ff", fontWeight: "600" }}>
              Score up to 70% off premium activewear—designed for performance,
              built for style.
            </Typography>
            <Box mt={2}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#222",
                  color: "white",
                  padding: "10px 30px",
                  borderRadius: "0",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#444",
                  },
                }}
              >
                Shop Deals
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <ProductsCarousel products={offerProducts} />
    </Box>
  );
};

export default OffersSection;
