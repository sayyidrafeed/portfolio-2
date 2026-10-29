// Draft copy. Every line still needs Rafee's review before it ships.

export type ProjectPreview = "siera" | "dignition" | "thya" | "nalarx";

export type StackItem = {
  label: string;
  icon: string;
  // Any CSS background: the brand colour the icon fades to on hover. Black brands use white here.
  brand: string;
  // Logos whose detail lives in their own colours render as images instead of a mono mask.
  keepColor?: boolean;
};

export type Project = {
  name: string;
  preview: ProjectPreview;
  summary: string;
  stack: StackItem[];
  href: string;
};

export type ChannelPlatform = "email" | "linkedin" | "github" | "x" | "resume";

export type Channel = {
  platform: ChannelPlatform;
  label: string;
  href: string;
};

export const profile = {
  name: "Rafee",
  fullName: "Muhammad Sayyid Rafee' Djamil",
  tagline: "Happy to solve product / engineering problems.",
  intro:
    "I plan products at NalarX and build next to the engineers who ship them. I also mentor developers at Veterantech and keep side projects around to practise system design.",
};

const tech = {
  veterantech: {
    label: "Veterantech · UPNVJ",
    icon: "/stack/veterantech.svg",
    brand: "linear-gradient(#efa17a, #c65864)",
  },
  nalar: { label: "Nalar", icon: "/stack/nalar.svg", brand: "#e8500c" },
  vitePlus: { label: "Vite+", icon: "/stack/vite.svg", brand: "#9135ff" },
  react: { label: "React", icon: "/stack/react.svg", brand: "#61dafb" },
  hono: { label: "Hono", icon: "/stack/hono.svg", brand: "#e36002" },
  bullmq: { label: "BullMQ", icon: "/stack/bullmq.png", brand: "#ffffff" },
  redis: { label: "Redis", icon: "/stack/redis.svg", brand: "#ff4438" },
  postgres: { label: "PostgreSQL", icon: "/stack/postgresql.svg", brand: "#4169e1" },
  pgvector: { label: "PostgreSQL + pgvector", icon: "/stack/postgresql.svg", brand: "#4169e1" },
  next: { label: "Next.js", icon: "/stack/nextdotjs.svg", brand: "#ffffff" },
  bun: { label: "Bun", icon: "/stack/bun.svg", brand: "#fbf0df" },
  mcp: {
    label: "Model Context Protocol",
    icon: "/stack/modelcontextprotocol.svg",
    brand: "#ffffff",
  },
  waba: { label: "WhatsApp Business API", icon: "/stack/whatsapp.svg", brand: "#25d366" },
  elysia: { label: "Elysia", icon: "/stack/elysia.svg", brand: "#ffffff", keepColor: true },
  aiSdk: { label: "Vercel AI SDK", icon: "/stack/vercel.svg", brand: "#ffffff" },
} satisfies Record<string, StackItem>;

export const projects: Project[] = [
  {
    name: "Siera",
    preview: "siera",
    summary:
      "The information system behind PATRIBERA, UPN Veteran Jakarta's orientation program for more than 4,500 new students a year.",
    stack: [
      tech.veterantech,
      tech.vitePlus,
      tech.react,
      tech.hono,
      tech.bullmq,
      tech.redis,
      tech.postgres,
    ],
    href: "https://siera.veterantech.id",
  },
  {
    name: "Dignition",
    preview: "dignition",
    summary:
      "A learning platform for Veterantech's study clubs at UPN Veteran Jakarta, with an AI assistant that helps members as they learn.",
    stack: [tech.veterantech, tech.next, tech.bun, tech.postgres, tech.mcp],
    href: "https://dignition.veterantech.id",
  },
  {
    name: "Thya",
    preview: "thya",
    summary:
      "An AI assistant on WhatsApp for small food and beverage owners, built for .id DeveloperDay 2026. Ask how much profit you made this week and get your own numbers back, explained in one line.",
    stack: [tech.waba, tech.elysia, tech.aiSdk, tech.pgvector],
    href: "https://thya.veterantech.id",
  },
  {
    name: "NalarX",
    preview: "nalarx",
    summary:
      "A vertical AI workspace. Companies ask questions about their business data and get answers with the source attached.",
    stack: [tech.nalar],
    href: "https://nalarx.com",
  },
];

export function channelTargetProps(channel: Channel) {
  return channel.href.startsWith("mailto:") ? {} : { rel: "noreferrer", target: "_blank" };
}

export const channels: Channel[] = [
  { platform: "email", label: "Email", href: "mailto:msayyid.rafeed@gmail.com" },
  {
    platform: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/m-sayyid-rafee-djamil/",
  },
  { platform: "github", label: "GitHub", href: "https://github.com/sayyidrafeed" },
  { platform: "x", label: "X", href: "https://x.com/m_rafee26359" },
  {
    platform: "resume",
    label: "Resume",
    href: "https://docs.google.com/document/d/1PN5gVPJgzfczoVWd-vnpKEg2MD7K1gCcFqcT6a6WBRM/edit?usp=sharing",
  },
];
