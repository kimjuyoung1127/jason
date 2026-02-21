# WK ERP System — Product Requirements Document (PRD)

> **Version:** 1.0.0
> **Last Updated:** 2026-02-10
> **Status:** Phase 1 — Frontend UI 개발 준비

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [시스템 아키텍처](#3-시스템-아키텍처)
4. [DB 스키마 설계](#4-db-스키마-설계)
5. [공통 컴포넌트 명세](#5-공통-컴포넌트-명세)
6. [페이지별 상세 명세](#6-페이지별-상세-명세)
7. [상태 관리 설계](#7-상태-관리-설계)
8. [API 엔드포인트](#8-api-엔드포인트)
9. [권한 체계](#9-권한-체계)
10. [에러 핸들링](#10-에러-핸들링)
11. [개발 페이즈 계획](#11-개발-페이즈-계획)

---

## 1. 프로젝트 개요

### 1.1 목표

해외 소싱 상품의 **입고 → 재고관리 → 주문처리 → 출고 → 정산**을 통합 관리하는 ERP 시스템.
이카운트(eCount) ERP의 UX를 벤치마킹하되, 자체 비즈니스 로직을 추가한다.

### 1.2 핵심 기능

| 기능 | 설명 |
|------|------|
| **멀티 테넌트** | 본사(Master)와 판매 조직(Branch) 간 데이터 분리 및 통합 관제 |
| **바코드 입고** | Global Key Listener + 최소수량 자동 곱셈 |
| **링크 발주** | 카톡 공유 주문 링크 → 재고 자동 차감 |
| **거래명세서 자동발행** | 미입금 건 누적 합산 + 카카오톡 알림톡 발송 |
| **미수금 자동관리** | 블랙리스트 자동 전환 + 대시보드 경고 |

### 1.3 개발 전략

```
Phase 1   : Frontend First (UI/UX 완성) — Mock 데이터 기반
Phase 1.5 : 반자동 정산 로직 (클라이언트 사이드 계산)
Phase 2   : Backend/DB 연동 + 외부 API 통합
```

---

## 2. 기술 스택

### 2.1 Core Stack

| 구분 | 기술 | 버전 |
|------|------|------|
| **Framework** | Next.js (App Router) | 14+ |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 3.x |
| **UI Components** | Shadcn/UI | latest |
| **State (Client)** | Zustand | 4.x |
| **State (Server)** | TanStack React Query | 5.x |
| **Forms** | React Hook Form + Zod | latest |
| **Tables** | TanStack Table | 8.x |
| **Date** | date-fns | latest |
| **Icons** | Lucide React | latest |

### 2.2 Backend Stack (Phase 2)

| 구분 | 기술 |
|------|------|
| **Backend** | Supabase Edge Functions |
| **Database** | Supabase (PostgreSQL) — RLS 필수 |
| **Auth** | 카카오 OAuth 2.0 (Supabase Auth) |
| **오프라인** | TanStack Query Persist + LocalStorage |
| **하드웨어** | Web Bluetooth API (라벨 프린터) |

### 2.3 외부 API (Phase 2)

| 서비스 | 용도 |
|--------|------|
| **팝빌 (Popbill)** | 계좌조회, 예금주조회, 알림톡, SMS/LMS, 전자세금계산서, 현금영수증, 사업자등록상태조회 |
| **스윗트래커** | 택배 배송 추적 |
| **공급처 ERP (China)** | ⏳ PENDING |

---

## 3. 시스템 아키텍처

### 3.1 디렉토리 구조

```
wk/
├── public/
│   └── assets/                    # 정적 이미지, 아이콘
├── src/
│   ├── app/                       # Next.js App Router 페이지
│   │   ├── (auth)/                # 인증 레이아웃 그룹
│   │   │   └── login/
│   │   ├── (dashboard)/           # 메인 레이아웃 그룹 (사이드바 포함)
│   │   │   ├── layout.tsx         # 사이드바 + 헤더 레이아웃
│   │   │   ├── page.tsx           # 대시보드 메인
│   │   │   ├── master/            # 기초등록
│   │   │   │   ├── employees/
│   │   │   │   ├── items/
│   │   │   │   ├── partners/
│   │   │   │   └── warehouses/
│   │   │   ├── purchase/          # 구매관리
│   │   │   │   ├── input/
│   │   │   │   ├── list/
│   │   │   │   └── status/
│   │   │   ├── production/        # 생산입고
│   │   │   │   ├── input/
│   │   │   │   └── list/
│   │   │   ├── sales/             # 판매관리
│   │   │   │   ├── input/
│   │   │   │   ├── list/
│   │   │   │   ├── status/
│   │   │   │   └── payment/
│   │   │   ├── order-link/        # 링크발주
│   │   │   │   ├── list/
│   │   │   │   └── create/
│   │   │   ├── invoice/           # 거래명세서
│   │   │   ├── accounting/        # 회계/재무
│   │   │   │   ├── bank/
│   │   │   │   ├── settlement/
│   │   │   │   ├── partner-settlement/
│   │   │   │   └── tax/
│   │   │   └── system/            # 시스템설정
│   │   │       └── permissions/
│   │   ├── order/                 # 링크발주 외부 공개 페이지 (사이드바 없음)
│   │   │   └── [linkId]/
│   │   └── api/                   # API Routes (Phase 2)
│   │       ├── auth/
│   │       ├── master/
│   │       ├── purchase/
│   │       ├── production/
│   │       ├── sales/
│   │       ├── order-link/
│   │       ├── invoice/
│   │       └── accounting/
│   ├── components/                # 재사용 컴포넌트
│   │   ├── ui/                    # Shadcn/UI 기본 컴포넌트 (Button, Input 등)
│   │   ├── layout/                # 레이아웃 컴포넌트
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   └── page-wrapper.tsx
│   │   ├── common/                # 공통 비즈니스 컴포넌트
│   │   │   ├── list-page.tsx      # 조회 페이지 공통 레이아웃
│   │   │   ├── input-modal.tsx    # 입력 팝업 공통 레이아웃
│   │   │   ├── register-page.tsx  # 기초등록 공통 레이아웃
│   │   │   ├── search-panel.tsx   # 상세검색 패널
│   │   │   ├── data-table.tsx     # 공통 데이터 테이블
│   │   │   ├── pagination.tsx     # 페이지네이션
│   │   │   ├── tab-filter.tsx     # 탭 필터
│   │   │   ├── item-search-popup.tsx   # 품목 검색 팝업
│   │   │   ├── partner-search-popup.tsx # 거래처 검색 팝업
│   │   │   ├── employee-search-popup.tsx # 직원 검색 팝업
│   │   │   └── warehouse-search-popup.tsx # 창고 검색 팝업
│   │   └── domain/                # 도메인별 전용 컴포넌트
│   │       ├── dashboard/
│   │       ├── master/
│   │       ├── purchase/
│   │       ├── production/
│   │       ├── sales/
│   │       ├── order-link/
│   │       ├── invoice/
│   │       ├── accounting/
│   │       └── system/
│   ├── lib/                       # 유틸리티 & 비즈니스 로직
│   │   ├── utils/                 # 범용 유틸리티 함수
│   │   │   ├── format.ts          # 숫자 콤마, 전화번호, 사업자번호 포맷
│   │   │   ├── date.ts            # 날짜 유틸리티
│   │   │   ├── validation.ts      # Zod 스키마 & 검증
│   │   │   └── cn.ts              # Tailwind 클래스 병합
│   │   ├── store/                 # Zustand 스토어
│   │   │   ├── auth-store.ts      # 인증 상태
│   │   │   ├── sidebar-store.ts   # 사이드바 상태
│   │   │   ├── permission-store.ts # 권한 상태
│   │   │   └── ui-store.ts        # UI 전역 상태 (모달, 토스트 등)
│   │   ├── hooks/                 # 커스텀 React 훅
│   │   │   ├── use-barcode-scanner.ts  # 바코드 스캐너 훅
│   │   │   ├── use-pagination.ts
│   │   │   ├── use-search.ts
│   │   │   └── use-keyboard-shortcut.ts
│   │   ├── api/                   # API 클라이언트 (Phase 2)
│   │   │   └── client.ts
│   │   ├── mock/                  # Mock 데이터 (Phase 1)
│   │   │   ├── employees.ts
│   │   │   ├── items.ts
│   │   │   ├── partners.ts
│   │   │   ├── warehouses.ts
│   │   │   ├── purchases.ts
│   │   │   ├── productions.ts
│   │   │   ├── sales.ts
│   │   │   └── order-links.ts
│   │   └── constants/             # 상수 정의
│   │       ├── menu.ts            # 사이드바 메뉴 구조
│   │       ├── permissions.ts     # 권한 키 상수
│   │       └── options.ts         # Select 옵션 상수
│   └── types/                     # TypeScript 타입 정의
│       ├── employee.ts
│       ├── item.ts
│       ├── partner.ts
│       ├── warehouse.ts
│       ├── purchase.ts
│       ├── production.ts
│       ├── sale.ts
│       ├── order-link.ts
│       ├── invoice.ts
│       ├── permission.ts
│       └── common.ts             # 공용 타입 (Pagination, SearchParams 등)
├── supabase/                      # Supabase 설정 (Phase 2)
│   ├── migrations/
│   └── seed.sql
├── docs/                          # 프로젝트 문서
│   ├── PRD.md                     # 이 문서
│   └── meta-prompt-for-prd.md
├── CLAUDE.md                      # 루트 개발 규칙
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
├── .env.local.example
└── .gitignore
```

### 3.2 라우팅 맵

| URL 경로 | 페이지 | 레이아웃 |
|----------|--------|----------|
| `/` | 대시보드 | Dashboard Layout |
| `/master/employees` | 직원등록 | Dashboard Layout |
| `/master/items` | 품목등록 | Dashboard Layout |
| `/master/partners` | 거래처등록 | Dashboard Layout |
| `/master/warehouses` | 창고등록 | Dashboard Layout |
| `/purchase/input` | 구매입력 | Dashboard Layout |
| `/purchase/list` | 구매조회 | Dashboard Layout |
| `/purchase/status` | 구매현황 | Dashboard Layout |
| `/production/input` | 생산입고 | Dashboard Layout |
| `/production/list` | 생산입고조회 | Dashboard Layout |
| `/sales/input` | 판매입력 | Dashboard Layout |
| `/sales/list` | 판매조회 | Dashboard Layout |
| `/sales/status` | 판매현황 | Dashboard Layout |
| `/sales/payment` | 결제내역조회 | Dashboard Layout |
| `/order-link/list` | 링크조회 | Dashboard Layout |
| `/order-link/create` | 링크생성 | Dashboard Layout |
| `/invoice` | 거래명세서 발행 | Dashboard Layout |
| `/accounting/bank` | 계좌조회 | Dashboard Layout |
| `/accounting/settlement` | 정산/결산 관리 | Dashboard Layout |
| `/accounting/partner-settlement` | 거래처정산 | Dashboard Layout |
| `/accounting/tax` | 세무/부가세 | Dashboard Layout |
| `/system/permissions` | 권한관리 | Dashboard Layout |
| `/order/[linkId]` | 링크발주 외부 페이지 | **Standalone** (사이드바 없음) |
| `/login` | 로그인 | Auth Layout |

### 3.3 사이드바 메뉴 구조

```typescript
// src/lib/constants/menu.ts 기준

const MENU_STRUCTURE = [
  {
    key: "dashboard",
    label: "대시보드",
    icon: "LayoutDashboard",
    href: "/",
  },
  {
    key: "master",
    label: "기초등록",
    icon: "ClipboardList",
    defaultHref: "/master/items",
    children: [
      { key: "master.employees", label: "직원등록", href: "/master/employees" },
      { key: "master.items", label: "품목등록", href: "/master/items" },
      { key: "master.partners", label: "거래처등록", href: "/master/partners" },
      { key: "master.warehouses", label: "창고등록", href: "/master/warehouses" },
    ],
  },
  {
    key: "purchase",
    label: "구매관리",
    icon: "ShoppingCart",
    defaultHref: "/purchase/list",
    children: [
      { key: "purchase.input", label: "구매입력", href: "/purchase/input" },
      { key: "purchase.view", label: "구매조회", href: "/purchase/list" },
      { key: "purchase.status", label: "구매현황", href: "/purchase/status" },
    ],
  },
  {
    key: "production",
    label: "생산입고",
    icon: "Factory",
    defaultHref: "/production/list",
    children: [
      { key: "production.input", label: "생산입고", href: "/production/input" },
      { key: "production.view", label: "생산조회", href: "/production/list" },
    ],
  },
  {
    key: "sales",
    label: "판매관리",
    icon: "Wallet",
    defaultHref: "/sales/list",
    children: [
      { key: "sales.input", label: "판매입력", href: "/sales/input" },
      { key: "sales.view", label: "판매조회", href: "/sales/list" },
      { key: "sales.status", label: "판매현황", href: "/sales/status" },
      { key: "sales.payment", label: "결제내역조회", href: "/sales/payment" },
    ],
  },
  {
    key: "order_link",
    label: "링크발주",
    icon: "Link",
    defaultHref: "/order-link/list",
    children: [
      { key: "order_link.list", label: "링크조회", href: "/order-link/list" },
      { key: "order_link.create", label: "링크생성", href: "/order-link/create" },
    ],
  },
  {
    key: "invoice",
    label: "거래명세서",
    icon: "FileText",
    defaultHref: "/invoice",
    children: [
      { key: "invoice.issue", label: "거래명세서 발행", href: "/invoice" },
    ],
  },
  {
    key: "accounting",
    label: "회계/재무",
    icon: "Calculator",
    defaultHref: "/accounting/bank",
    children: [
      { key: "accounting.bank", label: "계좌조회", href: "/accounting/bank" },
      { key: "accounting.settlement", label: "정산/결산 관리", href: "/accounting/settlement" },
      { key: "accounting.partner", label: "거래처정산", href: "/accounting/partner-settlement" },
      { key: "accounting.tax", label: "세무/부가세", href: "/accounting/tax" },
    ],
  },
  {
    key: "system",
    label: "시스템설정",
    icon: "Settings",
    defaultHref: "/system/permissions",
    children: [
      { key: "system.permissions", label: "권한관리", href: "/system/permissions" },
    ],
  },
];
```

---

## 4. DB 스키마 설계

> Phase 1에서는 Mock 데이터로 구현하고, Phase 2에서 Supabase PostgreSQL로 마이그레이션한다.

### 4.1 ERD 개요

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ employees│     │  items   │     │ partners │
└────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │
     │     ┌──────────┼──────────┐     │
     │     │          │          │     │
┌────▼─────▼┐  ┌─────▼────┐  ┌──▼────▼──┐
│ purchases │  │productions│  │  sales   │
└───────────┘  └──────────┘  └────┬─────┘
                                  │
                           ┌──────▼──────┐
                           │ order_links  │
                           └──────┬──────┘
                                  │
                           ┌──────▼──────┐
                           │ order_items  │
                           └─────────────┘
```

### 4.2 테이블 상세

#### `tenants` — 테넌트 (멀티 테넌트 루트)

```sql
CREATE TABLE tenants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('master', 'branch')),
  parent_id   UUID REFERENCES tenants(id),
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
```

#### `employees` — 직원

```sql
CREATE TABLE employees (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id),
  code        TEXT NOT NULL,
  name        TEXT NOT NULL,
  department  TEXT,
  position    TEXT,            -- 직책: 대표, 팀장, 사원
  role        TEXT DEFAULT 'general', -- 직급: general, admin
  phone       TEXT,
  address     TEXT,
  kakao_id    TEXT,            -- 카카오 OAuth 연동
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, code)
);
```

#### `items` — 품목

```sql
CREATE TABLE items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  code            TEXT NOT NULL,              -- 품목코드 (텍스트, 0시작 가능)
  barcode         TEXT,                       -- 바코드 (텍스트, 0시작 가능)
  category        TEXT NOT NULL,              -- 구분: 기획상품, 기성상품, 정품 등
  item_type       TEXT NOT NULL,              -- 품목구분: 원재료, 부재료, 제품, 반제품, 상품
  unit            TEXT DEFAULT 'EA',          -- 단위
  spec            TEXT,                       -- 규격
  cost_price      INTEGER DEFAULT 0,          -- 상품원가 (정수, 원 단위)
  selling_price   INTEGER DEFAULT 0,          -- 판매가
  vat_type        TEXT DEFAULT 'excluded',    -- 부가세: included / excluded
  memo            TEXT,
  min_quantity    INTEGER DEFAULT 1,          -- 최소수량 (바코드 스캔 시 곱셈 기준)
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, code),
  UNIQUE(tenant_id, barcode)
);
-- 코드와 바코드는 서로 겹치면 안 됨 (앱 레벨 검증)
```

#### `partners` — 거래처

```sql
CREATE TABLE partners (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id             UUID NOT NULL REFERENCES tenants(id),
  code                  TEXT NOT NULL,
  company_name          TEXT NOT NULL,
  representative_name   TEXT,
  business_number       TEXT,           -- 사업자등록번호 (숫자만 저장, 표시 시 자동 대시)
  business_type         TEXT,           -- 업태
  business_category     TEXT,           -- 종목
  phone                 TEXT,
  email                 TEXT,
  address               TEXT,
  search_keyword        TEXT,           -- 별도 검색용 키워드
  memo                  TEXT,
  is_blacklisted        BOOLEAN DEFAULT false,
  blacklisted_at        TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT now(),
  updated_at            TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, code)
);
```

#### `warehouses` — 창고

```sql
CREATE TABLE warehouses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id),
  code        TEXT NOT NULL,
  name        TEXT NOT NULL,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, code)
);
```

#### `inventory` — 재고

```sql
CREATE TABLE inventory (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id),
  item_id       UUID NOT NULL REFERENCES items(id),
  warehouse_id  UUID NOT NULL REFERENCES warehouses(id),
  quantity      INTEGER DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, item_id, warehouse_id)
);
```

#### `purchases` — 구매 전표 (헤더)

```sql
CREATE TABLE purchases (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  slip_number     TEXT NOT NULL,       -- 전표번호 (YYYYMMDD-NNN)
  date            DATE NOT NULL,
  partner_id      UUID REFERENCES partners(id),
  employee_id     UUID REFERENCES employees(id),
  warehouse_id    UUID REFERENCES warehouses(id),  -- 입고창고
  status          TEXT DEFAULT 'draft', -- draft, pending, confirmed
  total_supply    INTEGER DEFAULT 0,   -- 공급가액 합계
  total_vat       INTEGER DEFAULT 0,   -- 부가세 합계
  total_amount    INTEGER DEFAULT 0,   -- 총액
  memo            TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, slip_number)
);
```

#### `purchase_items` — 구매 품목 (디테일)

```sql
CREATE TABLE purchase_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id   UUID NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  item_id       UUID NOT NULL REFERENCES items(id),
  quantity      INTEGER NOT NULL DEFAULT 0,
  unit_price    INTEGER NOT NULL DEFAULT 0,
  supply_amount INTEGER NOT NULL DEFAULT 0,  -- 수량 × 단가
  vat_amount    INTEGER DEFAULT 0,
  memo          TEXT,
  sort_order    INTEGER DEFAULT 0
);
```

#### `productions` — 생산입고 전표 (헤더)

```sql
CREATE TABLE productions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  slip_number     TEXT NOT NULL,
  date            DATE NOT NULL,
  employee_id     UUID REFERENCES employees(id),
  status          TEXT DEFAULT 'draft',
  memo            TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, slip_number)
);
```

#### `production_outputs` — 생산 탭 (완제품 산출)

```sql
CREATE TABLE production_outputs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_id     UUID NOT NULL REFERENCES productions(id) ON DELETE CASCADE,
  item_id           UUID NOT NULL REFERENCES items(id),  -- 생산품목 (완제품)
  source_warehouse_id UUID REFERENCES warehouses(id),    -- 소모품 창고
  target_warehouse_id UUID REFERENCES warehouses(id),    -- 받는 창고
  quantity          INTEGER NOT NULL DEFAULT 0,
  memo              TEXT,
  sort_order        INTEGER DEFAULT 0
);
```

#### `production_inputs` — 소모 탭 (원재료 소모)

```sql
CREATE TABLE production_inputs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_id       UUID NOT NULL REFERENCES productions(id) ON DELETE CASCADE,
  output_item_id      UUID NOT NULL REFERENCES items(id),  -- 연결된 생산품목
  consume_item_id     UUID NOT NULL REFERENCES items(id),  -- 소모품목 (원재료/부재료)
  quantity            INTEGER NOT NULL DEFAULT 0,
  memo                TEXT,
  sort_order          INTEGER DEFAULT 0
);
```

#### `sales` — 판매 전표 (헤더)

```sql
CREATE TABLE sales (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  slip_number     TEXT NOT NULL,
  date            DATE NOT NULL,
  partner_id      UUID REFERENCES partners(id),
  employee_id     UUID REFERENCES employees(id),
  warehouse_id    UUID REFERENCES warehouses(id),  -- 출하창고
  transaction_type TEXT DEFAULT 'vat_included',     -- 거래유형 (부가세율)
  currency        TEXT DEFAULT 'KRW',               -- 내자/외자
  status          TEXT DEFAULT 'draft',
  total_supply    INTEGER DEFAULT 0,
  total_vat       INTEGER DEFAULT 0,
  total_amount    INTEGER DEFAULT 0,
  payment_status  TEXT DEFAULT 'unpaid',  -- unpaid, partial, paid
  paid_amount     INTEGER DEFAULT 0,
  memo            TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, slip_number)
);
```

#### `sale_items` — 판매 품목 (디테일)

```sql
CREATE TABLE sale_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id       UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  item_id       UUID NOT NULL REFERENCES items(id),
  quantity      INTEGER NOT NULL DEFAULT 0,
  unit_price    INTEGER NOT NULL DEFAULT 0,
  supply_amount INTEGER NOT NULL DEFAULT 0,
  vat_amount    INTEGER DEFAULT 0,
  memo          TEXT,
  sort_order    INTEGER DEFAULT 0
);
```

#### `order_links` — 링크발주

```sql
CREATE TABLE order_links (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  link_code       TEXT NOT NULL UNIQUE,        -- URL 경로용 코드
  date            DATE NOT NULL,
  item_id         UUID NOT NULL REFERENCES items(id),
  warehouse_id    UUID NOT NULL REFERENCES warehouses(id),
  employee_id     UUID REFERENCES employees(id),
  package_quantity INTEGER NOT NULL DEFAULT 1,  -- 포장수량 (1건 = N개 재고 차감)
  order_limit     INTEGER,                      -- 발주수량 제한
  status          TEXT DEFAULT 'active',        -- active, sold_out, closed
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
```

#### `order_link_orders` — 링크발주 주문

```sql
CREATE TABLE order_link_orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_link_id   UUID NOT NULL REFERENCES order_links(id),
  orderer_name    TEXT NOT NULL,
  orderer_phone   TEXT,
  quantity        INTEGER NOT NULL DEFAULT 1,
  is_reserved     BOOLEAN DEFAULT false,  -- 재고 부족 시 예약 여부
  reserved_quantity INTEGER DEFAULT 0,
  status          TEXT DEFAULT 'ordered', -- ordered, reserved, shipped, completed
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

#### `invoices` — 거래명세서

```sql
CREATE TABLE invoices (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id),
  partner_id    UUID NOT NULL REFERENCES partners(id),
  issue_date    DATE NOT NULL,
  total_amount  INTEGER DEFAULT 0,
  status        TEXT DEFAULT 'issued', -- issued, sent, paid
  sent_at       TIMESTAMPTZ,           -- 알림톡 발송 시각
  paid_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now()
);
```

#### `invoice_items` — 거래명세서 항목

```sql
CREATE TABLE invoice_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id  UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  sale_id     UUID REFERENCES sales(id),    -- 연결된 판매 전표
  description TEXT,
  amount      INTEGER DEFAULT 0,
  is_overdue  BOOLEAN DEFAULT false          -- 미수금 건 여부
);
```

#### `receivables` — 미수금

```sql
CREATE TABLE receivables (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id       UUID NOT NULL REFERENCES tenants(id),
  partner_id      UUID NOT NULL REFERENCES partners(id),
  sale_id         UUID REFERENCES sales(id),
  amount          INTEGER NOT NULL DEFAULT 0,
  remaining       INTEGER NOT NULL DEFAULT 0,
  status          TEXT DEFAULT 'normal',  -- normal, warning, caution, blacklist
  reminder_count  INTEGER DEFAULT 0,      -- 입금 확인 메시지 발송 횟수
  last_reminded_at TIMESTAMPTZ,
  due_date        DATE,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
```

#### `permissions` — 권한

```sql
CREATE TABLE permissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id),
  employee_id   UUID NOT NULL REFERENCES employees(id),
  permission_key TEXT NOT NULL,   -- 예: "master.items", "sales.input"
  granted       BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tenant_id, employee_id, permission_key)
);
```

---

## 5. 공통 컴포넌트 명세

### 5.1 ListPage — 조회 페이지 공통 레이아웃

```
┌─────────────────────────────────────────────────┐
│  [페이지 제목]     [검색입력창]  [Search(F3)] [Option]│
├─────────────────────────────────────────────────┤
│  ▼ Search 클릭 시 아래로 펼쳐지는 상세검색 영역      │
│  ┌─────────────────────────────────────────────┐│
│  │ 시작일자 [____] ~ 종료일자 [____]            ││
│  │ 거래처 [____]  담당자 [____]  창고 [____]    ││
│  │ (페이지별 해당 칼럼 기준 검색 필드 동적 생성)  ││
│  └─────────────────────────────────────────────┘│
├─────────────────────────────────────────────────┤
│  [전체] [결재중] [미확인] [확인]  ← 탭 필터        │
│  [1] 2 3 4 5 6 >  |  /6           ← 페이지네이션 │
├─────────────────────────────────────────────────┤
│  □  │ 칼럼1 │ 칼럼2 │ 칼럼3 │ ... │             │
│  □  │  ...  │  ...  │  ...  │ ... │             │
│     (한 페이지당 20건)                            │
├─────────────────────────────────────────────────┤
│  [신규등록/입력 버튼]  [Email] [인쇄] [Excel] ...  │
└─────────────────────────────────────────────────┘
```

**Props 인터페이스:**

```typescript
interface ListPageProps {
  title: string;
  columns: ColumnDef[];
  data: any[];
  searchPlaceholder?: string;
  tabs?: TabFilter[];
  searchFields?: SearchField[];      // 상세검색 필드 구성
  actions?: ActionButton[];          // 하단 버튼들
  onRowClick?: (row: any) => void;
  pageSize?: number;                 // 기본값: 20
  showCheckbox?: boolean;
}
```

**동작 규칙:**
- 한 페이지당 **20건** 표시
- 상단 검색창: 모든 칼럼 데이터 대상 통합 검색
- Search 버튼 클릭 → 상세검색 영역 토글 (펼침/접힘)
- 기본 필터: **"전체"**
- 하단 신규 버튼 → 해당 모듈의 입력 팝업 호출
- **F3 단축키** → Search 토글

### 5.2 InputModal — 입력 팝업 공통 레이아웃

```
┌─────────────────────────────────────────────────┐
│  [담당자탭 ▼]  [+]                               │
├─────────────────────────────────────────────────┤
│  일자   [2026 / 02 / 10 📅]    거래처 [🔍____]   │
│  담당자 [🔍____]              출하창고 [🔍____]   │
│  (페이지별 상단 필드 동적 구성)                     │
├─────────────────────────────────────────────────┤
│  [찾기(F3)] [정렬] [바코드] [재고불러오기] ...      │
├─────────────────────────────────────────────────┤
│  □ │⬇│품목코드│품목명│규격│수량│단가│공급가액│부가세│적요│
│  1 │⬇│       │     │   │   │   │      │     │   │
│  2 │⬇│       │     │   │   │   │      │     │   │
│    │ │       │     │   │ 0 │   │    0  │  0  │   │
├─────────────────────────────────────────────────┤
│  ◀ [저장(F8)▼] [저장/전표(F7)] [다시작성] [리스트] │
└─────────────────────────────────────────────────┘
```

**Props 인터페이스:**

```typescript
interface InputModalProps {
  title: string;
  headerFields: HeaderField[];        // 상단 헤더 필드 구성
  columns: ColumnDef[];               // 품목 테이블 칼럼
  toolbarButtons?: ToolbarButton[];   // 중간 툴바 버튼
  footerButtons?: FooterButton[];     // 하단 버튼
  onSave: (data: any) => void;
  onSaveAndSlip?: (data: any) => void;
  onReset?: () => void;
}
```

**동작 규칙:**
- 품목코드/품목명 클릭 → 품목 검색 팝업 → 선택 시 규격, 단가 자동 입력
- 수량 입력 → 단가 × 수량 = 공급가액 자동 계산
- 부가세 → 품목의 부가세 설정(포함/미포함)에 따라 자동 분리 계산
- 행 추가: 무제한, 아래로 자동 확장
- **F8 단축키** → 저장
- **F7 단축키** → 저장/전표

### 5.3 RegisterPage — 기초등록 공통 레이아웃

```
┌─────────────────────────────────────────────────┐
│  [페이지 제목]     [검색입력창]  [Search]          │
├─────────────────────────────────────────────────┤
│  □ │ 칼럼1 │ 칼럼2 │ 칼럼3 │ ... │              │
│  □ │  ...  │  ...  │  ...  │ ... │              │
│     (리스트 형식, 한 페이지당 20건)                │
├─────────────────────────────────────────────────┤
│  [신규] [삭제] [Excel]                            │
└─────────────────────────────────────────────────┘
```

**Props 인터페이스:**

```typescript
interface RegisterPageProps {
  title: string;
  columns: ColumnDef[];
  data: any[];
  searchPlaceholder?: string;
  onRowClick?: (row: any) => void;
  onAdd?: () => void;
  onDelete?: (ids: string[]) => void;
  editMode?: 'inline' | 'popup';     // 인라인 편집 또는 팝업 편집
}
```

### 5.4 SearchPanel — 상세검색 패널

```typescript
interface SearchPanelProps {
  fields: SearchField[];
  onSearch: (params: Record<string, any>) => void;
  onReset?: () => void;
}

interface SearchField {
  key: string;
  label: string;
  type: 'text' | 'date' | 'dateRange' | 'select' | 'search';  // search = 팝업 검색
  options?: { label: string; value: string }[];
  searchType?: 'partner' | 'employee' | 'warehouse' | 'item';
}
```

### 5.5 DataTable — 공통 데이터 테이블

- TanStack Table 기반
- 정렬, 필터, 선택(체크박스) 지원
- 숫자 칼럼 자동 우측 정렬 + 천단위 콤마
- 칼럼 리사이즈 지원
- 고정 헤더 (스크롤 시 헤더 고정)

### 5.6 검색 팝업 컴포넌트

| 컴포넌트 | 검색 대상 | 표시 칼럼 |
|----------|-----------|-----------|
| `ItemSearchPopup` | 품목 | 코드, 바코드, 품목명, 규격, 단가 |
| `PartnerSearchPopup` | 거래처 | 코드, 상호명, 대표자명, 전화 |
| `EmployeeSearchPopup` | 직원 | 코드, 이름, 직책, 부서 |
| `WarehouseSearchPopup` | 창고 | 코드, 창고명 |

모든 검색 팝업은 **동일한 BaseSearchPopup** 컴포넌트를 확장하여 구현한다.

```typescript
interface BaseSearchPopupProps {
  open: boolean;
  onClose: () => void;
  onSelect: (item: any) => void;
  title: string;
  columns: ColumnDef[];
  data: any[];
  searchPlaceholder?: string;
  filterFn?: (item: any) => boolean;  // 품목구분 등 필터
}
```

---

## 6. 페이지별 상세 명세

### 6.1 대시보드 (`/`)

#### 6.1.1 미수금 경고 위젯

```
┌─────────────────────────────────────────────┐
│  🚨 미수금 관리                              │
├─────────────────────────────────────────────┤
│  거래처명 │ 미수금액 │ 최초발생일 │ 경과일 │ 상태 │
│  A업체   │ 450만원  │ 02/01   │ 9일   │ 🔴  │
│  B업체   │ 320만원  │ 02/05   │ 5일   │ 🟡  │
└─────────────────────────────────────────────┘
```

**미수금 단계:**

| 경과일 | 상태 | 색상 | 액션 |
|--------|------|------|------|
| 0~2일 | 정상 | 🟢 Green | 1차 입금 확인 메시지 |
| 3~4일 | 경고 | 🟡 Yellow | 2차 메시지 |
| 5~6일 | 주의 | 🟠 Orange | 3차 메시지 |
| 7일+ 또는 3회 미응답 | 블랙리스트 | 🔴 Red | 대시보드 경고, 추가 조치 |

#### 6.1.2 오늘 발주 현황 위젯

- 품목별 재고수량, 주문수량, 출고 후 재고 표시
- 각 품목 행 **아코디언** 확장 → 거래처별 발주 수량 표시
- 거래처명 클릭 → 해당 발주건 상세 페이지 이동

### 6.2 기초등록

#### 6.2.1 직원등록 (`/master/employees`)

**레이아웃:** RegisterPage 컴포넌트 사용

| 칼럼 | 타입 | 규칙 |
|------|------|------|
| 코드 | text (unique) | 직원 고유코드 |
| 이름 | text | 필수 |
| 직책 | select | 대표, 팀장, 사원 |
| 직급 | select | 일반, 관리자 |
| 연락처 | text | 전화번호 자동 포맷 |
| 주소 | text | - |
| 카톡로그인 | text | 카카오 OAuth 연동 |

#### 6.2.2 품목등록 (`/master/items`)

**레이아웃:** RegisterPage 컴포넌트 사용

| 칼럼 | 타입 | 규칙 |
|------|------|------|
| 코드 | text (unique) | 0 시작 가능, 텍스트 형식 |
| 바코드 | text (unique) | 0 시작 가능, **코드와 절대 중복 불가** |
| 구분 | select | 기획상품/기성상품/정품/미완성상품/피규어/인형/가방파우치/잡화 |
| 품목구분 | select | 원재료/부재료/제품/반제품/상품 |
| 단위 | select | EA, kg, g, box 등 |
| 규격 | text | 예: `12*5*7` |
| 상품원가 | number | 천단위 콤마. **권한에 따라 비노출** |
| 판매가 | number | 천단위 콤마 |
| 부가세 | select | 포함/미포함 |
| 비고 | text | - |
| 최소수량 | number | 바코드 스캔 시 곱해지는 기준 수량 |

#### 6.2.3 거래처등록 (`/master/partners`)

**레이아웃:** RegisterPage 컴포넌트 사용

| 칼럼 | 타입 | 규칙 |
|------|------|------|
| 코드 | text (unique) | 거래처 고유코드 |
| 상호명 | text | 필수 |
| 대표자명 | text | - |
| 사업자등록번호 | text | 숫자 입력 → 자동 대시 (123-45-67890) |
| 업태 | text | - |
| 종목 | text | - |
| 전화 | text | 자동 대시 포맷 |
| 이메일 | text | 세금계산서 발송용 |
| 주소 | text | - |
| 검색 | text | 별도 검색용 키워드 |
| 비고 | text | - |

#### 6.2.4 창고등록 (`/master/warehouses`)

**레이아웃:** RegisterPage 컴포넌트 사용

| 칼럼 | 타입 | 규칙 |
|------|------|------|
| 코드 | text (unique) | 창고 고유코드 |
| 창고명 | text | 필수 |

### 6.3 구매관리

#### 6.3.1 구매입력 (`/purchase/input`)

**레이아웃:** InputModal 컴포넌트 사용

**상단 헤더:**

| 필드 | 타입 | 설명 |
|------|------|------|
| 일자 | DatePicker | 기본값: 오늘 |
| 거래처 | SearchField | 거래처 검색/선택 |
| 담당자 | SearchField | 직원 검색/선택 |
| 입고창고 | SearchField | 창고 검색/선택 → **재고 +** |

**품목 테이블:**

| 칼럼 | 자동입력 | 설명 |
|------|----------|------|
| 품목코드 | - | **원재료/부재료만** 검색 가능 |
| 품목명 | ✅ | 코드 선택 시 자동 |
| 규격 | ✅ | 코드 선택 시 자동 |
| 기본수량 | - | 수동 입력 |
| 단가 | ✅ | 품목의 상품원가 기본값 |
| 공급가액 | ✅ | 수량 × 단가 자동 계산 |
| 부가세 | ✅ | 품목 부가세 설정에 따라 자동 |
| 비고 | - | - |

**하단 버튼:** 저장(F8), 저장/전표(F7), 다시작성, 리스트

#### 6.3.2 구매조회 (`/purchase/list`)

**레이아웃:** ListPage 컴포넌트 사용
- 하단 **"구매입력"** 버튼 → 구매입력 페이지로 이동
- 행 클릭 → 해당 구매 전표 상세

#### 6.3.3 구매현황 (`/purchase/status`)

- 기간별/거래처별/품목별 구매 집계
- 차트 또는 피벗 형태

### 6.4 생산입고

#### 6.4.1 생산입고 입력 (`/production/input`)

**레이아웃:** InputModal 컴포넌트 사용 (탭 전환 확장)

**상단 헤더:**

| 필드 | 타입 | 설명 |
|------|------|------|
| 일자 | DatePicker | 기본값: 오늘 |
| 담당자 | SearchField | 직원 검색/선택 |

**탭 전환:** `[생산]` / `[소모]`

**생산 탭 테이블:**

| 칼럼 | 자동입력 | 설명 |
|------|----------|------|
| 생산품목코드 | - | **완제품(제품/상품)만** 검색 |
| 생산품목명 | ✅ | 자동 |
| 규격 | ✅ | 자동 |
| 소모품창고 | - | 원재료가 빠질 창고 선택 |
| 받는창고 | - | 완제품이 들어갈 창고 선택 |
| 수량 | - | 생산 수량 |
| 비고 | - | - |

**소모 탭 테이블:**

| 칼럼 | 자동입력 | 설명 |
|------|----------|------|
| 생산품목코드 | - | 상위 생산 품목 연결 |
| 생산품목명 | ✅ | 자동 |
| 소모품목코드 | - | 원재료/부재료 검색 |
| 소모품목명 | ✅ | 자동 |
| 수량 | - | 소모 수량 |
| 비고 | - | - |

#### 6.4.2 생산입고조회 (`/production/list`)

**레이아웃:** ListPage 컴포넌트 사용

**조회 칼럼:** 일자-No., 생산된공장명, 받는창고명, 품목명(규격), 수량, 작업지시서, 인쇄
- 하단 **"생산입고"** 버튼 → 생산입고 입력 페이지로 이동

### 6.5 판매관리

#### 6.5.1 판매입력 (`/sales/input`)

**레이아웃:** InputModal 컴포넌트 사용

**상단 헤더:**

| 필드 | 타입 | 설명 |
|------|------|------|
| 일자 | DatePicker | 기본값: 오늘 |
| 거래처 | SearchField | 거래처 검색/선택 |
| 담당자 | SearchField | 직원 검색/선택 |
| 출하창고 | SearchField | 창고 검색/선택 → **재고 -** |
| 거래유형 | Select | 부가세율 적용 방식 |
| 통화 | Select | 내자/외자 |

**품목 테이블:**

| 칼럼 | 자동입력 | 설명 |
|------|----------|------|
| 품목코드 | - | 품목 검색/선택 |
| 품목명 | ✅ | 자동 |
| 규격 | ✅ | 자동 |
| 수량 | - | 수동 입력 |
| 단가 | ✅ | 판매가 기본값 (최근 판매 데이터로 업데이트) |
| 공급가액 | ✅ | 수량 × 단가 |
| 부가세 | ✅ | 자동 계산 |
| 적요 | - | - |

**하단 버튼:** 저장(F8), 저장/전표(F7), 회계전표연결, 다시작성, 현금수금▼, 리스트, 웹자료올리기

#### 6.5.2 판매조회 (`/sales/list`)

**레이아웃:** ListPage 컴포넌트 사용

#### 6.5.3 판매현황 (`/sales/status`)

- 기간별/거래처별/품목별 판매 집계

#### 6.5.4 결제내역조회 (`/sales/payment`)

- 입금/결제 완료 건 조회

### 6.6 링크발주

#### 6.6.1 링크조회 (`/order-link/list`)

**레이아웃:** ListPage 컴포넌트 사용

**표시 칼럼:** 링크URL, 상품명, 포장수량, 발주수량제한, 잔여재고, 상태(활성/품절)

#### 6.6.2 링크생성 (`/order-link/create`)

**레이아웃:** InputModal 컴포넌트 사용

**상단 헤더:**

| 필드 | 타입 | 설명 |
|------|------|------|
| 일자 | DatePicker | 기본값: 오늘 |
| 창고 | SearchField | **필수** — 재고 차감 대상 창고 |
| 담당자 | SearchField | 직원 선택 |

**품목 테이블:**

| 칼럼 | 자동입력 | 설명 |
|------|----------|------|
| 코드 | - | 품목 검색/선택 |
| 상품명 | ✅ | 자동 |
| 규격 | ✅ | 자동 |
| 현재고 | ✅ | 해당 창고의 실시간 재고 |
| 포장수량 | - | 1건 주문 = N개 재고 차감 |
| 발주수량 제한 | - | 1회 최대 발주 가능 수량 |

#### 6.6.3 링크발주 외부 페이지 (`/order/[linkId]`)

> 카카오톡에 공유되는 **독립 페이지** (사이드바 없음)

**화면 구성:**
- 상품명, 규격, 포장수량 표시
- 주문 수량 입력 필드
- 발주수량 제한 안내
- **[발주하기]** 또는 **[발주예약]** 버튼

**재고 연동 로직:**

```
IF 재고 >= 주문수량 × 포장수량:
  → 즉시 발주 완료 → 재고 차감

IF 재고 > 0 AND 재고 < 주문수량 × 포장수량:
  → 팝업: "재고가 {잔여수량}개 밖에 없습니다.
           {가능수량}개 발주, {부족수량}개는 예약됩니다."
  → [확인] → "발주가 완료되었습니다" + 상세 표시

IF 재고 == 0:
  → [발주하기] → [발주예약] 버튼으로 변경
  → 예약 접수만 가능
```

### 6.7 거래명세서 (`/invoice`)

**레이아웃:**

```
┌─────────────────────────────────────────────────┐
│  거래명세서 발행    [검색창]  [Search(F3)]         │
├─────────────────────────────────────────────────┤
│  ▼ 상세검색: 시작일 ~ 종료일 / 거래처 / 상품       │
├─────────────────────────────────────────────────┤
│  □ │ 거래처 │ 발주일 │ 상품명 │ 수량 │ 금액 │ 상태 │
│  ☑ │ A업체  │ 02/10 │ 사과  │ 30  │ ...  │ 신규 │
│  ☑ │ A업체  │ 02/09 │ 배   │ 20  │ ...  │ 미수금│
├─────────────────────────────────────────────────┤
│  [거래명세서 발행]                                 │
└─────────────────────────────────────────────────┘
```

**핵심 로직:**
1. 오늘 발주 건 + 이전 미입금 건(미수금) → 동일 거래처 기준 합산 표시
2. 미입금 건은 **"미수금"** 라벨 표시
3. 체크박스 선택 → 거래처별로 묶어서 **카카오톡 알림톡** 발송
4. (Phase 2) 입금 확인 시 → 자동 세금계산서 발행 (팝빌 API)

### 6.8 회계/재무

#### 6.8.1 계좌조회 (`/accounting/bank`)
- 팝빌 API 연동 → 계좌 잔액/입출금 내역 실시간 조회

#### 6.8.2 정산/결산 관리 (`/accounting/settlement`)
- 월별/기간별 정산 현황

#### 6.8.3 거래처정산 (`/accounting/partner-settlement`)
- 거래처별 매입/매출 정산, 미수금 현황

#### 6.8.4 세무/부가세 (`/accounting/tax`)
- 부가세 신고용 자료 집계
- 전자세금계산서 발행 내역 (팝빌 연동)

### 6.9 시스템설정

#### 6.9.1 권한관리 리스트 (`/system/permissions`)

```
┌─────────────────────────────────────────────────────────┐
│  🔐 사용자 관리          직원들의 업무권한을 설정합니다     │
├─────────────────────────────────────────────────────────┤
│  Q  이름 또는 부서로 검색                                 │
├─────────────────────────────────────────────────────────┤
│ [아바타] 이름 │ 부서 │ 직책 │ 권한상태 │ 접근메뉴 │ [관리] │
│     [S] SH   │ 영업 │ 대표 │  일반   │   -    │ ⚙     │
│     ...                                                 │
└─────────────────────────────────────────────────────────┘
```

#### 6.9.2 업무권한 설정 팝업

- **트리 구조 체크박스**로 메뉴별 접근 권한 설정
- 상위 메뉴 체크 → 하위 전체 체크/해제
- 하위 개별 체크 가능
- **"상품원가" 열람 권한**은 별도 체크박스로 분리
- 권한 없는 메뉴 → 사이드바에서 **비노출**

**권한 키 구조:**

```
dashboard
dashboard.view
master
master.employees
master.items
master.items.cost_price          ← 상품원가 열람 전용
master.partners
master.warehouses
purchase
purchase.input
purchase.view
purchase.status
production
production.input
production.view
sales
sales.input
sales.view
sales.status
sales.payment
order_link
order_link.list
order_link.create
invoice
invoice.issue
accounting
accounting.bank
accounting.settlement
accounting.partner
accounting.tax
system
system.permissions
```

---

## 7. 상태 관리 설계

### 7.1 Zustand Store 구조

#### `auth-store.ts` — 인증 상태

```typescript
interface AuthState {
  user: Employee | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  login: (kakaoToken: string) => Promise<void>;
  logout: () => void;
}
```

#### `sidebar-store.ts` — 사이드바 상태

```typescript
interface SidebarState {
  isCollapsed: boolean;
  openMenuKeys: string[];
  activeKey: string;
  toggle: () => void;
  setOpenMenuKeys: (keys: string[]) => void;
  setActiveKey: (key: string) => void;
}
```

#### `permission-store.ts` — 권한 상태

```typescript
interface PermissionState {
  permissions: Record<string, boolean>;  // { "master.items": true, ... }
  isLoading: boolean;
  hasPermission: (key: string) => boolean;
  loadPermissions: (employeeId: string) => Promise<void>;
  getVisibleMenuItems: () => MenuItem[];
}
```

#### `ui-store.ts` — UI 전역 상태

```typescript
interface UIState {
  // 모달
  activeModal: string | null;
  modalData: any;
  openModal: (name: string, data?: any) => void;
  closeModal: () => void;

  // 토스트
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}
```

### 7.2 React Query (Server State)

Phase 1에서는 Mock 데이터를, Phase 2에서는 Supabase API를 queryFn으로 교체한다.

```typescript
// 쿼리 키 컨벤션
const queryKeys = {
  employees: {
    all: ['employees'] as const,
    list: (params: SearchParams) => ['employees', 'list', params] as const,
    detail: (id: string) => ['employees', 'detail', id] as const,
  },
  items: {
    all: ['items'] as const,
    list: (params: SearchParams) => ['items', 'list', params] as const,
    detail: (id: string) => ['items', 'detail', id] as const,
    byType: (type: string) => ['items', 'type', type] as const,
  },
  // ... 동일 패턴
};
```

---

## 8. API 엔드포인트

> Phase 1에서는 Mock 함수로 구현, Phase 2에서 실제 API Route로 전환

### 8.1 기초등록 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/master/employees` | 직원 목록 조회 |
| GET | `/api/master/employees/:id` | 직원 상세 조회 |
| POST | `/api/master/employees` | 직원 등록 |
| PUT | `/api/master/employees/:id` | 직원 수정 |
| DELETE | `/api/master/employees/:id` | 직원 삭제 |
| GET | `/api/master/items` | 품목 목록 조회 |
| GET | `/api/master/items/:id` | 품목 상세 조회 |
| POST | `/api/master/items` | 품목 등록 |
| PUT | `/api/master/items/:id` | 품목 수정 |
| DELETE | `/api/master/items/:id` | 품목 삭제 |
| GET | `/api/master/partners` | 거래처 목록 |
| POST | `/api/master/partners` | 거래처 등록 |
| PUT | `/api/master/partners/:id` | 거래처 수정 |
| DELETE | `/api/master/partners/:id` | 거래처 삭제 |
| GET | `/api/master/warehouses` | 창고 목록 |
| POST | `/api/master/warehouses` | 창고 등록 |
| PUT | `/api/master/warehouses/:id` | 창고 수정 |
| DELETE | `/api/master/warehouses/:id` | 창고 삭제 |

### 8.2 구매관리 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/purchase` | 구매전표 목록 |
| GET | `/api/purchase/:id` | 구매전표 상세 |
| POST | `/api/purchase` | 구매전표 등록 (+ 재고 증가) |
| PUT | `/api/purchase/:id` | 구매전표 수정 |
| DELETE | `/api/purchase/:id` | 구매전표 삭제 |
| GET | `/api/purchase/status` | 구매현황 집계 |

### 8.3 생산입고 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/production` | 생산전표 목록 |
| GET | `/api/production/:id` | 생산전표 상세 |
| POST | `/api/production` | 생산전표 등록 (+ 완제품 재고 증가, 원재료 재고 감소) |
| PUT | `/api/production/:id` | 생산전표 수정 |
| DELETE | `/api/production/:id` | 생산전표 삭제 |

### 8.4 판매관리 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/sales` | 판매전표 목록 |
| GET | `/api/sales/:id` | 판매전표 상세 |
| POST | `/api/sales` | 판매전표 등록 (+ 재고 감소 + 미수금 생성) |
| PUT | `/api/sales/:id` | 판매전표 수정 |
| DELETE | `/api/sales/:id` | 판매전표 삭제 |
| GET | `/api/sales/status` | 판매현황 집계 |
| GET | `/api/sales/payment` | 결제내역 조회 |

### 8.5 링크발주 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/order-link` | 링크 목록 |
| POST | `/api/order-link` | 링크 생성 |
| GET | `/api/order-link/:linkCode` | 링크 상세 (외부용) |
| POST | `/api/order-link/:linkCode/order` | 발주 접수 (재고 차감) |

### 8.6 거래명세서 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/invoice` | 거래명세서 목록 |
| POST | `/api/invoice` | 거래명세서 발행 |
| POST | `/api/invoice/:id/send` | 알림톡 발송 |
| GET | `/api/invoice/pending` | 발행 대상 조회 (미수금 포함) |

### 8.7 회계/재무 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/accounting/bank` | 계좌 조회 (팝빌) |
| GET | `/api/accounting/settlement` | 정산/결산 데이터 |
| GET | `/api/accounting/partner-settlement` | 거래처 정산 |
| GET | `/api/accounting/tax` | 세무/부가세 데이터 |

### 8.8 재고 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/inventory` | 재고 현황 |
| GET | `/api/inventory/:itemId/:warehouseId` | 특정 품목-창고 재고 |

### 8.9 권한 API

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/system/permissions/:employeeId` | 직원 권한 조회 |
| PUT | `/api/system/permissions/:employeeId` | 직원 권한 수정 |

---

## 9. 권한 체계

### 9.1 권한 매트릭스

| 권한 키 | 대표 | 관리자 | 일반 |
|---------|------|--------|------|
| `dashboard` | ✅ | ✅ | ✅ |
| `master.employees` | ✅ | ✅ | ❌ |
| `master.items` | ✅ | ✅ | 개별설정 |
| `master.items.cost_price` | ✅ | 개별설정 | ❌ |
| `master.partners` | ✅ | ✅ | 개별설정 |
| `master.warehouses` | ✅ | ✅ | ❌ |
| `purchase.*` | ✅ | ✅ | 개별설정 |
| `production.*` | ✅ | ✅ | 개별설정 |
| `sales.*` | ✅ | ✅ | 개별설정 |
| `order_link.*` | ✅ | ✅ | 개별설정 |
| `invoice.*` | ✅ | ✅ | ❌ |
| `accounting.*` | ✅ | 개별설정 | ❌ |
| `system.*` | ✅ | ❌ | ❌ |

### 9.2 권한 적용 방식

1. **사이드바 필터링:** 권한 없는 메뉴는 렌더링하지 않음
2. **페이지 가드:** 권한 없이 URL 직접 접근 시 `/` (대시보드)로 리다이렉트
3. **컴포넌트 레벨:** `hasPermission()` 함수로 특정 UI 요소 조건부 렌더링
4. **API 레벨 (Phase 2):** Supabase RLS + Edge Function 미들웨어로 서버 사이드 검증

---

## 10. 에러 핸들링

### 10.1 에러 유형별 처리

| 에러 유형 | 처리 방식 | UI 표시 |
|-----------|-----------|---------|
| **네트워크 오류** | React Query retry (3회) | Toast: "네트워크 연결을 확인해주세요" |
| **인증 만료** | Token refresh → 실패 시 로그인 페이지 | Toast + 리다이렉트 |
| **권한 없음** | 대시보드 리다이렉트 | Toast: "접근 권한이 없습니다" |
| **유효성 검증 실패** | 폼 필드 인라인 에러 | 필드 하단 빨간 텍스트 |
| **중복 코드** | 저장 시 에러 반환 | Toast: "이미 존재하는 코드입니다" |
| **재고 부족** | 판매/출고 시 경고 | 확인 팝업: "재고가 부족합니다" |
| **바코드 미매칭** | 스캔 시 경고음 | Toast: "등록되지 않은 바코드입니다" |
| **서버 오류 (500)** | 에러 로그 + 재시도 안내 | Toast: "일시적 오류가 발생했습니다" |

### 10.2 폼 유효성 검증 (Zod)

```typescript
// 예시: 품목 등록 스키마
const itemSchema = z.object({
  code: z.string().min(1, "코드를 입력해주세요"),
  barcode: z.string().optional(),
  category: z.string().min(1, "구분을 선택해주세요"),
  item_type: z.string().min(1, "품목구분을 선택해주세요"),
  unit: z.string().default("EA"),
  spec: z.string().optional(),
  cost_price: z.number().min(0).default(0),
  selling_price: z.number().min(0).default(0),
  vat_type: z.enum(["included", "excluded"]).default("excluded"),
  memo: z.string().optional(),
  min_quantity: z.number().min(1).default(1),
});
```

---

## 11. 개발 페이즈 계획

### Phase 1 — Frontend UI 완성 (Mock 데이터)

#### Phase 1-A: 프로젝트 초기 설정 + 공통 컴포넌트

| # | 태스크 | 설명 |
|---|--------|------|
| 1 | 프로젝트 초기화 | Next.js 14, TypeScript, Tailwind CSS, Shadcn/UI 셋업 |
| 2 | 디렉토리 구조 생성 | 전체 폴더 구조 세팅 |
| 3 | 타입 정의 | 모든 엔티티 TypeScript 타입 작성 |
| 4 | 유틸리티 함수 | 숫자 콤마, 전화번호 포맷, 사업자번호 포맷, 날짜 유틸 |
| 5 | Mock 데이터 | 모든 엔티티의 샘플 데이터 생성 |
| 6 | 공통 컴포넌트 | ListPage, InputModal, RegisterPage, SearchPanel, DataTable, Pagination |
| 7 | 검색 팝업 | ItemSearchPopup, PartnerSearchPopup, EmployeeSearchPopup, WarehouseSearchPopup |
| 8 | 레이아웃 | 사이드바 + 헤더 + 페이지 래퍼 |
| 9 | Zustand 스토어 | auth, sidebar, permission, ui 스토어 |

#### Phase 1-B: 기초등록 페이지

| # | 태스크 | 설명 |
|---|--------|------|
| 10 | 직원등록 | RegisterPage 기반 CRUD |
| 11 | 품목등록 | RegisterPage 기반 CRUD + 원가 권한 제어 |
| 12 | 거래처등록 | RegisterPage 기반 CRUD + 사업자번호 포맷 |
| 13 | 창고등록 | RegisterPage 기반 CRUD |

#### Phase 1-C: 구매관리 + 생산입고

| # | 태스크 | 설명 |
|---|--------|------|
| 14 | 구매입력 | InputModal 기반 (원재료/부재료 필터) |
| 15 | 구매조회 | ListPage 기반 |
| 16 | 구매현황 | 집계/차트 페이지 |
| 17 | 생산입고 입력 | InputModal 기반 + 탭 전환 (생산/소모) |
| 18 | 생산입고조회 | ListPage 기반 |

#### Phase 1-D: 판매관리

| # | 태스크 | 설명 |
|---|--------|------|
| 19 | 판매입력 | InputModal 기반 (전체 품목) |
| 20 | 판매조회 | ListPage 기반 |
| 21 | 판매현황 | 집계/차트 페이지 |
| 22 | 결제내역조회 | ListPage 기반 |

#### Phase 1-E: 링크발주 + 거래명세서

| # | 태스크 | 설명 |
|---|--------|------|
| 23 | 링크조회 | ListPage 기반 |
| 24 | 링크생성 | InputModal 기반 |
| 25 | 링크발주 외부 페이지 | Standalone 레이아웃 + 재고 로직 |
| 26 | 거래명세서 발행 | 미수금 합산 + 체크박스 선택 발행 |

#### Phase 1-F: 시스템설정 + 대시보드

| # | 태스크 | 설명 |
|---|--------|------|
| 27 | 권한관리 리스트 | 직원 리스트 + 검색 |
| 28 | 업무권한 설정 팝업 | 트리 구조 체크박스 |
| 29 | 대시보드 | 미수금 경고 위젯 + 오늘 발주 현황 위젯 |

---

### Phase 1.5 — 반자동 정산 로직

| # | 태스크 | 설명 |
|---|--------|------|
| 30 | 재고 계산 로직 | 구매 +, 판매 -, 바코드 입고 +, 생산 +/- |
| 31 | 미수금 계산 | 판매 발생 시 미수금 자동 생성, 상태 관리 |
| 32 | 거래명세서 합산 | 미입금 건 누적, 거래처별 그룹핑 |
| 33 | 미수금 알림 로직 | 경과일 기반 상태 전환 (정상→경고→주의→블랙) |

---

### Phase 2 — Backend 연동

| # | 태스크 | 설명 |
|---|--------|------|
| 34 | Supabase 프로젝트 세팅 | DB 스키마 마이그레이션 + RLS 정책 |
| 35 | 카카오 OAuth 로그인 | Supabase Auth + 카카오 provider |
| 36 | API Route 구현 | Mock → 실제 Supabase 쿼리 교체 |
| 37 | 팝빌 API 연동 | 알림톡, 세금계산서, 계좌조회 |
| 38 | 바코드 스캐너 | Global Key Listener 실장 |
| 39 | Web Bluetooth | 라벨 프린터 연동 |
| 40 | 스윗트래커 | 택배 추적 연동 |

---

## 글로벌 데이터 포맷 규칙

> 모든 페이지에 공통 적용. `src/lib/utils/format.ts`에 유틸 함수로 구현.

| 규칙 | 설명 | 예시 |
|------|------|------|
| **숫자 콤마** | 천 단위 콤마 자동 (모든 숫자 필드) | `1,000` / `3,240` / `1,500,000` |
| **코드/바코드** | 반드시 **String** 형식. 0시작 보존. Unique. | `"0012345"` |
| **사업자번호** | 숫자 입력 → 자동 대시 | `1234567890` → `123-45-67890` |
| **전화번호** | 숫자 입력 → 자동 대시 | `01012345678` → `010-1234-5678` |
| | | `0222227777` → `02-2222-7777` |
| | | `0313337777` → `031-333-7777` |

---

## 바코드 입고 시스템

### Global Key Listener 방식

바코드 스캐너는 키보드 입력으로 인식 → 입고 페이지에서 글로벌 키 리스너가 감지

### 입고 프로세스

```
[입고 페이지 진입]
    ↓
[입고등록 버튼 클릭] → 입고 등록 팝업 열림
    ↓
[바코드 스캐너로 스캔]
    ↓
[시스템이 바코드 인식] → DB 조회 → 품목 정보 자동 입력
    ↓
[테이블에 행 추가/업데이트]
    ├─ 바코드수량: 스캔 횟수 (1씩 증가)
    ├─ 제품수량: 바코드수량 × 최소수량 (자동)
    └─ 동일 바코드 재스캔 → 기존 행의 바코드수량 +1
    ↓
[저장] → 해당 창고 재고에 제품수량 추가
```

### 입고 등록 팝업 테이블

| 칼럼 | 자동입력 | 설명 |
|------|----------|------|
| 바코드 | ✅ | 스캔된 바코드 번호 |
| 품목코드 | ✅ | 바코드 매칭 자동 |
| 품목명 | ✅ | 자동 |
| 규격 | ✅ | 자동 |
| 바코드수량 | ✅ | 스캔 횟수 |
| 최소수량 | ✅ | 품목등록 값 |
| 제품수량 | ✅ | 바코드수량 × 최소수량 |
| 창고 | - | 입고할 창고 선택 |

---

## 컴포넌트 트리 구조

```
App
├── AuthProvider
│   └── PermissionProvider
│       ├── (auth) Layout
│       │   └── LoginPage
│       ├── (dashboard) Layout
│       │   ├── Sidebar
│       │   │   ├── SidebarMenu
│       │   │   └── SidebarMenuItem (재귀)
│       │   ├── Header
│       │   └── PageWrapper
│       │       ├── DashboardPage
│       │       │   ├── ReceivablesWidget
│       │       │   └── TodayOrdersWidget
│       │       ├── Master Pages
│       │       │   ├── EmployeesPage (RegisterPage)
│       │       │   ├── ItemsPage (RegisterPage)
│       │       │   ├── PartnersPage (RegisterPage)
│       │       │   └── WarehousesPage (RegisterPage)
│       │       ├── Purchase Pages
│       │       │   ├── PurchaseInputPage (InputModal)
│       │       │   ├── PurchaseListPage (ListPage)
│       │       │   └── PurchaseStatusPage
│       │       ├── Production Pages
│       │       │   ├── ProductionInputPage (InputModal + Tabs)
│       │       │   └── ProductionListPage (ListPage)
│       │       ├── Sales Pages
│       │       │   ├── SalesInputPage (InputModal)
│       │       │   ├── SalesListPage (ListPage)
│       │       │   ├── SalesStatusPage
│       │       │   └── PaymentListPage (ListPage)
│       │       ├── OrderLink Pages
│       │       │   ├── OrderLinkListPage (ListPage)
│       │       │   └── OrderLinkCreatePage (InputModal)
│       │       ├── InvoicePage
│       │       ├── Accounting Pages
│       │       │   ├── BankPage
│       │       │   ├── SettlementPage
│       │       │   ├── PartnerSettlementPage
│       │       │   └── TaxPage
│       │       └── System Pages
│       │           └── PermissionsPage
│       │               └── PermissionSettingPopup
│       └── (standalone) Layout
│           └── OrderPage (/order/[linkId])
├── Shared Components
│   ├── ListPage
│   ├── InputModal
│   ├── RegisterPage
│   ├── SearchPanel
│   ├── DataTable
│   ├── Pagination
│   ├── TabFilter
│   ├── ItemSearchPopup
│   ├── PartnerSearchPopup
│   ├── EmployeeSearchPopup
│   └── WarehouseSearchPopup
└── UI Components (Shadcn)
    ├── Button, Input, Select, Checkbox
    ├── Dialog, Popover, Tooltip
    ├── Calendar, DatePicker
    ├── Table, Tabs
    └── Toast, Badge, Avatar
```

---

*이 PRD는 WK ERP 시스템 개발의 전체 명세서입니다. 개발 진행 시 이 문서를 기준으로 구현합니다.*
# 🏭 ERP 시스템 PRD 작성을 위한 메타프롬프트

> **목적:** 이 문서는 Claude Code에서 PRD(Product Requirements Document)를 작성하기 위한 메타프롬프트입니다.
> 아래 내용을 기반으로 체계적인 PRD를 생성해주세요.

---

## 1. 프로젝트 개요

### 1.1 프로젝트 목표

해외 소싱 상품의 **입고 → 재고관리 → 주문처리 → 출고 → 정산**을 통합 관리하는 ERP 시스템을 구축한다.
이카운트(eCount) ERP의 UX를 벤치마킹하되, 자체 비즈니스 로직(링크 발주, 거래명세서 자동발행, 미수금 관리)을 추가한다.

### 1.2 핵심 특징

- **멀티 테넌트(Multi-Tenancy):** 본사(Master)와 판매 조직(Branch) 간 데이터 분리 및 통합 관제
- **바코드 기반 입고:** Global Key Listener 방식의 바코드 스캐너 + 최소수량 자동 곱셈
- **링크 발주 시스템:** 카톡/단톡방에 공유하는 주문 링크 → 재고 자동 차감
- **거래명세서 자동 발행:** 미입금 건 누적 합산 + 카카오톡 알림톡 발송
- **미수금 자동 관리:** 블랙리스트 자동 전환 + 대시보드 경고

### 1.3 개발 전략

```
Phase 1: Frontend First (UI/UX 완성)
Phase 1.5: 반자동 정산 로직
Phase 2: Backend/DB 연동 + 외부 API 통합
```

---

## 2. 기술 스택

| 구분 | 기술 |
|------|------|
| **Frontend** | Next.js 14+ (App Router), Tailwind CSS, Shadcn/UI |
| **상태관리** | Zustand (Client Global State), React Query (Server State & Caching) |
| **오프라인** | TanStack Query Persist + LocalStorage |
| **하드웨어** | Web Bluetooth API (라벨 프린터 연동) |
| **Backend** | Supabase Edge Functions (+ NestJS 또는 FastAPI 확장 가능) |
| **Database** | Supabase (PostgreSQL) — RLS(Row Level Security) 필수 적용 |
| **인증** | 카카오 로그인 (Kakao OAuth 2.0) |

### 2.1 외부 API 연동

| 서비스 | 용도 |
|--------|------|
| **팝빌 (Popbill)** | 계좌조회(입금감지), 예금주조회, 카카오톡 알림톡, SMS/LMS, 전자세금계산서, 현금영수증, 사업자등록상태조회 |
| **스윗트래커 (SweetTracker)** | 택배 배송 추적 |
| **공급처 ERP (China)** | ⏳ PENDING — API 연동 예정 |

---

## 3. 사이드바 메뉴 구조

```
📊 대시보드
│
├── 📋 기초등록 (기본페이지: 품목등록)
│   ├── 직원등록
│   ├── 품목등록
│   ├── 거래처등록
│   └── 창고등록
│
├── 🛒 구매관리 (기본페이지: 구매조회)
│   ├── 구매입력
│   ├── 구매조회
│   └── 구매현황
│
├── �icing 생산입고 (기본페이지: 생산입고조회)
│   ├── 생산입고
│   └── 생산조회
│
├── 💰 판매관리 (기본페이지: 판매조회)
│   ├── 판매입력
│   ├── 판매조회
│   ├── 판매현황
│   └── 결제내역조회
│
├── 🔗 링크발주
│   ├── 링크조회
│   └── 링크생성
│
├── 📄 거래명세서
│   └── 거래명세서 발행
│
├── 💵 회계/재무
│   ├── 계좌조회
│   ├── 정산/결산 관리
│   ├── 거래처정산
│   └── 세무/부가세
│
└── ⚙️ 시스템설정
    └── 권한관리
```

---

## 4. 공통 UI 패턴 (컴포넌트화 필수)

> 모든 페이지가 동일한 패턴을 공유하므로 반드시 재사용 가능한 컴포넌트로 분리한다.

### 4.1 조회 페이지 공통 레이아웃 (ListPage 컴포넌트)

기초등록, 구매조회, 생산입고조회, 판매조회 등 **조회 성격의 모든 페이지**에 동일 적용한다.

```
┌─────────────────────────────────────────────────┐
│  [페이지 제목]     [검색입력창]  [Search(F3)] [Option]│
├─────────────────────────────────────────────────┤
│  ▼ Search 버튼 클릭 시 아래로 펼쳐지는 상세검색 영역   │
│  ┌─────────────────────────────────────────────┐│
│  │ 시작일자 [____] ~ 종료일자 [____]            ││
│  │ 거래처 [____]  담당자 [____]  창고 [____]    ││
│  │ (페이지별 해당 칼럼 기준 검색 필드 동적 생성)  ││
│  └─────────────────────────────────────────────┘│
├─────────────────────────────────────────────────┤
│  [전체] [결재중] [미확인] [확인]  ← 탭 필터        │
│  [1] 2 3 4 5 6 >  |  /6           ← 페이지네이션 │
├─────────────────────────────────────────────────┤
│  □  │ 칼럼1 │ 칼럼2 │ 칼럼3 │ ... │             │
│  □  │  ...  │  ...  │  ...  │ ... │             │
│  □  │  ...  │  ...  │  ...  │ ... │             │
│     (한 페이지당 20건)                            │
├─────────────────────────────────────────────────┤
│  [신규등록/입력 버튼]  [Email] [인쇄] [Excel] ...  │
└─────────────────────────────────────────────────┘
```

**동작 규칙:**
- 한 페이지당 **20건** 표시, 페이지네이션으로 구분
- 상단 검색창: 칼럼 내용으로 통합 검색 가능 (등록된 모든 칼럼 데이터 대상)
- Search 버튼 클릭 → 상세검색 영역이 아래로 **펼침/접힘** 토글
- 기본 필터는 **"전체"**
- 하단 **신규 버튼** 클릭 → 해당 모듈의 **입력 팝업** 호출

### 4.2 입력 팝업 공통 레이아웃 (InputModal 컴포넌트)

구매입력, 판매입력, 생산입고 등 **입력 성격의 모든 페이지**에 동일 적용한다.

```
┌─────────────────────────────────────────────────┐
│  [담당자탭 ▼]  [+]                               │
├─────────────────────────────────────────────────┤
│  일자   [2026 / 02 / 10 📅]    거래처 [🔍____]   │
│  담당자 [🔍____]              출하창고 [🔍____]   │
│  (페이지별 상단 필드 동적 구성)                     │
├─────────────────────────────────────────────────┤
│  [찾기(F3)] [정렬] [바코드] [재고불러오기] ...      │
├─────────────────────────────────────────────────┤
│  □ │⬇│품목코드│품목명│규격│수량│단가│공급가액│부가세│적요│
│  1 │⬇│       │     │   │   │   │      │     │   │
│  2 │⬇│       │     │   │   │   │      │     │   │
│  3 │⬇│       │     │   │   │   │      │     │   │
│    │ │       │     │   │ 0 │   │    0  │  0  │   │
├─────────────────────────────────────────────────┤
│  ◀ [저장(F8)▼] [저장/전표(F7)] [다시작성] [리스트] │
└─────────────────────────────────────────────────┘
```

**동작 규칙:**
- **품목코드 또는 품목명 클릭** → 품목 검색 팝업 → 선택 시 **규격, 단가 자동 입력**
- **수량 입력** → 단가 × 수량 = 공급가액 **자동 계산**
- **부가세** → 품목등록의 부가세 설정(포함/미포함)에 따라 **자동 분리 계산**
- 행 추가는 무제한, 아래로 자동 확장

### 4.3 기초등록 페이지 공통 레이아웃 (RegisterPage 컴포넌트)

직원등록, 품목등록, 거래처등록, 창고등록에 동일 적용한다.

```
┌─────────────────────────────────────────────────┐
│  [페이지 제목]     [검색입력창]  [Search]          │
├─────────────────────────────────────────────────┤
│  □ │ 칼럼1 │ 칼럼2 │ 칼럼3 │ ... │              │
│  □ │  ...  │  ...  │  ...  │ ... │              │
│     (리스트 형식, 한 페이지당 20건)                │
├─────────────────────────────────────────────────┤
│  [신규] [삭제] [Excel]                            │
└─────────────────────────────────────────────────┘
```

**동작 규칙:**
- 리스트 행 클릭 → 해당 데이터 **수정 모드** 진입 (인라인 또는 팝업)
- 하단 **신규 버튼** → 빈 행 추가 또는 등록 팝업
- 검색창에서 해당 페이지의 **모든 칼럼 내용으로 검색** 가능

---

## 5. 글로벌 데이터 포맷 규칙

> 모든 페이지에 공통 적용되는 데이터 처리 규칙이다. 유틸 함수로 분리하여 일관성을 보장한다.

| 규칙 | 설명 | 예시 |
|------|------|------|
| **숫자 콤마** | 천 단위 콤마 자동 적용 (상품원가, 판매가, 수량, 금액 등 모든 숫자 필드) | `1,000` / `3,240` / `1,500,000` |
| **코드/바코드** | 반드시 **텍스트(String)** 형식 저장. 0으로 시작하는 값 보존. 유니크 키 (중복 불가) | `"0012345"` |
| **사업자번호** | 숫자만 입력해도 **자동 대시** 생성 | `1234567890` → `123-45-67890` |
| **전화번호** | 숫자만 입력해도 **자동 대시** 생성. 다양한 형식 지원 | `15770000` → `1577-0000` |
| | | `020000000` → `02-000-0000` |
| | | `0222227777` → `02-2222-7777` |
| | | `0313337777` → `031-333-7777` |
| | | `03133337777` → `031-3333-7777` |

---

## 6. 페이지별 상세 명세

---

### 6.1 기초등록

#### 6.1.1 직원등록

| 칼럼명 | 타입 | 설명 |
|--------|------|------|
| 코드 | text (unique) | 직원 고유코드 |
| 이름 | text | 직원 이름 |
| 직책 | select | 대표, 팀장, 사원 등 |
| 직급 | select | 일반, 관리자 등 |
| 연락처 | text | 전화번호 자동 포맷 적용 |
| 주소 | text | 주소 |
| 카톡로그인 | text | 카카오 OAuth 연동 계정 |

#### 6.1.2 품목등록

| 칼럼명 | 타입 | 설명 |
|--------|------|------|
| 코드 | text (unique) | 품목 고유코드. 텍스트 형식, 0시작 가능 |
| 바코드 | text (unique) | 바코드 번호. 텍스트 형식, 0시작 가능. **코드와 절대 중복 불가** |
| 구분 | select | 기획상품 / 기성상품 / 정품 / 미완성상품 / 피규어 / 인형 / 가방파우치 / 잡화 |
| 품목구분 | select | 원재료 / 부재료 / 제품 / 반제품 / 상품 |
| 단위 | select | EA, kg, g, box 등 |
| 규격 | text | 상품 사이즈 등 (예: `12*5*7`) |
| 상품원가 | number | **천단위 콤마 적용. 권한설정에 따라 직원에게 비노출** |
| 판매가 | number | 천단위 콤마 적용. 기본값 설정 후, 판매입력 시 최근 데이터로 자동 업데이트 |
| 부가세 | select | 포함 / 미포함 |
| 비고 | text | 자유 입력 |
| 최소수량 | number | **바코드 스캔 시 곱해지는 기준 수량** (예: 10 입력 시, 바코드 1회 스캔 = 재고 10개 입고) |

#### 6.1.3 거래처등록

| 칼럼명 | 타입 | 설명 |
|--------|------|------|
| 코드 | text (unique) | 거래처 고유코드 |
| 상호명 | text | 거래처 상호 |
| 대표자명 | text | 대표자 이름 |
| 사업자등록번호 | text | **숫자 입력 → 자동 대시 포맷** (123-45-67890) |
| 업태 | text | 업태 |
| 종목 | text | 종목 |
| 전화 | text | **자동 대시 포맷** 적용 |
| 이메일 | text | 세금계산서 발송용 이메일 |
| 주소 | text | 거래처 주소 |
| 검색 | text | 별도 검색용 키워드 (조회 페이지에서 이 내용으로도 검색 가능) |
| 비고 | text | 자유 입력 |

#### 6.1.4 창고등록

| 칼럼명 | 타입 | 설명 |
|--------|------|------|
| 코드 | text (unique) | 창고 고유코드 |
| 창고명 | text | 창고 이름 |

> 📌 생산입고에서 소모품 창고, 완제품 창고 등 선택 시 이 창고 목록과 API 연결됨

---

### 6.2 구매관리

#### 6.2.1 구매입력 (팝업)

**상단 헤더 필드:**

| 필드 | 설명 |
|------|------|
| 일자 | 날짜 선택 (기본값: 오늘) |
| 거래처 | 🔍 거래처 검색/선택 |
| 담당자 | 🔍 직원 검색/선택 |
| 입고창고 | 🔍 창고 검색/선택 → **이 창고에 재고 +** |

**하단 품목 테이블:**

| 칼럼 | 자동입력 | 설명 |
|------|----------|------|
| 품목코드 | - | 클릭 시 **원재료/부재료 품목만** 검색 가능 |
| 품목명 | ✅ | 품목코드 선택 시 자동 |
| 규격 | ✅ | 품목코드 선택 시 자동 |
| 기본수량 | - | 수동 입력 |
| 단가 | ✅ | 품목등록의 상품원가 기본값 |
| 공급가액 | ✅ | 수량 × 단가 자동 계산 |
| 부가세 | ✅ | 품목의 부가세 설정에 따라 자동 분리 |
| 비고 | - | 자유 입력 |

**하단 버튼:** `저장(F8)` / `저장/전표(F7)` / `다시작성` / `리스트`

#### 6.2.2 구매조회

- **공통 조회 페이지 레이아웃** 적용 (섹션 4.1 참고)
- 하단 **"구매입력"** 버튼 → 구매입력 팝업 호출
- 리스트 행 클릭 → 해당 구매 전표 상세 보기

#### 6.2.3 구매현황

- 기간별/거래처별/품목별 구매 집계 현황
- 차트 또는 피벗 형태 요약

---

### 6.3 생산입고

#### 6.3.1 생산입고 입력 (팝업)

**상단 헤더 필드:**

| 필드 | 설명 |
|------|------|
| 일자 | 날짜 선택 (기본값: 오늘) |
| 담당자 | 🔍 직원 검색/선택 |

**탭 전환: `[생산]` / `[소모]`**

**생산 탭 테이블:**

| 칼럼 | 자동입력 | 설명 |
|------|----------|------|
| 생산품목코드 | - | 클릭 시 **완제품(제품/상품)만** 검색 가능 |
| 생산품목명 | ✅ | 코드 선택 시 자동 |
| 규격 | ✅ | 코드 선택 시 자동 |
| 소모품창고 | - | 🔍 원재료가 빠질 창고 선택 |
| 받는창고 | - | 🔍 완제품이 들어갈 창고 선택 |
| 수량 | - | 생산 수량 입력 |
| 비고 | - | 자유 입력 |

**소모 탭 테이블:**

| 칼럼 | 자동입력 | 설명 |
|------|----------|------|
| 생산품목코드 | - | 상위 생산 품목 연결 |
| 생산품목명 | ✅ | 자동 |
| 소모품목코드 | - | 클릭 시 원재료/부재료 검색 |
| 소모품목명 | ✅ | 자동 |
| 수량 | - | 소모 수량 |
| 비고 | - | 자유 입력 |

**하단 버튼:** `저장(F8)` / `저장/전표(F7)` / `다시작성` / `리스트`

#### 6.3.2 생산입고조회

- **공통 조회 페이지 레이아웃** 적용 (섹션 4.1 참고)
- 조회 칼럼: 일자-No. / 생산된공장명 / 받는창고명 / 품목명(규격) / 수량 / 작업지시서 / 인쇄
- 하단 **"생산입고"** 버튼 → 생산입고 입력 팝업 호출

---

### 6.4 판매관리

#### 6.4.1 판매입력 (팝업)

**상단 헤더 필드:**

| 필드 | 설명 |
|------|------|
| 일자 | 날짜 선택 (기본값: 오늘) |
| 거래처 | 🔍 거래처 검색/선택 |
| 담당자 | 🔍 직원 검색/선택 |
| 출하창고 | 🔍 창고 검색/선택 → **이 창고에서 재고 -** |
| 거래유형 | 부가세율 적용 방식 선택 |
| 통화 | 내자 / 외자 |

**하단 품목 테이블:**

| 칼럼 | 자동입력 | 설명 |
|------|----------|------|
| 품목코드 | - | 품목 검색/선택 |
| 품목명 | ✅ | 자동 |
| 규격 | ✅ | 자동 |
| 수량 | - | 수동 입력 |
| 단가 | ✅ | 품목등록의 판매가 기본값 (최근 판매 데이터로 자동 업데이트) |
| 공급가액 | ✅ | 수량 × 단가 |
| 부가세 | ✅ | 자동 계산 |
| 적요 | - | 자유 입력 |

**하단 버튼:** `저장(F8)` / `저장/전표(F7)` / `회계전표연결` / `다시작성` / `현금수금▼` / `리스트` / `웹자료올리기`

#### 6.4.2 판매조회

- **공통 조회 페이지 레이아웃** 적용
- 하단 **"판매입력"** 버튼 → 판매입력 팝업 호출

#### 6.4.3 판매현황

- 기간별/거래처별/품목별 판매 집계 현황

#### 6.4.4 결제내역조회

- 입금/결제 완료된 건 조회

---

### 6.5 링크발주 (커스텀 기능)

> 카카오톡 단톡방/채팅방에 공유할 수 있는 **발주 링크**를 생성하고, 링크를 통해 들어온 주문을 관리하는 기능이다.

#### 6.5.1 링크조회

- **공통 조회 페이지 레이아웃** 적용
- 생성된 링크 목록 표시: 링크URL, 상품명, 포장수량, 발주수량제한, 잔여재고, 상태(활성/품절)
- 하단 **"링크생성"** 버튼

#### 6.5.2 링크생성 (팝업)

**상단 헤더 필드:**

| 필드 | 설명 |
|------|------|
| 일자 | 날짜 (기본값: 오늘) |
| 창고 | 🔍 **필수 입력** — 이 링크의 발주가 이 창고 재고에서 차감됨 |
| 담당자 | 🔍 직원 선택 |

**하단 품목 설정:**

| 칼럼 | 자동입력 | 설명 |
|------|----------|------|
| 코드 | - | 품목 검색/선택 |
| 상품명 | ✅ | 자동 |
| 규격 | ✅ | 자동 |
| 현재고 | ✅ | 해당 창고의 실시간 재고 자동 표시 |
| 포장수량 | - | **이 링크에서 1건 주문 시 차감될 재고 수량** (예: 10 → 1건 주문 = 재고 10개 차감) |
| 발주수량 제한 | - | 1회 최대 발주 가능 수량 (예: 20 → 링크에서 최대 20개까지만 주문 가능) |

#### 6.5.3 링크 페이지 (외부 공개용 — 별도 URL)

> 카카오톡에 공유되는 페이지. **1개 링크 = 1개 제품 × 1개 포장수량** (1:N 관계)

**화면 구성:**
- 상품명, 규격, 포장수량 표시
- 주문 수량 입력 필드
- 발주수량 제한 표시 (예: "최대 20개까지 주문 가능")
- **[발주하기]** 버튼 또는 **[발주예약]** 버튼

**재고 연동 로직:**

```
IF 재고 >= 주문수량 × 포장수량:
  → 즉시 발주 완료 → 재고 차감

IF 재고 > 0 AND 재고 < 주문수량 × 포장수량:
  → 팝업: "재고가 {잔여수량}개 밖에 없습니다.
           {가능수량}개 발주, {부족수량}개는 예약됩니다."
  → [확인] 클릭 → "발주가 완료되었습니다" + 상세 내용 표시

IF 재고 == 0:
  → [발주하기] 버튼 → [발주예약] 버튼으로 변경
  → 예약 접수만 가능
```

---

### 6.6 거래명세서 발행

#### 6.6.1 거래명세서 발행 페이지

**레이아웃:**

```
┌─────────────────────────────────────────────────┐
│  거래명세서 발행    [검색창]  [Search(F3)]         │
├─────────────────────────────────────────────────┤
│  ▼ Search 클릭 시 펼침                           │
│  시작일 ~ 종료일 / 거래처 / 상품 검색 필드         │
│  (검색 실행 → 접히면서 아래 리스트 표시)            │
├─────────────────────────────────────────────────┤
│  □ │ 거래처 │ 발주일 │ 상품명 │ 수량 │ 금액 │ 상태 │
│  ☑ │ A업체  │ 02/10 │ 사과  │ 30  │ ...  │ 신규 │
│  ☑ │ A업체  │ 02/09 │ 배   │ 20  │ ...  │ 미수금│ ← 어제 미입금건
│  ☑ │ B업체  │ 02/10 │ 감   │ 50  │ ...  │ 신규 │
├─────────────────────────────────────────────────┤
│  [거래명세서 발행]                                 │
└─────────────────────────────────────────────────┘
```

**핵심 로직:**

1. 오늘 발주된 건 + **이전 미입금 건(미수금)** 이 동일 거래처 기준으로 **합산** 표시
2. 이전 미입금 건은 **"미수금"** 라벨 표시
3. 체크박스 선택 → **[거래명세서 발행]** 클릭 → 거래처별로 묶어서 **카카오톡 알림톡** 발송
4. **(2차 개발)** 입금 확인 시 → 자동 세금계산서 발행 (팝빌 API)

---

### 6.7 회계/재무

#### 6.7.1 계좌조회
- 팝빌 API 연동 — 계좌 잔액/입출금 내역 실시간 조회

#### 6.7.2 정산/결산 관리
- 월별/기간별 정산 현황

#### 6.7.3 거래처정산
- 거래처별 매입/매출 정산, 미수금 현황

#### 6.7.4 세무/부가세
- 부가세 신고용 자료 집계
- 전자세금계산서 발행 내역 관리 (팝빌 연동)

---

### 6.8 시스템설정 — 권한관리

#### 6.8.1 권한관리 리스트 페이지

```
┌─────────────────────────────────────────────────┐
│  🔐 사용자 관리          직원들의 업무권한을 설정합니다│
├─────────────────────────────────────────────────┤
│  Q  이름 또는 부서로 검색                          │
├─────────────────────────────────────────────────┤
│ [이름아바타] 이름 │ 부서 │ 직책 │ 권한상태 │ 접근메뉴 │ [업무권한] │
│     [S] SH      │ 영업 │ 대표 │  일반   │   -    │ ⚙ 업무권한 │
│     [구] 구민수  │ 영업 │ 팀장 │  일반   │   -    │ ⚙ 업무권한 │
│     ...                                         │
└─────────────────────────────────────────────────┘
```

#### 6.8.2 업무권한 설정 팝업

직원 행의 **"업무권한"** 버튼 클릭 시 팝업 표시:

```
┌─────────────────────────────────────────────┐
│  🔐 업무권한 설정                        [X] │
│  설정대상: SH                                │
├─────────────────────────────────────────────┤
│  ▼ □ 대시보드  dashboard                     │
│       □ 조회  dashboard.view                 │
│                                              │
│  ▼ □ 기초등록  master                        │
│     > □ 직원등록  master.employees            │
│     > □ 품목등록  master.items                │
│       (상품원가 열람 권한 별도 체크박스)         │
│     > □ 거래처등록  master.partners            │
│     > □ 창고등록  master.warehouses            │
│                                              │
│  ▼ □ 구매관리  purchase                      │
│     > □ 구매입력  purchase.input               │
│     > □ 구매조회  purchase.view                │
│     > □ 구매현황  purchase.status              │
│                                              │
│  ▼ □ 생산입고  production                    │
│     > □ 생산입고  production.input             │
│     > □ 생산조회  production.view              │
│                                              │
│  ▼ □ 판매관리  sales                         │
│     > □ 판매입력  sales.input                  │
│     > □ 판매조회  sales.view                   │
│     > □ 판매현황  sales.status                 │
│     > □ 결제내역조회  sales.payment             │
│                                              │
│  ▼ □ 링크발주  order_link                    │
│  ▼ □ 거래명세서  invoice                     │
│  ▼ □ 회계/재무  accounting                   │
│  ▼ □ 시스템설정  system                      │
├─────────────────────────────────────────────┤
│  ↻ 초기화          [취소]    [저장]           │
└─────────────────────────────────────────────┘
```

**동작 규칙:**
- 상위 메뉴 체크 → 하위 메뉴 전체 체크/해제
- 하위 메뉴 개별 체크 가능
- **품목등록의 "상품원가" 칼럼**은 별도 권한으로 제어 (직원에게 원가 비노출 가능)
- 권한이 없는 메뉴는 사이드바에서 아예 **비노출**

---

## 7. 대시보드

### 7.1 대시보드 구성 요소

#### 7.1.1 미수금 경고 위젯

```
┌─────────────────────────────────────────────┐
│  🚨 미수금 관리                              │
├─────────────────────────────────────────────┤
│  ■ 미수금 300만원 초과 업체                    │
│  ┌─────────────────────────────────────────┐│
│  │ 거래처명 │ 미수금액 │ 최초발생일 │ 경과일 │ 상태    ││
│  │ A업체   │ 450만원  │ 02/01   │ 9일   │ 🔴블랙  ││
│  │ B업체   │ 320만원  │ 02/05   │ 5일   │ 🟡경고  ││
│  └─────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

**미수금 관리 자동화 로직:**

```
[미수금 발생]
    ↓
[입금 확인 메시지 발송] — 팝빌 알림톡
    ↓
[2일 간격으로 반복 발송 (Push)]
    ↓
[3회 이상 미응답 시]
    ↓
[🔴 블랙리스트 자동 전환]
    → 대시보드에 즉시 노출
    → 해당 거래처 링크 발주 차단 (선택적)
```

**단계별 상태:**

| 경과일 | 상태 | 액션 |
|--------|------|------|
| 0~2일 | 🟢 정상 | 1차 입금 확인 메시지 발송 |
| 3~4일 | 🟡 경고 | 2차 메시지 발송 |
| 5~6일 | 🟠 주의 | 3차 메시지 발송 |
| 7일+ 또는 3회 미응답 | 🔴 블랙리스트 | 대시보드 경고 표시, 추가 조치 |

#### 7.1.2 오늘 발주 현황 위젯

```
┌──────────────────────────────────────────────────────┐
│  📦 오늘 발주 현황                                     │
├──────────────────────────────────────────────────────┤
│  품목     │ 재고수량 │ 주문수량 │ 출고후재고 │            │
│  ▶ 사과   │  100개  │  30개   │   70개   │ [▼ 펼치기] │
│  ┌────────────────────────────────────────────────┐  │
│  │  └─ A업체: 10개                                │  │
│  │  └─ B업체: 15개  ← 클릭 시 해당 발주건 상세 이동  │  │
│  │  └─ C업체: 5개                                 │  │
│  └────────────────────────────────────────────────┘  │
│  ▶ 배     │   50개  │  20개   │   30개   │ [▼ 펼치기] │
│  ▶ 감     │  200개  │  80개   │  120개   │ [▼ 펼치기] │
└──────────────────────────────────────────────────────┘
```

**동작 규칙:**
- 품목 행의 **[▼]** 클릭 → 하위에 업체별 발주 수량 **아코디언 펼침**
- 상단 클릭 → 다시 **접힘**
- 업체명 클릭 → 해당 **발주건 상세 페이지** 이동

---

## 8. 바코드 입고 시스템

### 8.1 Global Key Listener 방식

> 바코드 스캐너는 키보드 입력으로 인식되므로, 입고 페이지에서 **글로벌 키 리스너**가 바코드 입력을 감지한다.

### 8.2 입고 프로세스

```
[입고 페이지 진입]
    ↓
[입고등록 버튼 클릭] → 입고 등록 팝업 열림
    ↓
[바코드 스캐너로 포장지 바코드 스캔]
    ↓
[시스템이 바코드 인식]
    → 품목등록 DB에서 해당 바코드 조회
    → 매칭된 품목의 정보 자동 입력
    ↓
[테이블에 한 행씩 추가]
    │
    ├─ 바코드 수량: 스캔 횟수 (1씩 증가)
    ├─ 제품 수량: 바코드수량 × 최소수량 (자동 계산)
    │   예) 최소수량=10, 3번 스캔 → 바코드수량=3, 제품수량=30
    └─ 동일 바코드 재스캔 → 기존 행의 바코드수량 +1 (행 추가 X)
    ↓
[저장] → 해당 창고 재고에 제품수량만큼 추가
```

### 8.3 입고 등록 팝업 테이블

| 칼럼 | 자동입력 | 설명 |
|------|----------|------|
| 바코드 | ✅ | 스캔된 바코드 번호 표시 |
| 품목코드 | ✅ | 바코드 매칭으로 자동 |
| 품목명 | ✅ | 자동 |
| 규격 | ✅ | 자동 |
| 바코드수량 | ✅ | 스캔 횟수 (1씩 증가) |
| 최소수량 | ✅ | 품목등록의 최소수량 값 |
| 제품수량 | ✅ | **바코드수량 × 최소수량** (자동 계산) |
| 창고 | - | 입고할 창고 선택 |

---

## 9. 참고 UI 레퍼런스

> 아래 스크린샷은 이카운트(eCount) ERP의 실제 화면을 참고용으로 촬영한 것이다.
> 전체적인 레이아웃과 UX 흐름을 벤치마킹하되, 디자인은 Shadcn/UI + Tailwind CSS로 현대적으로 재구성한다.

| 참고 화면 | 설명 |
|-----------|------|
| 판매입력 | 상단 헤더(일자/거래처/담당자/출하창고) + 하단 품목 테이블 + 하단 버튼 구성 |
| 생산입고 | 생산/소모 탭 전환 + 품목코드 검색 자동완성 + 수량 입력 |
| 생산입고조회 | 리스트 형식 + 상단 검색 + 페이지네이션 + 하단 생산입고 버튼 |
| 권한관리 리스트 | 직원 리스트 + 이름 아바타 + 업무권한 버튼 |
| 권한설정 팝업 | 트리 구조 체크박스 + 상위/하위 메뉴 권한 설정 |

---

## 10. 개발 우선순위 및 페이즈 가이드

### Phase 1 — Frontend UI 완성

1. 공통 컴포넌트 개발 (ListPage, InputModal, RegisterPage, SearchPanel)
2. 사이드바 + 라우팅 구조
3. 기초등록 4개 페이지
4. 구매관리 3개 페이지
5. 판매관리 4개 페이지
6. 생산입고 2개 페이지
7. 링크발주 + 링크 페이지 (외부)
8. 거래명세서 발행 페이지
9. 권한관리 페이지
10. 대시보드

### Phase 1.5 — 반자동 정산

1. 재고 수량 계산 로직 (구매입고 +, 판매출고 -, 바코드 입고 +)
2. 미수금 계산 및 상태 관리
3. 거래명세서 합산 로직 (미입금 건 누적)

### Phase 2 — Backend 연동

1. Supabase DB 스키마 설계 + RLS 적용
2. 팝빌 API 연동 (알림톡, 세금계산서, 계좌조회)
3. 카카오 OAuth 로그인
4. 바코드 Global Key Listener 실장
5. Web Bluetooth 라벨 프린터 연동
6. 스윗트래커 택배 추적 연동

---

## 부록: Claude Code에서 PRD 생성 시 지시사항

> 이 메타프롬프트를 Claude Code에 전달할 때 아래를 추가 지시하세요:

```
위 메타프롬프트를 기반으로 PRD(Product Requirements Document)를 작성해주세요.

작성 조건:
1. 마크다운 형식으로 작성
2. 각 페이지별 Wireframe을 ASCII Art 또는 Mermaid로 표현
3. DB 스키마 초안 포함 (Supabase PostgreSQL 기준)
4. API 엔드포인트 목록 포함
5. 컴포넌트 트리 구조 포함
6. 상태 관리 설계 (Zustand Store 구조)
7. 권한 체계 매트릭스 포함
8. 에러 핸들링 시나리오 포함
```

---

*이 문서는 PRD 작성을 위한 메타프롬프트입니다. 실제 PRD는 이 내용을 기반으로 Claude Code에서 생성합니다.*
