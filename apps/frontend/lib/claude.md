# 이 폴더는 유틸리티, 커스텀 훅, 데이터 파일을 포함합니다.

## 파일 목록
- `projects.ts` — 프로젝트 데이터 단일 소스 (Project 타입 + 10개 프로젝트)
- `use-reduced-motion.ts` — prefers-reduced-motion 감지 훅
- `use-webgl-support.ts` — WebGL 지원 여부 감지 훅
- `use-in-view.ts` — IntersectionObserver 기반 뷰포트 진입 감지 훅

## 규칙
- 프로젝트 데이터는 반드시 projects.ts에서만 관리 (백엔드는 별도 복사본)
- 모든 훅은 "use client" 지시문 포함
- 훅 네이밍: use-kebab-case.ts, export function useCamelCase()
