/* NoiseOverlay - Fixed full-screen SVG noise texture overlay for visual grain effect */
import styles from "./styles/noise-overlay.module.css";

const NOISE_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`;

export default function NoiseOverlay() {
  return (
    <div
      className={styles.overlay}
      style={{ backgroundImage: NOISE_SVG }}
      aria-hidden="true"
    />
  );
}

