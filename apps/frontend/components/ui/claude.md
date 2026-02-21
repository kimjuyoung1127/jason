# 이 폴더는 공통 재사용 UI 컴포넌트를 포함합니다.

## 파일 목록
- `noise-overlay.tsx` — SVG 노이즈 텍스처 오버레이 (fixed, z-index 40)
- `custom-cursor.tsx` — 커스텀 마우스 커서 + CursorContext (데스크톱 전용)
- `intro-loader.tsx` — 초기 로딩 화면 ("INITIALIZING" 펄스)
- `cta-button.tsx` — CTA 버튼 (Primary / Ghost 변형)
- `section-heading.tsx` — 섹션 제목 컴포넌트 (라벨 + 타이틀 + 서브타이틀)

## 사용법
- NoiseOverlay, CustomCursor, IntroLoader는 layout 또는 page 레벨에서 한 번만 렌더링
- CTAButton은 variant="primary" 또는 "ghost"로 사용
- SectionHeading은 모든 랜딩 섹션 상단에 일관되게 사용
