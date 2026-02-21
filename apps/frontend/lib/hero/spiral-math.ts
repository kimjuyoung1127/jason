/** 스파이럴 카드의 불규칙적 위치와 회전을 계산하는 공유 유틸리티입니다. */

/* ── Deterministic pseudo-random hash (index-based, consistent across renders) ── */
function hash(n: number): number {
  const s = Math.sin(n * 127.1 + n * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export type SpiralPosition = {
  x: number;
  y: number;
  z: number;
  yaw: number;
  tiltX: number;
  tiltZ: number;
};

export function getSpiralPosition(index: number, total: number): SpiralPosition {
  const t = index / Math.max(total - 1, 1);

  /* ── Base spiral (top-heavy funnel — more cards clustered above center) ── */
  const baseY = -5 + t * 25;
  const baseR = 3 + t * 15;
  const baseTheta = t * Math.PI * 6;

  /* ── Per-card irregularity (deterministic, seeded by index) ── */
  const yJitter = (hash(index * 5 + 1) - 0.5) * 4;       // ±2 units vertical
  const rJitter = (hash(index * 5 + 2) - 0.5) * 3;       // ±1.5 units radius
  const thetaJitter = (hash(index * 5 + 3) - 0.5) * 0.5;  // ±0.25 radians angle

  const y = baseY + yJitter;
  const r = baseR + rJitter;
  const theta = baseTheta + thetaJitter;
  const x = Math.cos(theta) * r;
  const z = Math.sin(theta) * r;

  /* ── Orientation: mostly upright with slight organic tilt ── */
  const yaw = Math.atan2(x, z);
  const tiltX = (hash(index * 5 + 4) - 0.5) * 0.18;  // ±~5° forward/back
  const tiltZ = (hash(index * 5 + 5) - 0.5) * 0.18;  // ±~5° sideways

  return { x, y, z, yaw, tiltX, tiltZ };
}
