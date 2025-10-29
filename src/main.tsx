import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ReactLenis } from "./components/lenis";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactLenis
      root
      options={{
        lerp: 0.05,
        smoothWheel: true,
        duration: 1.2,
        wheelMultiplier: 1.2,
        touchMultiplier: 1.2,
        syncTouch: true,
      }}
    >
      <App />
    </ReactLenis>
  </StrictMode>
);
