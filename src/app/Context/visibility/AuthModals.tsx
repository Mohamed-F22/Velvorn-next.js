"use client"
import Overlay from "../../Components/Overlay";
import { useRender } from "./RenderContext";

const AuthModals = () => {
  const { isOverlayVisible } = useRender();
  return (
    <>
      {isOverlayVisible && <Overlay />}
    </>
  );
};

export default AuthModals