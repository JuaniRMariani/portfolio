import type { SkillGroup } from "./types"

export const skills: SkillGroup[] = [
  {
    id: "backend",
    title: { en: "Backend", es: "Backend" },
    note: {
      en: "daily at NexoSmart and in Cuonti",
      es: "a diario en NexoSmart y en Cuonti",
    },
    items: ["Laravel / PHP", "Node.js", "REST API design", "MySQL", "PostgreSQL", "Redis"],
  },
  {
    id: "frontend",
    title: { en: "Frontend", es: "Frontend" },
    note: {
      en: "production UIs for client-facing products",
      es: "interfaces en producción para productos de clientes",
    },
    items: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    id: "infra",
    title: { en: "Infra & DevOps", es: "Infra y DevOps" },
    note: {
      en: "self-managed production VPS",
      es: "VPS de producción autoadministrado",
    },
    items: ["Linux (Ubuntu)", "Nginx", "Cloudflare", "CI/CD", "Git"],
  },
  {
    id: "ai",
    title: { en: "AI tooling", es: "AI tooling" },
    note: {
      en: "agentic workflows as part of how I ship",
      es: "workflows agénticos como parte de cómo construyo",
    },
    items: ["Claude Code", "Multi-agent workflows", "MCP servers", "Codex", "Gemini"],
  },
  {
    id: "languages",
    title: { en: "Languages", es: "Idiomas" },
    note: {
      en: "",
      es: "",
    },
    items: ["Spanish (native)", "English (B2)", "Italian (basic)"],
  },
]
