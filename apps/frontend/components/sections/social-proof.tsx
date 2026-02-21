/* SocialProof - Compact stats bar displaying key metrics (projects delivered, client
   satisfaction, years experience) with separator lines and fade-in scroll reveal. */
"use client";

import { useInView } from "@/lib/use-in-view";
import styles from "./styles/social-proof.module.css";

const stats = [
  { value: "15+", label: "Projects Delivered" },
  { value: "100%", label: "Client Satisfaction" },
  { value: "3+", label: "Years Experience" },
] as const;

export default function SocialProof() {
  const { ref, isInView } = useInView<HTMLElement>({ threshold: 0.3 });

  return (
    <section id="proof" className="section-block-compact" ref={ref}>
      <div className="container-narrow">
        <div className={`${styles.row} ${isInView ? styles.visible : ""}`}>
          {stats.map((stat, index) => (
            <div key={stat.label} className={styles.item}>
              {index > 0 && <div className={styles.separator} />}
              <span className={styles.value}>{stat.value}</span>
              <span className={styles.label}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

