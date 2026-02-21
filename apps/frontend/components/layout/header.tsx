/* Header - Sticky navigation bar with scroll-aware background blur and mobile hamburger menu */
"use client";

import { useEffect, useState, useCallback } from "react";
import styles from "./header.module.css";

const NAV_ITEMS = ["Index", "Studio", "Contact"] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavClick = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.fixed : ""}`}
    >
      <div className={styles.logo}>
        <span className={styles.logoText}>JASON.</span>
        <span className={styles.subtitle}>Creative Engineer</span>
      </div>

      {/* Hamburger button — visible on mobile only */}
      <button
        className={`${styles.menuBtn} ${menuOpen ? styles.menuBtnOpen : ""}`}
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <span className={styles.menuLine} />
        <span className={styles.menuLine} />
        <span className={styles.menuLine} />
      </button>

      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
        <ul className={styles.navList}>
          {NAV_ITEMS.map((item) => (
            <li key={item} className={styles.navItem}>
              <a
                href={`#${item.toLowerCase()}`}
                className={styles.navLink}
                onClick={handleNavClick}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
