/** Individual spiral card mesh with hover and click interactions. */
"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { Project } from "@/lib/projects";
import { createCardTexture } from "@/lib/hero/card-texture";
import { getSpiralPosition } from "@/lib/hero/spiral-math";

type SpiralCardProps = {
  project: Project;
  index: number;
  total: number;
  hovered: boolean;
  onHover: (v: boolean) => void;
  onSelect: () => void;
};

export function SpiralCard({
  project,
  index,
  total,
  hovered,
  onHover,
  onSelect,
}: SpiralCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const { gl } = useThree();

  /* ?? Irregular spiral position ?? */
  const { x, y, z, yaw, tiltX, tiltZ } = getSpiralPosition(index, total);

  /* ?? Generate texture once ?? */
  useEffect(() => {
    let cancelled = false;

    const isPriority = index < 3;
    const delay = isPriority ? 0 : (index - 2) * 100;

    const timer = setTimeout(() => {
      createCardTexture(project, index, gl, isPriority).then((tex) => {
        if (!cancelled) setTexture(tex);
      });
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [project, index, gl]);

  /* ?? Set orientation: mostly upright with slight organic tilt ?? */
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.set(tiltX, yaw, tiltZ);
    }
  }, [yaw, tiltX, tiltZ]);

  /* ?? Animate hover scale + emissive ?? */
  useFrame(() => {
    if (!meshRef.current) return;

    const targetScale = hovered ? 1.15 : 1.0;
    const current = meshRef.current.scale.x;
    const next = THREE.MathUtils.lerp(current, targetScale, 0.1);
    meshRef.current.scale.setScalar(next);

    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    if (mat.emissive) {
      const targetEmissive = hovered ? 0x220000 : 0x000000;
      mat.emissive.lerp(new THREE.Color(targetEmissive), 0.1);
    }
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(true);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(false);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <mesh
      ref={meshRef}
      position={[x, y, z]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <planeGeometry args={[6, 7.5, 1, 1]} />
      <meshStandardMaterial
        side={THREE.DoubleSide}
        roughness={0.25}
        metalness={0.15}
        emissive="#111111"
        emissiveIntensity={0.15}
        map={texture}
        transparent
      />
    </mesh>
  );
}


