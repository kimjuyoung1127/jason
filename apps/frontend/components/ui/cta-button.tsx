/* CtaButton - Polymorphic CTA button/link with "primary" and "ghost" brutalist variants */
import styles from "./styles/cta-button.module.css";

interface CtaButtonProps {
  variant: "primary" | "ghost";
  href?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

export default function CtaButton({
  variant,
  href,
  children,
  onClick,
  className,
}: CtaButtonProps) {
  const cls = [
    styles.button,
    variant === "primary" ? styles.primary : styles.ghost,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

