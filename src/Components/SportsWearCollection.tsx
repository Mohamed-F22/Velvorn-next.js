import { Box, Button, Container, Typography } from "@mui/material";
import sportsWearCollectionImg from "../../public/sports-wear-collection.png";
import Image from "next/image";
const SportsWearCollection = () => {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 100px)",
        background:
          "linear-gradient(90deg, #e5e7eb 0%, #d1d5db 5%, #6e6e6eff 100%)",
        display: "flex",
        alignItems: "center",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container>
        <Box
          sx={{
            position: "absolute",
            bottom: {
              sm: "10%",
              md: "50%",
            },
            left: {
              xs: "50%",
              md: "50%",
            },
            transform: { xs: "translateX(-50%)", md: "translateY(50%)" },
            zIndex: 2,
            textAlign: { xs: "center", md: "left" },
            width: { xs: "100%", md: "50%" },
          }}
        >
          <Box
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-offset="300"
          >
            <Typography variant="h4" sx={{ fontWeight: "600", mb: 3 }}>
              SPORTSWEAR COLLECTION
            </Typography>
            <Typography
              sx={{
                opacity: 0.9,
                mb: {
                  xs: 2,
                  sm: 5,
                },
                display: {
                  xs: "none",
                  md: "block",
                },
              }}
            >
              Push boundaries in activewear crafted for motion and mindset. From
              workouts to wind-downs, our gear is built to move with you.
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#222",
                color: "white",
                padding: "12px 24px",
                borderRadius: "0",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#444",
                },
              }}
            >
              Explore All Collection
            </Button>
          </Box>
        </Box>
      </Container>
      <Box
        sx={{
          position: "absolute",
          zIndex: 1,
          bottom: 0,
          height: "100%",
          left: { xs: "50%", sm: "50%", md: "25%" },
          transform: " translateX(-50%)",
          width: { xs: "100%", md: "50%" },
        }}
      >
        <Box
          sx={{ height: "100%" }}
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-offset="300"
        >
          <Image
            src={"/sports-wear-collection.png"}
            alt="Sports Wear Collection Image"
            fill
            style={{ objectFit: "contain" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SportsWearCollection;
