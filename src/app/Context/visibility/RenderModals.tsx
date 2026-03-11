"use client";
import Overlay from "../../Components/Overlay";
import { useRender } from "./RenderContext";

const RenderModals = () => {
  const { isOverlayVisible } = useRender();
  return <>{isOverlayVisible && <Overlay />}</>;
};

export default RenderModals;
