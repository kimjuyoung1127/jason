/** 3D scene orchestration for camera flow, interaction, and transitions. */
"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Project } from "@/lib/projects";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { getSpiralPosition } from "@/lib/hero/spiral-math";
import { SpiralCard } from "./spiral-card";

type ViewState = "gallery" | "transitioning" | "detail";

type SpiralSceneProps = {
  projects: Project[];
  onSelectProject: (index: number) => void;
  activeIndex: number | null;
};

export function SpiralScene({
  projects,
  onSelectProject,
  activeIndex,
}: SpiralSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotationY = useRef(0);
  const targetRotationX = useRef(0);
  const viewState = useRef<ViewState>("gallery");
  const reducedMotion = useReducedMotion();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  /* ?? Camera transition targets ?? */
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 45));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const defaultCameraPos = new THREE.Vector3(0, 0, 45);
  const defaultLookAt = new THREE.Vector3(0, 3, 0);

  const { camera, clock } = useThree();

  /* ?? Set initial camera FOV ?? */
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 45;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  /* ?? Mouse interaction: drag rotation + scroll ?? */
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (viewState.current !== "gallery") return;
      targetRotationY.current += e.movementX * 0.001;
      targetRotationX.current = (e.clientY / window.innerHeight - 0.5) * 0.1;
    };

    const handleWheel = (e: WheelEvent) => {
      if (viewState.current !== "gallery") return;
      targetRotationY.current += e.deltaY * 0.005;
    };

    /* Touch support for mobile */
    let lastTouchX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (viewState.current !== "gallery" || e.touches.length !== 1) return;
      lastTouchX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (viewState.current !== "gallery" || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - lastTouchX;
      lastTouchX = e.touches[0].clientX;
      targetRotationY.current += deltaX * 0.003;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  /* ?? Handle project selection: compute camera flyto ?? */
  useEffect(() => {
    if (activeIndex !== null) {
      const total = projects.length;
      const pos = getSpiralPosition(activeIndex, total);

      const cardWorldPos = new THREE.Vector3(pos.x, pos.y, pos.z);

      /* Apply the group's current rotation to get true world position */
      if (groupRef.current) {
        cardWorldPos.applyMatrix4(groupRef.current.matrixWorld);
      }

      /* Normal direction: from origin towards the card, in the XZ plane */
      const normal = new THREE.Vector3(cardWorldPos.x, 0, cardWorldPos.z).normalize();

      /* Camera offset: 15 units along normal, shifted left by 3 */
      const left = new THREE.Vector3()
        .crossVectors(new THREE.Vector3(0, 1, 0), normal)
        .normalize();

      cameraTarget.current.copy(cardWorldPos).addScaledVector(normal, 15).addScaledVector(left, 3);
      currentLookAt.current.copy(camera.position); // start from current camera pos for smooth lerp

      viewState.current = "transitioning";
    } else {
      /* Closing: reset targets */
      cameraTarget.current.copy(defaultCameraPos);
      viewState.current = viewState.current === "gallery" ? "gallery" : "transitioning";
    }
  }, [activeIndex, projects, camera]);

  /* ?? Per-frame animation loop ?? */
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const state = viewState.current;

    if (state === "gallery") {
      /* Auto-rotation */
      if (!reducedMotion) {
        targetRotationY.current += delta * 0.1;
      }

      /* Smooth rotation */
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotationY.current,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotationX.current,
        0.05
      );

      /* Floating bob */
      if (!reducedMotion) {
        groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 1.5;
      }

      /* Keep camera at default gallery position */
      camera.position.lerp(defaultCameraPos, 0.04);
      currentLookAt.current.lerp(defaultLookAt, 0.04);
      camera.lookAt(currentLookAt.current);
    }

    if (state === "transitioning" || state === "detail") {
      /* Lerp camera toward card */
      camera.position.lerp(cameraTarget.current, 0.04);

      /* Determine the look-at target */
      const lookAtTarget = activeIndex !== null
        ? (() => {
            const total = projects.length;
            const sp = getSpiralPosition(activeIndex, total);
            const cardPos = new THREE.Vector3(sp.x, sp.y, sp.z);
            if (groupRef.current) {
              cardPos.applyMatrix4(groupRef.current.matrixWorld);
            }
            return cardPos;
          })()
        : defaultLookAt;

      currentLookAt.current.lerp(lookAtTarget, 0.04);
      camera.lookAt(currentLookAt.current);

      /* Transition complete check */
      if (state === "transitioning") {
        const dist = camera.position.distanceTo(cameraTarget.current);
        if (dist < 0.5) {
          viewState.current = activeIndex !== null ? "detail" : "gallery";
        }
      }
    }
  });

  /* ?? Hover handler factory ?? */
  const handleHover = useCallback(
    (index: number) => (v: boolean) => {
      setHoveredIndex(v ? index : null);
    },
    []
  );

  /* ?? Select handler factory ?? */
  const handleSelect = useCallback(
    (index: number) => () => {
      onSelectProject(index);
    },
    [onSelectProject]
  );

  return (
    <>
      {/* ?? Scene lighting ?? */}
      <fog attach="fog" args={[0x050505, 5, 120]} />
      <ambientLight intensity={0.7} />
      <spotLight
        position={[0, 70, 5]}
        intensity={15}
        angle={Math.PI / 2.5}
        penumbra={0.7}
        decay={1.2}
      />
      <spotLight
        position={[20, 50, 30]}
        intensity={3}
        angle={Math.PI / 4}
        penumbra={0.5}
        castShadow
      />
      <pointLight
        position={[-15, -10, 10]}
        color="#E52A2A"
        intensity={2.5}
        distance={60}
      />

      {/* ?? Spiral group ?? */}
      <group ref={groupRef}>
        {/* Central core axis */}
        <mesh>
          <cylinderGeometry args={[0.1, 0.5, 40, 16]} />
          <meshStandardMaterial
            color="#0a0a0a"
            transparent
            opacity={0.3}
            roughness={0.8}
          />
        </mesh>

        {/* Project cards */}
        {projects.map((project, index) => (
          <SpiralCard
            key={project.slug}
            project={project}
            index={index}
            total={projects.length}
            hovered={hoveredIndex === index}
            onHover={handleHover(index)}
            onSelect={handleSelect(index)}
          />
        ))}
      </group>
    </>
  );
}


