"use client";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import ProductsCarousel from "./ProductsCarousel";
import { useProductsStore } from "../Stores/ProductsStore";
import { useEffect } from "react";

const SimilarProducts = (props: {
  style: string[];
  id: string;
  category: string;
}) => {
  const { similarProducts, getSimilarProducts } = useProductsStore();

  useEffect(() => {
    getSimilarProducts(props);
  }, []);

  return (
    <Box sx={{ pt: 5, pb: 5 }}>
      <Container>
        <Grid
          sx={{ pt: 5, pb: 5 }}
          container
          alignItems={"center"}
          justifyContent={"space-between"}
        >
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
              Similar Items
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
                Explore the Latest
              </Button>
            </Box>
          </Grid>
        </Grid>
        <ProductsCarousel products={similarProducts} />
      </Container>
    </Box>
  );
};

export default SimilarProducts;
