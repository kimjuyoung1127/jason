/* Header - Sticky navigation bar with scroll-aware background blur and responsive layout */
"use client";

import { useEffect, useState } from "react";
import styles from "./header.module.css";

const NAV_ITEMS = ["Index", "Studio", "Contact"] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // check initial position

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`${styles.header} ${scrolled ? styles.fixed : ""}`}
    >
      <div className={styles.logo}>
        <span className={styles.logoText}>JASON.</span>
        <span className={styles.subtitle}>Creative Engineer</span>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {NAV_ITEMS.map((item) => (
            <li key={item} className={styles.navItem}>
              <a href={`#${item.toLowerCase()}`} className={styles.navLink}>
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
