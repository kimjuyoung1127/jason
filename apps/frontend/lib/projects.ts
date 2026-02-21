export type Project = {
  slug: string;
  id: string;
  title: string;
  client: string;
  summary: string;
  description: string;
  stack: string[];
  liveUrl?: string;
  ogImage?: string;
  color?: string;
};

export const projects: Project[] = [
  {
    slug: "busy-bar",
    id: "01",
    title: "BUSY BAR",
    client: "Productivity Device",
    summary: "A compact LED productivity device designed for focused work environments.",
    description:
      "Busy Bar is a hardware-first product that visualizes work status through a clean LED display. The website delivers product storytelling, checkout flow, and post-purchase support with a conversion-focused user journey.",
    stack: ["Next.js", "TypeScript", "Stripe", "PostHog"],
    liveUrl: "https://busy.bar",
    ogImage: "/thumbnails/busy-bar.webp",
    color: "#E52A2A",
  },
  {
    slug: "headroom",
    id: "02",
    title: "HEADROOM",
    client: "Email Automation",
    summary: "An AI assistant that automates email responses and follow-up workflows.",
    description:
      "Headroom helps teams respond faster by automating repetitive email tasks with context-aware AI. The product experience emphasizes clarity, trust, and measurable efficiency gains for busy operators.",
    stack: ["Next.js", "React", "AI/ML", "Email API"],
    liveUrl: "https://headroom.com",
    ogImage: "/thumbnails/headroom.webp",
  },
  {
    slug: "breyta-ai",
    id: "03",
    title: "BREYTA",
    client: "AI Analytics",
    summary: "An AI analytics platform that generates reports and actionable insights automatically.",
    description:
      "Breyta transforms raw business data into clear insights without heavy manual analysis. The interface combines live dashboards with guided narratives so teams can make decisions with confidence.",
    stack: ["React", "Python", "LLM", "Data Visualization"],
    liveUrl: "https://breyta.ai",
    ogImage: "/thumbnails/breyta-ai.webp",
  },
  {
    slug: "content-on-demand",
    id: "04",
    title: "CONTENT ON DEMAND",
    client: "Content Platform",
    summary: "A platform connecting creators and brands for on-demand content production.",
    description:
      "Content on Demand streamlines matching, production, and delivery between creators and marketing teams. The experience focuses on transparent workflow visibility, strong interaction design, and reduced delivery friction.",
    stack: ["Framer", "React", "Animation", "CMS"],
    liveUrl: "https://contentondemand.in",
    ogImage: "/thumbnails/content-on-demand.webp",
  },
  {
    slug: "taillog",
    id: "05",
    title: "TAILLOG",
    client: "Pet Tech",
    summary: "A behavior analytics service that helps pet owners understand daily patterns.",
    description:
      "Taillog captures behavioral signals and translates them into practical routines and recommendations. The product combines data tracking, AI interpretation, and coaching-style guidance in one unified flow.",
    stack: ["Next.js", "TypeScript", "AI/ML", "Data Analytics"],
    liveUrl: "https://www.mungai.co.kr",
    ogImage: "/thumbnails/taillog.webp",
  },
  {
    slug: "puppyvill",
    id: "06",
    title: "PUPPYVILL",
    client: "Pet Care",
    summary: "An integrated pet care website covering grooming, hotel, training, and booking.",
    description:
      "Puppyvill consolidates multiple pet care services into one clear digital experience. The site is designed to improve trust, simplify reservations, and communicate service quality at first glance.",
    stack: ["Next.js", "React", "Responsive Design", "SEO"],
    liveUrl: "https://www.puppyvill.com",
    ogImage: "/thumbnails/puppyvill.webp",
  },
  {
    slug: "vibehub",
    id: "07",
    title: "VIBE HUB",
    client: "Developer Community",
    summary: "A community platform for developers building with AI-first workflows.",
    description:
      "Vibe Hub supports collaboration through project sharing, technical feedback, and practical AI playbooks. The platform balances creator expression with information architecture for sustained community engagement.",
    stack: ["Next.js", "TypeScript", "Community", "AI"],
    liveUrl: "https://www.vibehub.tech",
    ogImage: "/thumbnails/vibehub.webp",
  },
  {
    slug: "tak-dijang",
    id: "08",
    title: "TAK DIJANG",
    client: "E-commerce Design",
    summary: "A studio website focused on high-converting product detail page design.",
    description:
      "Tak Dijang showcases end-to-end e-commerce design services from planning to visual execution. The portfolio structure highlights measurable conversion impact and clean storytelling for client acquisition.",
    stack: ["Next.js", "Vercel", "Responsive Design", "Photography"],
    liveUrl: "https://tak-iota.vercel.app",
    ogImage: "/thumbnails/tak-dijang.webp",
  },
  {
    slug: "signalcraft-app",
    id: "09",
    title: "SIGNALCRAFT BIZ",
    client: "Industrial SaaS",
    summary: "A business dashboard for real-time industrial signal monitoring and alerts.",
    description:
      "Signalcraft Biz visualizes machine and facility data streams in a single operational interface. It combines live charts, anomaly tracking, and workflow-ready alerts to support fast decision making.",
    stack: ["React", "TypeScript", "WebSocket", "D3.js"],
    liveUrl: "https://signalcraft-web-app-zbpf.vercel.app/dashboard",
    ogImage: "/thumbnails/signalcraft-app.webp",
  },
  {
    slug: "signalcraft",
    id: "10",
    title: "SIGNALCRAFT",
    client: "Smart Factory AI",
    summary: "An AI-powered predictive maintenance platform for smart factory operations.",
    description:
      "Signalcraft detects risk patterns from vibration and acoustic data before failures occur. The product combines edge AI, reliability dashboards, and field-ready workflows for production-grade deployment.",
    stack: ["Next.js", "TypeScript", "Edge AI", "IoT"],
    liveUrl: "https://www.signalcraft.kr/en",
    ogImage: "/thumbnails/signalcraft.webp",
  },
  {
    slug: "cobalt",
    id: "11",
    title: "COBALT",
    client: "Fintech Platform",
    summary: "An intuitive financial management platform for small business cash flow and operations.",
    description:
      "Cobalt gives small business owners real-time financial visibility with AI-powered insights, mobile-first card management, and integrated alerts. The experience prioritizes clarity and confidence so operators can make data-driven decisions without legacy tools.",
    stack: ["Next.js", "React", "Banking API", "AI/ML"],
    liveUrl: "https://joincobalt.com",
    ogImage: "/thumbnails/cobalt.webp",
  },
  {
    slug: "perspective-funnels",
    id: "12",
    title: "PERSPECTIVE FUNNELS",
    client: "Marketing SaaS",
    summary: "A mobile-first funnel builder for high-converting lead generation without code.",
    description:
      "Perspective lets marketers and agencies create interactive sales funnels in under 30 minutes using pre-built templates. The platform combines conversion-optimized flows, built-in messaging automation, and real-time analytics into one cohesive tool.",
    stack: ["React", "GSAP", "Analytics", "CRM"],
    liveUrl: "https://www.perspective.co",
    ogImage: "/thumbnails/funnels.webp",
  },
  {
    slug: "workable",
    id: "13",
    title: "WORKABLE",
    client: "HR Tech",
    summary: "An all-in-one HR platform combining recruiting, employee management, and payroll.",
    description:
      "Workable unifies applicant tracking, AI-powered candidate sourcing, onboarding, time tracking, and payroll into a single system. The product serves 27,000+ companies with a clean, enterprise-grade interface that balances depth with approachability.",
    stack: ["React", "Next.js", "REST API", "Integrations"],
    liveUrl: "https://www.workable.com",
    ogImage: "/thumbnails/workable.webp",
  },
];
