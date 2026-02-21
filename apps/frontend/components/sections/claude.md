# 이 폴더는 랜딩페이지 전환 섹션 컴포넌트를 포함합니다.

## 배치 순서 (page.tsx 기준)
1. `about-services.tsx` — 서비스 소개 (3컬럼: Web / AI / Design)
2. `social-proof.tsx` — 신뢰 지표 (프로젝트 수, 만족도, 경력)
3. `testimonials.tsx` — 고객 후기 (3카드)
4. `faq.tsx` — 자주 묻는 질문 (아코디언 6항목)
5. `consultation-form.tsx` — 상담 폼 (이메일 전송)
6. `final-cta.tsx` — 최종 CTA
7. `footer.tsx` — 푸터

## 규칙
- 각 섹션은 자체 CSS Module 파일과 함께 생성
- 스크롤 진입 애니메이션은 useInView 훅 사용
- 헤딩/CTA는 영어, 설명문은 한국어
- 모든 섹션은 max-width: 1320px, margin: auto
