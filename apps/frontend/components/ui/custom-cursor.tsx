/* CustomCursor - Client-side custom cursor with hover state, context provider, and rAF-driven positioning */
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./styles/custom-cursor.module.css";

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface CursorContextValue {
  setHover: (v: boolean) => void;
}

export const CursorContext = createContext<CursorContextValue>({
  setHover: () => {},
});

export function useCursor() {
  return useContext(CursorContext);
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [hover, setHover] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const position = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);

  const update = useCallback(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${position.current.x}px, ${position.current.y}px) translate(-50%, -50%)`;
    }
    raf.current = requestAnimationFrame(update);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      position.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    raf.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf.current);
    };
  }, [update]);

  return (
    <CursorContext.Provider value={{ setHover }}>
      {children}
      <div
        ref={cursorRef}
        className={`${styles.cursor} ${hover ? styles.hover : ""}`}
      />
    </CursorContext.Provider>
  );
}

