/* Footer - Three-column site footer with logo/tagline, navigation links, and social
   links. Includes a bottom copyright bar. Server component with no client interactivity. */
import styles from "./styles/footer.module.css";

const navLinks = [
  { label: "Index", href: "#" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;

const socialLinks = [
  { label: "GitHub", href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Email", href: "mailto:hello@jason.dev" },
] as const;

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container-shell ${styles.inner}`}>
        <div className={styles.grid}>
          {/* Column 1: Logo + tagline */}
          <div className={styles.column}>
            <span className={styles.logo}>JASON.</span>
            <span className={styles.tagline}>Creative Engineer</span>
          </div>

          {/* Column 2: Navigation */}
          <div className={styles.column}>
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className={styles.link}>
                {link.label}
              </a>
            ))}
          </div>

          {/* Column 3: Social */}
          <div className={styles.column}>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={styles.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; 2026 Jason. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

