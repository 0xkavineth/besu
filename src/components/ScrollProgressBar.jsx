import { useState, useEffect } from "react";
import { GRADIENT_BRAND } from "../theme";

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0);
        raf = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, height: 3, width: `${progress}%`, background: GRADIENT_BRAND, zIndex: 50, transition: "width 60ms linear" }} />
  );
}

// ---------------------------------------------
// Shared UI atoms
// ---------------------------------------------
export default ScrollProgressBar;
