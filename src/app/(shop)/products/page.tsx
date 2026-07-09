import ProductCard from "@/Components/ProductCard";
import { getProducts } from "@/lib/actions";
import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import { Suspense } from "react";
import FilterSidebar from "./components/Sidebar";
import MobileFilterDrawer from "./components/MobileFilterDrawer";
import ProductsToolbar from "./components/ProductsToolbar";
import {
  filterProducts,
  getEffectivePrice,
  parseProductFilters,
  sortProducts,
} from "./lib/filterProducts";
import HeroSection from "@/Components/HeroSection";
import Footer from "@/Components/Footer";

type Props = {
  searchParams: Promise<{
    category?: string;
    size?: string;
    minPrice?: string;
    maxPrice?: string;
    offer?: string;
    sort?: string;
  }>;
};

export default async function Products({ searchParams }: Props) {
  const params = await searchParams;
  const productsData = await getProducts();
  const products = productsData.products;

  const categories = [
    ...new Set(products.map((product) => product.category.toLowerCase())),
  ].sort();

  const maxPrice = Math.max(
    ...products.map((product) => getEffectivePrice(product)),
    0,
  );

  const filters = parseProductFilters(params);
  const filteredProducts = sortProducts(
    filterProducts(products, filters),
    params.sort,
  );

  return (
    <Box sx={{ mt: "80px" }}>
      <Container  maxWidth="xl">
        <Typography variant="h3" sx={{ mb: "30px" }}>
          Our Store
        </Typography>
        <Grid sx={{ mb: "80px" }} container>
          <Grid
            size={{ xs: 0, md: 3 }}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <Suspense fallback={null}>
              <FilterSidebar categories={categories} maxPrice={maxPrice} />
            </Suspense>
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <Suspense fallback={null}>
              <MobileFilterDrawer categories={categories} maxPrice={maxPrice} />
              <ProductsToolbar productCount={filteredProducts.length} />
            </Suspense>

            {filteredProducts.length === 0 ? (
              <Typography sx={{ mt: 2, color: "#666" }}>
                No products match your filters.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {filteredProducts.map((product) => (
                  <Grid key={product._id} size={{ xs: 6, md: 4, lg: 3 }}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>
        </Grid>
        <Divider sx={{ my: 4 }} />
      </Container>
      <Footer />
    </Box>
  );
}
