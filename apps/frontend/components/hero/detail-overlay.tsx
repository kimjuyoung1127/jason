/** Project detail overlay panel with swipe and circular navigation. */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import type { Project } from "@/lib/projects";
import { drawCardCanvas } from "@/lib/hero/card-texture";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import styles from "./styles/detail-overlay.module.css";

type DetailOverlayProps = {
  projects: Project[];
  activeIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onChangeIndex: (nextIndex: number) => void;
};

const SWIPE_THRESHOLD = 90;

export function DetailOverlay({
  projects,
  activeIndex,
  isOpen,
  onClose,
  onChangeIndex,
}: DetailOverlayProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const previousFocusedRef = useRef<HTMLElement | null>(null);

  const totalProjects = projects.length;
  const safeIndex =
    totalProjects === 0
      ? 0
      : ((activeIndex % totalProjects) + totalProjects) % totalProjects;
  const project = projects[safeIndex] ?? null;

  const nav = useMemo(
    () => ({
      prev: totalProjects === 0 ? 0 : (safeIndex - 1 + totalProjects) % totalProjects,
      next: totalProjects === 0 ? 0 : (safeIndex + 1) % totalProjects,
      progress: totalProjects === 0 ? 0 : ((safeIndex + 1) / totalProjects) * 100,
    }),
    [safeIndex, totalProjects]
  );

  const goPrev = () => {
    if (totalProjects < 2) return;
    onChangeIndex(nav.prev);
  };

  const goNext = () => {
    if (totalProjects < 2) return;
    onChangeIndex(nav.next);
  };

  useEffect(() => {
    if (!project || !isOpen) {
      setThumbnailUrl(null);
      return;
    }

    if (project.ogImage) {
      setThumbnailUrl(project.ogImage);
      return;
    }

    const index = parseInt(project.id, 10) - 1;
    const canvas = drawCardCanvas(project, index);
    setThumbnailUrl(canvas.toDataURL("image/png"));
  }, [project, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusedRef.current = document.activeElement as HTMLElement;
    closeButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocusedRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }

      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        );

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        }

        if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, nav.next, nav.prev, onClose]);

  const onDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (prefersReducedMotion || totalProjects < 2) return;

    if (info.offset.x <= -SWIPE_THRESHOLD) {
      goNext();
      return;
    }

    if (info.offset.x >= SWIPE_THRESHOLD) {
      goPrev();
    }
  };

  return (
    <aside
      ref={panelRef}
      className={`${styles.panel} ${isOpen ? styles.open : ""}`}
      aria-hidden={!isOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Project detail panel"
    >
      {project && (
        <div className={styles.inner}>
          <div className={styles.topBar}>
            <button
              ref={closeButtonRef}
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close detail panel"
            >
              <span className={styles.closeBtnText}>Return</span>
            </button>
            <span className={styles.counter}>
              {String(safeIndex + 1).padStart(2, "0")} / {String(totalProjects).padStart(2, "0")}
            </span>
          </div>

          <div className={styles.progressTrack} aria-hidden="true">
            <span className={styles.progressFill} style={{ width: `${nav.progress}%` }} />
          </div>

          <button
            type="button"
            className={`${styles.edgeNavBtn} ${styles.edgeNavBtnLeft}`}
            onClick={goPrev}
            aria-label="Previous project"
          >
            <span aria-hidden="true">&#8592;</span>
          </button>

          <button
            type="button"
            className={`${styles.edgeNavBtn} ${styles.edgeNavBtnRight}`}
            onClick={goNext}
            aria-label="Next project"
          >
            <span aria-hidden="true">&#8594;</span>
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={project.slug}
              drag={prefersReducedMotion ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={onDragEnd}
              initial={prefersReducedMotion ? false : { opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -28 }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.28 }}
            >
              {thumbnailUrl && (
                thumbnailUrl.startsWith("/") ? (
                  <Image
                    src={thumbnailUrl}
                    alt={`${project.title} project card`}
                    width={800}
                    height={500}
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className={styles.thumbnail}
                  />
                ) : (
                  <img
                    src={thumbnailUrl}
                    alt={`${project.title} project card`}
                    className={styles.thumbnail}
                  />
                )
              )}

              <div className={styles.content}>
                <span className={styles.client}>{project.client}</span>
                <h2 className={styles.title}>{project.title}</h2>
                <p className={styles.description}>{project.description}</p>

                <div className={styles.tags}>
                  {project.stack.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className={styles.actions}>
                  <Link href={`/projects/${project.slug}`} className={styles.cta}>
                    View Full Case Study
                  </Link>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.visitBtn}
                    >
                      Visit Website &rarr;
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </aside>
  );
}
