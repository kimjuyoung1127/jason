# 이 폴더는 Next.js App Router 페이지를 포함합니다.

## 라우트 구조
- `page.tsx` — 랜딩페이지 (히어로 + 전환 섹션 전체 조립)
- `layout.tsx` — 글로벌 HTML 레이아웃, 폰트, 메타데이터
- `globals.css` — 전역 스타일, CSS 변수, z-index 레이어
- `contact/page.tsx` — 상담 폼 전용 페이지 (보조)
- `projects/[slug]/page.tsx` — 프로젝트 상세 SEO 루트 (보조)

## 규칙
- 메타데이터는 layout.tsx에서 관리한다.
- 글로벌 CSS 변수는 globals.css :root에 집중한다.
- 페이지 컴포넌트는 최대한 조립 역할만 하고, 로직은 하위 컴포넌트에 위임한다.
