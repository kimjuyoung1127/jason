# 이 파일은 2026-02-21 UX 폴리싱 + 스포트라이트 세션 기록입니다.

## 목표
- consultation-form 중앙정렬
- 히어로 섹션 스포트라이트 효과로 카드 가시성 향상
- 전체 가독성 개선 (muted 색상, line-height)
- 새 포트폴리오 3개 추가 (Cobalt, Perspective Funnels, Workable)

## 주요 작업

### consultation-form 중앙정렬
- `.sectionInner` 클래스 추가 → `text-align: center` (SectionHeading 중앙정렬)
- `.form`, `.completionIndicator`, `.successCard`, `.trust` → `margin: auto` 적용
- `consultation-form.tsx` — `container-shell`에 `sectionInner` 클래스 결합

### 히어로 스포트라이트 효과
- `spiral-scene.tsx` — 상단 스포트라이트 추가 `[0, 70, 5]` intensity 15, angle π/2.5
- ambient light 0.4 → 0.7, fog far 80 → 120, fog color #030303 → #050505
- red point light intensity 2 → 2.5, distance 50 → 60
- `spiral-hero.module.css` — `.wrap::before` CSS radial gradient 후광 (accent 레드 틴트)
- `spiral-card.tsx` — roughness 0.4 → 0.25, metalness 0.1 → 0.15, emissive #111 추가

### 스파이럴 분포 조정 (상단 편중)
- `spiral-math.ts` — Y range [-15,+15] → [-5,+20], radius 2~20 → 3~18
- camera defaultLookAt [0,0,0] → [0,3,0] (상단 카드 프레이밍)

### 가독성 개선
- `globals.css` — `--muted` #9a9a9a → #ababab (contrast ratio 향상)
- `section-heading.module.css` — subtitle line-height 1.6 → 1.75
- `faq.module.css` — answerText line-height 1.7 → 1.8
- `testimonials.module.css` — quote line-height 1.7 → 1.75

### 새 포트폴리오 추가
- `projects.ts` — Cobalt (Fintech), Perspective Funnels (Marketing SaaS), Workable (HR Tech) 추가
- 썸네일: cobalt.png, funnels.png, workable.png (이미 public/thumbnails에 존재)
- 총 프로젝트 10개 → 13개, 빌드 route 14개 → 17개

## 다음 작업
- 브라우저에서 히어로 스포트라이트 시각 확인 및 intensity 미세 조정
- 모바일 768px 이하 consultation-form 중앙정렬 확인
- 새 프로젝트 3개 케이스 스터디 내용 상세화

## 검증
- `npm run build` 성공 — 17개 route 정상 생성
- TypeScript 컴파일 에러 없음
