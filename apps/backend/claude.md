# 이 파일은 백엔드 구현 규칙을 정의합니다.

## 기술 스택
- Express 4.x + TypeScript
- Nodemailer (이메일 전송)
- 포트: 4000 (기본)

## 모듈 구조
- `src/modules/projects/` — 프로젝트 CRUD API
- `src/modules/contact/` — 상담 폼 + 이메일 전송
- `src/data/` — 정적 데이터

## 규칙
- 프론트엔드와 모듈명 1:1 대응 유지 (projects, contact)
- 환경변수는 .env 파일로 관리 (.env.example 참조)
- 모든 파일 첫 줄에 기능 설명 주석 필수
