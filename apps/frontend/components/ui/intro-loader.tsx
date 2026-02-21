/* IntroLoader - Full-screen loading overlay with pulsing "INITIALIZING" text that fades out after 2s */
"use client";

import { useEffect, useState } from "react";
import styles from "./styles/intro-loader.module.css";

export default function IntroLoader() {
  const [phase, setPhase] = useState<"visible" | "fading" | "hidden">(
    "visible"
  );

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase("fading"), 2000);
    const hideTimer = setTimeout(() => setPhase("hidden"), 3500); // 2000 + 1500

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className={`${styles.overlay} ${phase === "fading" ? styles.fadeOut : ""}`}
      aria-hidden="true"
    >
      <span className={styles.text}>INITIALIZING</span>
    </div>
  );
}

