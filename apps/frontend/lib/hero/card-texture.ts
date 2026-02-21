/** Canvas texture generator for project cards in the hero scene. */
import * as THREE from "three";
import type { Project } from "@/lib/projects";

export function drawCardCanvas(project: Project, index: number): HTMLCanvasElement {
  const width = 800;
  const height = 1000;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  /* ?? dark background ?? */
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, width, height);

  /* ?? subtle grid lines ?? */
  ctx.strokeStyle = "#1a1a1a";
  ctx.lineWidth = 1;
  for (let x = 0; x <= width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  /* ?? geometric art ?? */
  const useRect = index % 2 === 0;
  const useRed = index % 3 === 0;
  ctx.fillStyle = useRed ? "#E52A2A" : "#ffffff";

  if (useRect) {
    const rw = 200 + (index * 37) % 120;
    const rh = 200 + (index * 53) % 120;
    const rx = (width - rw) / 2;
    const ry = height * 0.25 - rh / 2;
    ctx.fillRect(rx, ry, rw, rh);
  } else {
    const radius = 100 + (index * 29) % 80;
    const cx = width / 2;
    const cy = height * 0.25;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ?? noise scratches ?? */
  for (let i = 0; i < 500; i++) {
    const nx = Math.random() * width;
    const ny = Math.random() * height;
    const nw = Math.random() * 3 + 0.5;
    const nh = Math.random() * 1.5 + 0.3;
    const alpha = Math.random() * 0.08;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(nx, ny, nw, nh);
  }

  /* ?? title text ?? */
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 120px 'Syne', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(project.title, 40, height - 180);

  /* ?? ID + client text ?? */
  ctx.fillStyle = "#999999";
  ctx.font = "30px 'JetBrains Mono', monospace";
  ctx.fillText(`${project.id} ??${project.client}`, 40, height - 80);

  return canvas;
}

function loadImage(src: string, priority = false): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    if (priority) {
      (img as unknown as Record<string, string>).fetchPriority = "high";
    }
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawThumbnailCard(
  project: Project,
  img: HTMLImageElement
): HTMLCanvasElement {
  const width = 800;
  const height = 1000;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  /* ?? thumbnail image covers full card ?? */
  const scale = Math.max(width / img.width, height / img.height);
  const sw = img.width * scale;
  const sh = img.height * scale;
  const sx = (width - sw) / 2;
  const sy = (height - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh);

  /* ?? bottom gradient overlay ?? */
  const grad = ctx.createLinearGradient(0, height * 0.5, 0, height);
  grad.addColorStop(0, "rgba(0, 0, 0, 0)");
  grad.addColorStop(0.5, "rgba(0, 0, 0, 0.6)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0.9)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, height * 0.5, width, height * 0.5);

  /* ?? title text ?? */
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 80px 'Syne', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(project.title, 40, height - 120);

  /* ?? ID + client text ?? */
  ctx.fillStyle = "#cccccc";
  ctx.font = "26px 'JetBrains Mono', monospace";
  ctx.fillText(`${project.id} ??${project.client}`, 40, height - 60);

  return canvas;
}

export async function createCardTexture(
  project: Project,
  index: number,
  renderer: THREE.WebGLRenderer,
  priority = false
): Promise<THREE.CanvasTexture> {
  await document.fonts.ready;

  let canvas: HTMLCanvasElement;

  if (project.ogImage) {
    try {
      const img = await loadImage(project.ogImage, priority);
      canvas = drawThumbnailCard(project, img);
    } catch {
      canvas = drawCardCanvas(project, index);
    }
  } else {
    canvas = drawCardCanvas(project, index);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  if (renderer.capabilities.getMaxAnisotropy) {
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  }

  texture.needsUpdate = true;
  return texture;
}

