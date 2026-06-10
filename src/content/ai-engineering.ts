import type { AiEngineering } from "./types"

export const aiEngineering: AiEngineering = {
  intro: {
    en: "Not autocomplete — agentic workflows. I run AI agents as part of my engineering process on real production codebases, with the same rigor as any other code: reviewed, tested and verified before it ships.",
    es: "No es autocomplete — son workflows agénticos. Uso agentes de IA como parte de mi proceso de ingeniería sobre codebases reales en producción, con el mismo rigor que cualquier otro código: revisado, testeado y verificado antes de shippear.",
  },
  practices: [
    {
      title: { en: "Multi-agent workflows", es: "Workflows multi-agente" },
      detail: {
        en: "Planning agents, parallel codebase explorers and adversarial reviewers orchestrated on real features — not toy demos.",
        es: "Agentes de planificación, exploradores de codebase en paralelo y reviewers adversariales orquestados sobre features reales — no demos de juguete.",
      },
    },
    {
      title: { en: "Custom skills & commands", es: "Skills y comandos propios" },
      detail: {
        en: "Reusable skills and slash commands that encode repeatable engineering tasks: design systems, code review checklists, deploy routines.",
        es: "Skills y slash commands reutilizables que codifican tareas repetibles: design systems, checklists de code review, rutinas de deploy.",
      },
    },
    {
      title: { en: "MCP servers in daily work", es: "MCP servers en el trabajo diario" },
      detail: {
        en: "Model Context Protocol servers wired into the workflow — project management, documentation and design tools reachable from the agent session.",
        es: "Servidores Model Context Protocol integrados al workflow — gestión de proyectos, documentación y herramientas de diseño accesibles desde la sesión del agente.",
      },
    },
    {
      title: { en: "Verification before done", es: "Verificación antes de cerrar" },
      detail: {
        en: "Every AI-assisted change runs the same gauntlet: builds, tests, lint and a human review. AI speeds up the loop; it doesn't skip it.",
        es: "Cada cambio asistido por IA pasa por el mismo circuito: build, tests, lint y revisión humana. La IA acelera el loop; no lo saltea.",
      },
    },
  ],
  tools: [
    {
      name: "Claude Code",
      detail: {
        en: "daily driver — agents, skills, MCP, multi-agent orchestration",
        es: "herramienta principal — agentes, skills, MCP, orquestación multi-agente",
      },
    },
    {
      name: "Codex",
      detail: { en: "secondary agent for parallel work", es: "agente secundario para trabajo en paralelo" },
    },
    {
      name: "Gemini",
      detail: { en: "API integrations in shipped products", es: "integraciones por API en productos shippeados" },
    },
  ],
}
