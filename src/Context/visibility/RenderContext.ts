"use client";
import { createContext, useContext } from "react";

export type OverlayLayerKey = "search" | "menu" | "cart";

interface RenderContextType {
  isOverlayVisible: boolean;
  isLayerOpen: (key: OverlayLayerKey) => boolean;
  openLayer: (key: OverlayLayerKey) => void;
  closeLayer: (key: OverlayLayerKey) => void;
  closeAll: () => void;
}

export const RenderContext = createContext<RenderContextType>({
  isOverlayVisible: false,
  isLayerOpen: () => false,
  openLayer: () => {},
  closeLayer: () => {},
  closeAll: () => {},
});

export const useRender = () => useContext(RenderContext);
