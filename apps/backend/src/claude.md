# 이 폴더는 백엔드 소스 코드를 포함합니다.

## 파일 구조
- `server.ts` — Express 앱 초기화, 미들웨어, 라우트 마운트
- `data/projects.ts` — 프로젝트 데이터 (프론트엔드와 동기화)
- `modules/projects/routes.ts` — GET /projects, GET /projects/:slug
- `modules/contact/routes.ts` — POST /contact (리드 수집 + 이메일)
- `modules/contact/email.ts` — Nodemailer 이메일 전송 유틸리티
