import { Box, Container, Grid, Typography } from "@mui/material";
import { getProduct } from "../lib/actions";
import SizeNumberForm from "../Components/SizeNumberForm";
import ProductGallery from "../Components/ProductGallary";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogPost({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <Box sx={{ mt: "100px" }}>
      <Container>
        <Grid container>
          <Grid size={{ xs: 12, md: 6 }}>
            <ProductGallery product={product} />
          </Grid>

          <Grid sx={{ pl: { md: 5 } }} size={{ md: 6 }}>
            <Box mb={3}>
              <Typography variant="h2">{product.title}</Typography>

              <Typography variant="body2" sx={{ fontSize: 30, color: "#222" }}>
                {product.offerPrice?.toFixed(2)} ${" "}
                <Typography
                  component="span"
                  sx={{
                    textDecoration: "line-through",
                    color: "#999",
                    ml: 1,
                    fontWeight: 400,
                    fontSize: 20,
                  }}
                >
                  {product.price.toFixed(2)} $
                </Typography>
              </Typography>
              <Typography
                color="text.secondary"
                gutterBottom
                sx={{ mb: 1.5 }}
              >
                {product.desc}
              </Typography>
            </Box>
            <SizeNumberForm stock={product.stock} productId={product._id} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
