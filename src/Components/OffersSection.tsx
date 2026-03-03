"use client";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { offerProducts } from "../Zustand/zustand";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { useCartStore } from "../Zustand/zustand";
import Image from "next/image";

const OffersSection = () => {
  const { addItemToCart } = useCartStore();

  const handleCartButton = (id: string) => {
    if (document.getElementById(id)?.classList.contains("active-size")) {
      document.getElementById(id)?.classList.remove("active-size");
    } else {
      const activeElements = document.querySelectorAll(".active-size");
      activeElements.forEach((element) => {
        element.classList.remove("active-size");
      });
      document.getElementById(id)?.classList.add("active-size");
    }
  };

  const chooseSize = (id: string, size: string) => {
    addItemToCart(id, size);
    document
      .getElementById(`offer-${id}-size`)
      ?.classList.remove("active-size");
  };

  return (
    <Box sx={{ pt: 5, pb: 5 }}>
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
        <Grid container spacing={3}>
          {offerProducts.map((product, index) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4 }}
              key={product.id}
              data-aos="fade-up"
              data-aos-duration="1000"
              data-aos-offset="300"
              data-aos-delay={index * 200}
            >
              <Box sx={{ position: "relative" }}>
                <Box sx={{ position: "relative" }}>
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: 400,
                      bgcolor: "#f5f5f5",
                    }}
                  >
                    <Image
                      src={product.img}
                      alt={product.title}
                      fill
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 10,
                      right: "3px",
                    }}
                  >
                    <ButtonGroup
                      className="choose-size"
                      id={`offer-${product.id}-size`}
                      variant="contained"
                    >
                      {" "}
                      <Button
                        onClick={() => chooseSize(product.id, "xs")}
                        sx={{
                          backgroundColor: "#222",
                          color: "#fff",
                          outline: "none",
                          border: "none !important",
                          borderRadius: 0,
                        }}
                      >
                        xs
                      </Button>
                      <Button
                        onClick={() => chooseSize(product.id, "sm")}
                        sx={{
                          backgroundColor: "#222",
                          color: "#fff",
                          outline: "none",
                          border: "none !important",
                        }}
                      >
                        sm
                      </Button>
                      <Button
                        onClick={() => chooseSize(product.id, "m")}
                        sx={{
                          backgroundColor: "#222",
                          color: "#fff",
                          outline: "none",
                          border: "none !important",
                        }}
                      >
                        m
                      </Button>
                      <Button
                        onClick={() => chooseSize(product.id, "lg")}
                        sx={{
                          backgroundColor: "#222",
                          color: "#fff",
                          outline: "none",
                          border: "none !important",
                        }}
                      >
                        lg
                      </Button>
                      <Button
                        onClick={() => chooseSize(product.id, "xl")}
                        sx={{
                          backgroundColor: "#222",
                          color: "#fff",
                          outline: "none",
                          borderRadius: 0,
                          border: "none !important",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            bottom: "-20px",
                            left: "50%",
                            transform: "translateX(-10%)",
                            width: 0,
                            height: 0,
                            border: "10px solid",
                            borderColor:
                              "#222 transparent transparent transparent",
                          },
                        }}
                      >
                        xl
                      </Button>
                    </ButtonGroup>
                  </Box>
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
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        letterSpacing: 1.5,
                        color: "#222",
                      }}
                    >
                      {product.title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {product.offerPrice?.toFixed(2)} ${" "}
                      <Typography
                        component="span"
                        sx={{
                          textDecoration: "line-through",
                          color: "#999",
                          ml: 1,
                          fontWeight: 400,
                        }}
                      >
                        {product.price.toFixed(2)} $
                      </Typography>
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      onClick={() =>
                        handleCartButton(`offer-${product.id}-size`)
                      }
                      sx={{ color: "Black" }}
                    >
                      <CardGiftcardIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default OffersSection;
