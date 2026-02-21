/* FinalCTA - Centered call-to-action section with display heading, Korean subtitle,
   and two action buttons (primary "Start a Project" linking to contact form, ghost
   "View All Work" scrolling to top). Fade-in scroll reveal via useInView. */
"use client";

import { useInView } from "@/lib/use-in-view";
import styles from "./styles/final-cta.module.css";

export default function FinalCTA() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.2 });

  return (
    <section id="final-cta" className={`section-block ${styles.section}`} ref={ref}>
      <div className="container-reading">
        <div className={`${styles.content} ${isInView ? styles.visible : ""}`}>
          <h2 className={styles.title}>Ready to Build Something Remarkable?</h2>
          <p className={styles.subtitle}>
            {"\uD568\uAED8 \uD504\uB85C\uC81D\uD2B8\uB97C \uC2DC\uC791\uD558\uAC70\uB098 \uD3EC\uD2B8\uD3F4\uB9AC\uC624\uB97C \uB458\uB7EC\uBCF4\uC138\uC694."}
          </p>
          <div className={styles.buttons}>
            <a href="#contact" className={styles.primary}>
              Start a Project
            </a>
            <a href="#" className={styles.ghost}>
              View All Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
