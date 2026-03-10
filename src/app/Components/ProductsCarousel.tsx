"use client";
import { Box } from "@mui/material";
import { Product } from "../lib/actions";
import ProductCard from "./ProductCard";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

const ProductsCarousel = ({ products }: { products: Product[] }) => {
  return (
    <Box
      className="splide-wrapper"
      sx={{
        position: "relative",
        maxWidth: "1200px",
        margin: "0 auto",
        py: 0,
        px: { xs: "0px", md: "30px", lg: "0px" },
      }}
    >
      <Splide
        hasTrack={false}
        options={{
          gap: "1rem",
          focus: "center",
          type: "loop",
          pagination: false,
          arrows: true,
          updateOnMove: true,
        }}
      >
        <Box className="custom-wrapper" sx={{ position: "relative", overflow: { xs: "hidden" , md: "visible"} }}>
          <SplideTrack>
            {products.map((product, index) => (
              <SplideSlide
                key={product._id}
                className="product-card"
                data-aos="fade-up"
                data-aos-duration="1000"
                data-aos-offset="300"
                data-aos-delay={index * 200}
              >
                <ProductCard product={product} />
              </SplideSlide>
            ))}
          </SplideTrack>

          <Box className="splide__arrows">
            <button
              className="splide__arrow splide__arrow--prev"
              style={{ left: "-50px", background: "transparent !important" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
                <path
                  d="m15.5 10l-1.5 1.5l8.5 8.5l-8.5 8.5l1.5 1.5l10-10l-10-10z"
                  fill="black"
                />
              </svg>
            </button>
            <button
              className="splide__arrow splide__arrow--next"
              style={{ right: "-50px", background: "transparent !important" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
                <path
                  d="m15.5 10l-1.5 1.5l8.5 8.5l-8.5 8.5l1.5 1.5l10-10l-10-10z"
                  fill="black"
                />
              </svg>
            </button>
          </Box>
        </Box>
      </Splide>
    </Box>
  );
};

export default ProductsCarousel;
