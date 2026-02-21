/** Project detail overlay panel for selected card preview. */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { drawCardCanvas } from "@/lib/hero/card-texture";
import styles from "./styles/detail-overlay.module.css";

type DetailOverlayProps = {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
};

export function DetailOverlay({ project, isOpen, onClose }: DetailOverlayProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!project || !isOpen) {
      setThumbnailUrl(null);
      return;
    }

    if (project.ogImage) {
      setThumbnailUrl(project.ogImage);
    } else {
      const index = parseInt(project.id, 10) - 1;
      const canvas = drawCardCanvas(project, index);
      setThumbnailUrl(canvas.toDataURL("image/png"));
    }
  }, [project, isOpen]);

  return (
    <aside
      className={`${styles.panel} ${isOpen ? styles.open : ""}`}
      aria-hidden={!isOpen}
    >
      {project && (
        <div className={styles.inner}>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close detail panel"
          >
            <span className={styles.closeBtnText}>Return</span>
          </button>

          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt={`${project.title} project card`}
              className={styles.thumbnail}
            />
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
              <Link
                href={`/projects/${project.slug}`}
                className={styles.cta}
              >
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
        </div>
      )}
    </aside>
  );
}
