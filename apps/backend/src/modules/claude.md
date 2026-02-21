# 이 폴더는 백엔드 API 모듈을 포함합니다.

## 모듈 목록
- `projects/` — 프로젝트 데이터 API
  - `routes.ts` — GET /projects (목록), GET /projects/:slug (상세)
- `contact/` — 상담 폼 처리
  - `routes.ts` — POST /contact (리드 수집, 이메일 전송)
  - `email.ts` — Nodemailer 설정 및 전송 함수

## API 엔드포인트
| Method | Path | 설명 |
|--------|------|------|
| GET | /projects | 프로젝트 요약 목록 |
| GET | /projects/:slug | 프로젝트 상세 |
| POST | /contact | 상담 문의 접수 + 이메일 |
