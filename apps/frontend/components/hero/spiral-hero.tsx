/** Hero section with WebGL spiral scene and graceful 2D fallback. */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import type { Project } from "@/lib/projects";
import { useWebGLSupport } from "@/lib/use-webgl-support";
import { DetailOverlay } from "./detail-overlay";
import styles from "./styles/spiral-hero.module.css";

function useMobileDpr(): [number, number] {
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setDpr([1, 1.5]);
    }
  }, []);
  return dpr;
}

const SpiralScene = dynamic(
  () => import("./spiral-scene").then((mod) => ({ default: mod.SpiralScene })),
  { ssr: false }
);

type SpiralHeroProps = {
  items: Project[];
};

export function SpiralHero({ items }: SpiralHeroProps) {
  const webglSupported = useWebGLSupport();
  const dpr = useMobileDpr();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleSelect = (index: number) => setActiveIndex(index);
  const handleClose = () => setActiveIndex(null);
  const handleChangeIndex = (nextIndex: number) => setActiveIndex(nextIndex);

  const preloadImages = items.slice(0, 3).filter((item) => item.ogImage);

  return (
    <>
      {preloadImages.map((item) => (
        <link
          key={item.slug}
          rel="preload"
          as="image"
          href={item.ogImage!}
        />
      ))}
      <section className={styles.wrap} aria-label="Project spiral hero">
        {webglSupported ? (
          <div className={styles.canvas}>
            <Canvas
              gl={{ antialias: true, alpha: true }}
              shadows
              dpr={dpr}
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

        <div className={styles.uiLayer}>
          <h2
            className={styles.heroTitle}
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
