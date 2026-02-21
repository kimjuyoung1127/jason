# 이 폴더는 3D 스파이럴 히어로 섹션 관련 컴포넌트를 포함합니다.

## 파일 목록
- `spiral-hero.tsx` — 히어로 래퍼 (Canvas + UI 오버레이 + 폴백)
- `spiral-hero.module.css` — 히어로 래퍼 스타일
- `spiral-scene.tsx` — R3F 3D 씬 (조명, 스파이럴, 카메라, 애니메이션)
- `spiral-card.tsx` — 개별 프로젝트 카드 메시 컴포넌트
- `card-texture.ts` — Canvas 기반 카드 텍스처 생성 유틸리티
- `detail-overlay.tsx` — 프로젝트 디테일 슬라이드-인 오버레이
- `detail-overlay.module.css` — 오버레이 스타일

## 핵심 규칙
- 모든 R3F 코드는 `dynamic(..., { ssr: false })`로 임포트
- 스파이럴 수식: r = 2 + t*18, theta = t*PI*6 (토네이도 형태)
- 상태머신: gallery → transitioning → detail → transitioning → gallery
