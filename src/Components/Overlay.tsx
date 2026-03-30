"use client";

import { Box } from "@mui/material";
import { useRender } from "../Context/visibility/RenderContext";

const Overlay = () => {
  const { closeAll, isLayerOpen } = useRender();
  const isSearchLikeOverlay = isLayerOpen("search") || isLayerOpen("menu");
  const navbarHeightPx = 64;
  const handleCloseAll = () => {
    document.getElementById("cart")?.classList.remove("active-cart");
    closeAll();
  };

  return (
    <Box
      onClick={handleCloseAll}
      className="overlay"
      id="overlay"
      sx={{
        position: "fixed",
        top: isSearchLikeOverlay ? `${navbarHeightPx}px` : 0,
        left: 0,
        width: "100%",
        height: isSearchLikeOverlay ? `calc(100% - ${navbarHeightPx}px)` : "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: isSearchLikeOverlay ? 1100 : 1300,
      }}
    ></Box>
  );
};

export default Overlay;
