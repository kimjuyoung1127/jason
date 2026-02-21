/** 이 파일은 브라우저의 WebGL 지원 여부를 감지하는 훅을 제공합니다. */
"use client";

import { useState, useEffect } from "react";

export function useWebGLSupport(): boolean {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}
