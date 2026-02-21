/* Testimonials - Three-column client testimonial cards with large accent quote marks,
   italic Korean quotes, client names and roles. Includes hover lift effect and
   staggered scroll-reveal animation via useInView. */
"use client";

import { useInView } from "@/lib/use-in-view";
import SectionHeading from "@/components/ui/section-heading";
import styles from "./styles/testimonials.module.css";

const testimonials = [
  {
    quote:
      "\uB514\uC790\uC778 \uAC10\uAC01\uACFC \uAE30\uC220\uC744 \uBAA8\uB450 \uAC16\uCD94\uACE0 \uC788\uC2B5\uB2C8\uB2E4. \uAE30\uB300 \uC774\uC0C1\uC758 \uACB0\uACFC\uBB3C\uC744 \uBC1B\uC558\uC2B5\uB2C8\uB2E4.",
    name: "\uAE40\uBBFC\uC218",
    role: "CEO, TechStart",
  },
  {
    quote:
      "\uBCF5\uC7A1\uD55C \uC694\uAD6C\uC0AC\uD56D\uC744 \uAE54\uB054\uD558\uAC8C \uAD6C\uD604\uD574\uC8FC\uC168\uC2B5\uB2C8\uB2E4. \uC18C\uD1B5\uC774 \uBE60\uB974\uACE0 \uC815\uD655\uD569\uB2C8\uB2E4.",
    name: "\uC774\uC9C0\uC740",
    role: "PM, DesignLab",
  },
  {
    quote:
      "AI \uCC57\uBD07 \uD1B5\uD569 \uC791\uC5C5\uC774 \uB9E4\uC6B0 \uB9CC\uC871\uC2A4\uB7EC\uC6E0\uC2B5\uB2C8\uB2E4. \uD504\uB85C\uC138\uC2A4\uAC00 \uBA85\uD655\uD55C \uC791\uC5C5\uC774\uC5C8\uC2B5\uB2C8\uB2E4.",
    name: "Park J.",
    role: "CTO, DataFlow",
  },
] as const;

export default function Testimonials() {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section id="testimonials" className="section-block">
      <div className="container-shell" ref={ref}>
        <SectionHeading label="TESTIMONIALS" title="What Clients Say" />

        <div className={styles.grid}>
          {testimonials.map((t, index) => (
            <div
              key={t.name}
              className={`${styles.card} ${isInView ? styles.visible : ""}`}
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              <span className={styles.quoteMark}>&ldquo;</span>
              <p className={styles.quote}>{t.quote}</p>
              <p className={styles.name}>{t.name}</p>
              <p className={styles.role}>{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
