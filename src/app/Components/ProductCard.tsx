import { Box, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/app/lib/actions";

const ProductCard = (params: { product: Product }) => {
  const { product } = params;
  return (
    <Link style={{ textDecoration: "none" }} href={`/${product._id}`}>
      <Box
        className="product-card"
        sx={{ position: "relative", overflow: "hidden" }}
      >
        <Image
          src={product.img}
          alt={product.title}
          width={400}
          height={500}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
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
          <Typography variant="body2" sx={{ fontWeight: 700, color: "#222" }}>
            {product.offerPrice ? (
              <>
                <Typography
                  component="span"
                  sx={{
                    textDecoration: "line-through",
                    color: "#999",
                    mr: 1,
                    fontWeight: 400,
                  }}
                >
                  {product.price.toFixed(2)} $
                </Typography>

                <Typography component="span" sx={{ fontWeight: 700 }}>
                  {product.offerPrice.toFixed(2)} $
                </Typography>
              </>
            ) : (
              <Typography component="span" sx={{ fontWeight: 700 }}>
                {product.price.toFixed(2)} $
              </Typography>
            )}
          </Typography>
        </Box>
      </Box>
    </Link>
  );
};

export default ProductCard;
