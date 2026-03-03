"use client";
import { useState, type FC, type PropsWithChildren } from "react";
import { RenderContext } from "./RenderContext";

const RenderProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const overlayOn = () => {
    setIsOverlayVisible(true);
  };
  const overlayOff = () => {
    setIsOverlayVisible(false);
  };

  return (
    <RenderContext.Provider
      value={{
        isOverlayVisible,
        overlayOn,
        overlayOff,
      }}
    >
      {children}
    </RenderContext.Provider>
  );
};

export default RenderProvider;
