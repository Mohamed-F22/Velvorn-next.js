"use client";
import { useEffect, useMemo, useState, type FC, type PropsWithChildren } from "react";
import { RenderContext, type OverlayLayerKey } from "./RenderContext";

const RenderProvider: FC<PropsWithChildren> = ({ children }) => {
  const [openLayers, setOpenLayers] = useState<Set<OverlayLayerKey>>(
    () => new Set(),
  );

  const isOverlayVisible = openLayers.size > 0;
  const isLayerOpen = (key: OverlayLayerKey) => openLayers.has(key);

  const openLayer = (key: OverlayLayerKey) => {
    setOpenLayers((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  };

  const closeLayer = (key: OverlayLayerKey) => {
    setOpenLayers((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  const closeAll = () => {
    setOpenLayers(new Set());
  };

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.toggle("no-scroll", isOverlayVisible);
  }, [isOverlayVisible]);

  const value = useMemo(
    () => ({
      isOverlayVisible,
      isLayerOpen,
      openLayer,
      closeLayer,
      closeAll,
    }),
    [isOverlayVisible, openLayers],
  );

  return (
    <RenderContext.Provider value={value}>{children}</RenderContext.Provider>
  );
};

export default RenderProvider;
