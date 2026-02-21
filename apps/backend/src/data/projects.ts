/** 이 파일은 백엔드 API에서 사용하는 프로젝트 데이터를 제공합니다. */

export type ProjectRecord = {
  slug: string;
  id: string;
  title: string;
  client: string;
  summary: string;
  description: string;
  stack: string[];
  liveUrl?: string;
};

export const projectRecords: ProjectRecord[] = [
  {
    slug: "aura-launch",
    id: "01",
    title: "AURA",
    client: "Luxury Brand",
    summary: "WebGL 기반 몰입형 브랜드 런칭 페이지.",
    description:
      "신규 럭셔리 향수 라인을 위한 WebGL 기반 제품 탐색 플랫폼입니다. 유체 역학 시뮬레이션과 유리 굴절 셰이더를 활용하여 고급스러운 브랜드 경험을 구현했습니다.",
    stack: ["Three.js", "GLSL", "Next.js"],
  },
  {
    slug: "nexus-dashboard",
    id: "02",
    title: "NEXUS",
    client: "FinTech Startup",
    summary: "실시간 금융 데이터 시각화 대시보드.",
    description:
      "복잡한 시장 지표를 아름답고 직관적인 기하학적 패턴으로 변환하는 실시간 데이터 시각화 대시보드입니다.",
    stack: ["React", "D3.js", "WebSockets"],
  },
  {
    slug: "synth-portfolio",
    id: "03",
    title: "SYNTH",
    client: "Architecture Firm",
    summary: "미니멀리즘 건축 포트폴리오 플랫폼.",
    description:
      "브루탈리스트 건축물을 흑백 사진과 부드러운 타이포그래피로 전시하는 미니멀 포트폴리오 사이트입니다.",
    stack: ["Next.js", "GSAP", "Prismic CMS"],
  },
  {
    slug: "kinetic-commerce",
    id: "04",
    title: "KINETIC",
    client: "Sportswear Brand",
    summary: "3D 제품 전시 기반 커머스 경험.",
    description:
      "스크롤 연동 3D 제품 회전과 마이크로 인터랙션을 활용한 고성능 이커머스 플랫폼입니다.",
    stack: ["Shopify Plus", "WebGL", "TypeScript"],
  },
  {
    slug: "oracle-ai",
    id: "05",
    title: "ORACLE",
    client: "AI Startup",
    summary: "LLM 기반 비즈니스 인텔리전스 챗봇.",
    description:
      "기업 내부 데이터를 분석하고 자연어로 인사이트를 제공하는 AI 챗봇 서비스입니다.",
    stack: ["LangChain", "Next.js", "OpenAI API"],
  },
  {
    slug: "eclipse-editorial",
    id: "06",
    title: "ECLIPSE",
    client: "Fashion Editorial",
    summary: "실험적 타이포그래피 디지털 매거진.",
    description:
      "전통적인 그리드 레이아웃을 해체한 디지털 매거진 경험입니다.",
    stack: ["HTML5", "CSS Grid", "Locomotive Scroll"],
  },
  {
    slug: "sentinel-saas",
    id: "07",
    title: "SENTINEL",
    client: "SaaS Platform",
    summary: "보안 중심 SaaS 마케팅 사이트.",
    description:
      "보안과 확장성을 강조하는 다크 모드 전용 마케팅 사이트입니다.",
    stack: ["Three.js", "Tailwind", "Vercel"],
  },
  {
    slug: "flux-gallery",
    id: "08",
    title: "FLUX",
    client: "Art Gallery",
    summary: "공간 오디오 기반 가상 전시 공간.",
    description:
      "큐레이션된 디지털 아트 작품을 공간 오디오와 함께 탐색할 수 있는 가상 전시 공간입니다.",
    stack: ["WebXR", "Three.js", "Spatial Audio"],
  },
  {
    slug: "vector-automation",
    id: "09",
    title: "VECTOR",
    client: "Manufacturing",
    summary: "AI 자동화 공정 모니터링 대시보드.",
    description:
      "제조 공정의 실시간 모니터링과 이상 탐지를 위한 AI 기반 대시보드입니다.",
    stack: ["React", "TensorFlow.js", "WebSockets"],
  },
  {
    slug: "stealth-terminal",
    id: "10",
    title: "STEALTH",
    client: "Cybersecurity",
    summary: "터미널 인스파이어드 인터랙티브 사이트.",
    description:
      "터미널 인터페이스로 위장한 기업 웹사이트입니다.",
    stack: ["React", "Framer Motion", "Node.js"],
  },
];
