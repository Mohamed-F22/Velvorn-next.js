"use client"
import { createContext, useContext } from "react";

interface RenderContextType {
  isOverlayVisible: boolean;
  overlayOn: () => void;
  overlayOff: () => void;
}

export const RenderContext = createContext<RenderContextType>({
  isOverlayVisible: false,
  overlayOn: () => {},
  overlayOff: () => {}
});

export const useRender = () => useContext(RenderContext);
