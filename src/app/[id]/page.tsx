import { Box, Container, Grid, Typography } from "@mui/material";
import { getProduct } from "../lib/actions";
import Image from "next/image";
import SizeNumberForm from "../Components/SizeNumberForm";

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
            <Grid container>
              <Grid size={{ xs: 3 }}>
                <Box sx={{ pb: "5px", pr: "10px" }}>
                  <Image
                    src={product.img}
                    width={400}
                    height={500}
                    style={{ width: "100%", height: "auto" }}
                    alt={product.title}
                  />
                </Box>
                <Box
                  sx={{
                    pb: "5px",
                    pt: "5px",
                    pr: "10px",
                  }}
                >
                  <Image
                    src={product.img}
                    width={400}
                    height={500}
                    style={{ width: "100%", height: "auto" }}
                    alt={product.title}
                  />
                </Box>
                <Box sx={{ pt: "5px", pr: "10px" }}>
                  <Image
                    src={product.img}
                    width={400}
                    height={500}
                    style={{ width: "100%", height: "auto" }}
                    alt={product.title}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 9 }}>
                <Image
                  src={product.img}
                  width={400}
                  height={500}
                  style={{ width: "100%", height: "auto" }}
                  alt={product.title}
                />
              </Grid>
            </Grid>
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
                // variant="body2"
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
