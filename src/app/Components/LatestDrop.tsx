import { Box, Button, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { Product } from "@/app/lib/actions";
import Link from "next/link";

const LatestDrop = ({ latestDrop }: { latestDrop: Product[] }) => {
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
              Latest Drops
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
        <Grid container spacing={3}>
          {latestDrop.map((product, index) => (
            <Grid
                size={{ xs: 6, md: 3 }}
                key={product._id}
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-offset="300"
                data-aos-delay={index * 200}
                sx={{ cursor: "pointer" }}
                className="product-card"
              >
            <Link style={{textDecoration:"none"}} href={`/${product._id}`}>
                <Box
                  sx={{ position: "relative", height: 400, overflow: "hidden" }}
                >
                  <Image
                    src={product.img}
                    alt={product.title}
                    fill
                    style={{
                      objectFit: "cover",
                      transition: "0.3s",
                    }}
                    className="imageContainer"
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      className="product-title"
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        letterSpacing: 1.5,
                        color: "#222",
                      }}
                    >
                      {product.title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700,color: "#222" }}>
                      {product.price.toFixed(2)} ${" "}
                    </Typography>
                  </Box>
                </Box>
            </Link>
              </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LatestDrop;
