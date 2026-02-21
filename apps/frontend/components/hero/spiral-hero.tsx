/** Hero section with WebGL spiral scene and graceful 2D fallback. */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import type { Project } from "@/lib/projects";
import { useWebGLSupport } from "@/lib/use-webgl-support";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { DetailOverlay } from "./detail-overlay";
import styles from "./styles/spiral-hero.module.css";

const SpiralScene = dynamic(
  () => import("./spiral-scene").then((mod) => ({ default: mod.SpiralScene })),
  { ssr: false }
);

type SpiralHeroProps = {
  items: Project[];
};

export function SpiralHero({ items }: SpiralHeroProps) {
  const webglSupported = useWebGLSupport();
  const reducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [titlePhase, setTitlePhase] = useState<"visible" | "dissolving" | "hidden">("visible");

  const handleSelect = (index: number) => setActiveIndex(index);
  const handleClose = () => setActiveIndex(null);
  const handleChangeIndex = (nextIndex: number) => setActiveIndex(nextIndex);

  useEffect(() => {
    if (reducedMotion) {
      setTitlePhase("hidden");
      return;
    }

    setTitlePhase("visible");
    const dissolveTimer = window.setTimeout(() => setTitlePhase("dissolving"), 300);
    const hideTimer = window.setTimeout(() => setTitlePhase("hidden"), 2500);

    return () => {
      window.clearTimeout(dissolveTimer);
      window.clearTimeout(hideTimer);
    };
  }, [reducedMotion]);

  return (
    <>
      <section className={styles.wrap} aria-label="Project spiral hero">
        {webglSupported ? (
          <div className={styles.canvas}>
            <Canvas
              gl={{ antialias: true, alpha: true }}
              shadows
              dpr={[1, 2]}
              camera={{ position: [0, 0, 45], fov: 45 }}
            >
              <SpiralScene
                projects={items}
                onSelectProject={handleSelect}
                activeIndex={activeIndex}
              />
            </Canvas>
          </div>
        ) : (
          <div className={styles.fallbackGrid}>
            {items.map((item) => (
              <Link
                key={item.slug}
                href={`/projects/${item.slug}`}
                className={styles.fallbackCard}
              >
                <span className={styles.fallbackClient}>{item.client}</span>
                <h3 className={styles.fallbackTitle}>{item.title}</h3>
                <p className={styles.fallbackSummary}>{item.summary}</p>
              </Link>
            ))}
          </div>
        )}

        <div className={styles.uiLayer} data-title-phase={titlePhase}>
          <h2
            className={`${styles.heroTitle} ${
              titlePhase === "visible"
                ? styles.heroTitleVisible
                : titlePhase === "dissolving"
                  ? styles.heroTitleDissolving
                  : styles.heroTitleHidden
            }`}
            data-text={"DIGITAL\nARCHITECT"}
            dangerouslySetInnerHTML={{ __html: "DIGITAL<br/>ARCHITECT" }}
          />

          <div className={styles.scrollIndicator}>
            <span>Scroll to explore</span>
            <span className={styles.scrollLine} />
          </div>
        </div>
      </section>

      <DetailOverlay
        projects={items}
        activeIndex={activeIndex ?? 0}
        isOpen={activeIndex !== null}
        onClose={handleClose}
        onChangeIndex={handleChangeIndex}
      />
    </>
  );
}
