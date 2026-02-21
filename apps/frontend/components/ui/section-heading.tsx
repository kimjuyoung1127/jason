/* SectionHeading - Reusable section header with accent label, display title, and optional subtitle */
import styles from "./styles/section-heading.module.css";

interface SectionHeadingProps {
  label: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeading({
  label,
  title,
  subtitle,
}: SectionHeadingProps) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>{label}</span>
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}

