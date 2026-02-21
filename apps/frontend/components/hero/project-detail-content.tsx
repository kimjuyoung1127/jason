/** ProjectDetailContent - Client wrapper for project case study page with scroll-reveal and prev/next navigation. */
"use client";

import Link from "next/link";
import type { Project } from "@/lib/projects";
import { useInView } from "@/lib/use-in-view";
import SectionHeading from "@/components/ui/section-heading";
import styles from "./styles/project-detail-content.module.css";

interface ProjectNavItem {
  slug: string;
  id: string;
  title: string;
}

interface ProjectDetailContentProps {
  project: Project;
  prev: ProjectNavItem;
  next: ProjectNavItem;
}

export default function ProjectDetailContent({
  project,
  prev,
  next,
}: ProjectDetailContentProps) {
  const headerView = useInView<HTMLDivElement>({ threshold: 0.2 });
  const overviewView = useInView<HTMLDivElement>({ threshold: 0.2 });
  const metaView = useInView<HTMLDivElement>({ threshold: 0.2 });
  const actionsView = useInView<HTMLDivElement>({ threshold: 0.2 });
  const navView = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <main>
      {/* ---- Hero Banner ---- */}
      <div className={styles.hero}>
        <Link href="/" className={styles.backLink}>
          &larr; Back to Home
        </Link>
        <span className={styles.projectBadge}>{project.id}</span>
        {project.ogImage ? (
          <img
            src={project.ogImage}
            alt={`${project.title} project screenshot`}
            className={styles.heroImage}
          />
        ) : null}
        <div className={styles.heroOverlay} />
      </div>

      <div className={styles.body}>
        {/* ---- Header ---- */}
        <div
          ref={headerView.ref}
          className={`${styles.header} ${styles.reveal} ${headerView.isInView ? styles.revealVisible : ""}`}
        >
          <span className={styles.clientLabel}>{project.client}</span>
          <h1 className={styles.title}>{project.title}</h1>
          <p className={styles.summaryText}>{project.summary}</p>
        </div>

        <div className={styles.divider} />

        {/* ---- Overview ---- */}
        <div
          ref={overviewView.ref}
          className={`${styles.overview} ${styles.reveal} ${overviewView.isInView ? styles.revealVisible : ""}`}
        >
          <SectionHeading label="OVERVIEW" title="Project Details" />
          <p className={styles.descriptionText}>{project.description}</p>
        </div>

        {/* ---- Metadata Grid ---- */}
        <div
          ref={metaView.ref}
          className={`${styles.reveal} ${metaView.isInView ? styles.revealVisible : ""}`}
        >
          <div className={styles.metaGrid}>
            <div className={styles.metaItem} style={{ transitionDelay: "0s" }}>
              <span className={styles.metaLabel}>Client</span>
              <span className={styles.metaValue}>{project.client}</span>
            </div>
            <div className={styles.metaItem} style={{ transitionDelay: "0.1s" }}>
              <span className={styles.metaLabel}>Project</span>
              <span className={styles.metaValue}>NO. {project.id}</span>
            </div>
            <div className={styles.metaItem} style={{ transitionDelay: "0.2s" }}>
              <span className={styles.metaLabel}>Stack</span>
              <div className={styles.tags}>
                {project.stack.map((tech) => (
                  <span key={tech} className={styles.tag}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---- Action Buttons ---- */}
        <div
          ref={actionsView.ref}
          className={`${styles.actions} ${styles.reveal} ${actionsView.isInView ? styles.revealVisible : ""}`}
        >
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryBtn}
            >
              Visit Live Project &rarr;
            </a>
          )}
          <Link href="/" className={styles.ghostBtn}>
            View All Work
          </Link>
        </div>

        {/* ---- Prev / Next Navigation ---- */}
        <div
          ref={navView.ref}
          className={`${styles.reveal} ${navView.isInView ? styles.revealVisible : ""}`}
        >
          <nav className={styles.projectNav}>
            <Link
              href={`/projects/${prev.slug}`}
              className={styles.navLink}
            >
              <span className={styles.navDirection}>&larr; Previous Project</span>
              <span className={styles.navTitle}>{prev.title}</span>
            </Link>
            <Link
              href={`/projects/${next.slug}`}
              className={`${styles.navLink} ${styles.navLinkNext}`}
            >
              <span className={styles.navDirection}>Next Project &rarr;</span>
              <span className={styles.navTitle}>{next.title}</span>
            </Link>
          </nav>
        </div>

        {/* ---- Back to Home ---- */}
        <Link href="/" className={styles.backHome}>
          Back to All Projects
        </Link>
      </div>
    </main>
  );
}
