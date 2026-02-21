# 이 폴더는 페이지 레이아웃 컴포넌트를 포함합니다.

## 파일 목록
- `header.tsx` — 고정 헤더 (JASON. 로고 + 네비게이션)
- `header.module.css` — 헤더 스타일

## Header 동작
- 초기: position absolute (히어로 위 투명 배경)
- 스크롤 100vh 이후: position fixed + backdrop-filter blur
- 모바일: 네비게이션 숨김, 로고만 표시
