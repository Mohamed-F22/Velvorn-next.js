"use client";
import { useState, useEffect } from "react";
import { Grid, Box } from "@mui/material";
import Image from "next/image";
import { Product } from "../lib/actions";

const ProductGallery = (params: { product: Product }) => {
  const { product } = params;
  const [selectedImg, setSelectedImg] = useState(product.imgs[0]);

  useEffect(() => {
    if (product.imgs && product.imgs.length > 0) {
      setSelectedImg(product.imgs[0]);
    }
  }, [product]);

  if (!product.imgs || product.imgs.length === 0) {
    return <Box>No images available</Box>;
  }

  return (
    <Grid container spacing={0} sx={{ alignItems: "flex-start" }}>
      {product.imgs.length > 1 && (
        <Grid size={{ xs: 3 }}>
          <Box
            sx={{
              pr: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "3px",
            }}
          >
            {product.imgs.map((imgUrl, index) => (
              <Box
                key={index}
                onClick={() => setSelectedImg(imgUrl)}
                sx={{
                  position: "relative",
                  cursor: "pointer",
                  borderRadius: "4px",
                  overflow: "hidden",
                  border:
                    selectedImg === imgUrl
                      ? "2px solid #222"
                      : "2px solid transparent",
                  opacity: selectedImg === imgUrl ? 1 : 0.6,
                  transition: "all 0.3s ease",
                  "&:hover": { opacity: 1 },
                  aspectRatio: "1 / 1",
                  width: "100%",
                }}
              >
                <Image
                  src={imgUrl}
                  alt={`${product.title} view ${index + 1}`}
                  fill
                  sizes="(max-width: 600px) 25vw, 10vw"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                  priority={index === 0}
                />
              </Box>
            ))}
          </Box>
        </Grid>
      )}
      <Grid size={{ xs: product.imgs.length > 1 ? 9 : 12 }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            borderRadius: "4px",
            overflow: "hidden",
            aspectRatio: "4 / 5",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Image
            src={selectedImg}
            alt={`${product.title} - Main View`}
            fill
            sizes="(max-width: 600px) 100vw, 50vw"
            style={{
              objectFit: "cover",
              objectPosition: "top center",
            }}
            priority
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default ProductGallery;
