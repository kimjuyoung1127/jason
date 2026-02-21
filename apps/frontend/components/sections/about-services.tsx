/* AboutServices - Three-column services grid showcasing Web Development, AI Integration,
   and Design Engineering capabilities. Each card features a numbered label, title, and
   Korean description with scroll-reveal animations staggered by index. */
"use client";

import { useInView } from "@/lib/use-in-view";
import SectionHeading from "@/components/ui/section-heading";
import styles from "./styles/about-services.module.css";

const services = [
  {
    number: "01",
    title: "Web Development",
    description:
      "\uB9DE\uCDA4\uD615 \uC6F9\uC0AC\uC774\uD2B8\uC640 \uC6F9 \uC560\uD50C\uB9AC\uCF00\uC774\uC158\uC744 \uCD5C\uC2E0 \uD504\uB808\uC784\uC6CC\uD06C\uB85C \uAD6C\uCD95\uD569\uB2C8\uB2E4. \uB79C\uB529\uD398\uC774\uC9C0\uBD80\uD130 \uC0DD\uC0B0 \uD504\uB85C\uB355\uD2B8\uAE4C\uC9C0.",
  },
  {
    number: "02",
    title: "AI Integration",
    description:
      "LLM, \uCEF4\uD4E8\uD130 \uBE44\uC804, \uC790\uB3D9\uD654\uB97C \uD65C\uC6A9\uD55C \uC9C0\uB2A5\uD615 \uAE30\uB2A5\uC744 \uAD6C\uD604\uD569\uB2C8\uB2E4. \uB2F9\uC2E0\uC758 \uC81C\uD488\uC744 \uB354 \uC2A4\uB9C8\uD2B8\uD558\uAC8C.",
  },
  {
    number: "03",
    title: "Design Engineering",
    description:
      "\uB514\uC790\uC778\uACFC \uB514\uD14C\uC77C \uC5B8\uC5B4\uB9CC\uC758 \uACBD\uACC4\uB97C \uD5C8\uBB3C\uB2C8\uB2E4. WebGL, \uBAA8\uC158, \uC778\uD130\uB799\uC158 \uB514\uC790\uC778\uC73C\uB85C \uB9D0\uC744 \uB2E4 \uD558\uB294 \uC778\uD130\uD398\uC774\uC2A4.",
  },
] as const;

export default function AboutServices() {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section id="services" className="section-block">
      <div className="container-shell" ref={ref}>
        <SectionHeading label="SERVICES" title="Building Digital Experiences That Convert" />

        <div className={styles.grid}>
          {services.map((service, index) => (
            <div
              key={service.number}
              className={`${styles.card} ${isInView ? styles.visible : ""}`}
              style={{ transitionDelay: `${index * 0.15}s` }}
            >
              <span className={styles.number}>{service.number}</span>
              <h3 className={styles.title}>{service.title}</h3>
              <p className={styles.description}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
