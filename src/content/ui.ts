import type { L } from "./types"

export const ui = {
  nav: {
    about: { en: "About", es: "Sobre mí" } satisfies L<string>,
    experience: { en: "Experience", es: "Experiencia" } satisfies L<string>,
    projects: { en: "Projects", es: "Proyectos" } satisfies L<string>,
    ai: { en: "How I work", es: "Cómo trabajo" } satisfies L<string>,
    skills: { en: "Skills", es: "Skills" } satisfies L<string>,
    contact: { en: "Contact", es: "Contacto" } satisfies L<string>,
  },
  skipAnimation: { en: "skip intro", es: "saltar intro" } satisfies L<string>,
  switchLocale: { en: "Ver en español", es: "View in English" } satisfies L<string>,
  hero: {
    kicker: {
      en: "Portfolio — Information Systems Engineer",
      es: "Portfolio — Ingeniero en Sistemas de Información",
    } satisfies L<string>,
    viewProjects: { en: "View projects", es: "Ver proyectos" } satisfies L<string>,
    getInTouch: { en: "Get in touch", es: "Contactame" } satisfies L<string>,
  },
  meta: {
    title: {
      en: "Juan Ignacio Rodríguez Mariani — Information Systems Engineer",
      es: "Juan Ignacio Rodríguez Mariani — Ingeniero en Sistemas de Información",
    } satisfies L<string>,
    description: {
      en: "Full-stack engineer building production platforms end to end. Co-creator of Cuonti, a tax-automation SaaS with 50+ active clients. Laravel, Next.js, Linux, and AI-augmented engineering with Claude Code.",
      es: "Ingeniero full-stack que construye plataformas en producción de punta a punta. Co-creador de Cuonti, un SaaS de automatización impositiva con 50+ clientes activos. Laravel, Next.js, Linux e ingeniería potenciada con Claude Code.",
    } satisfies L<string>,
  },
  contact: {
    heading: { en: "Let's talk", es: "Hablemos" } satisfies L<string>,
    body: {
      en: "Open to interesting engineering work. The fastest way to reach me is email — I answer.",
      es: "Abierto a trabajo de ingeniería interesante. La vía más rápida es el email — respondo.",
    } satisfies L<string>,
    cta: { en: "Say hello", es: "Escribime" } satisfies L<string>,
  },
  footer: {
    built: {
      en: "Designed & built with agentic workflows — that's genuinely how I work.",
      es: "Diseñado y construido con workflows agénticos — así trabajo de verdad.",
    } satisfies L<string>,
    type: {
      en: "Set in Bricolage Grotesque, Schibsted Grotesk & Commit Mono",
      es: "Compuesto en Bricolage Grotesque, Schibsted Grotesk y Commit Mono",
    } satisfies L<string>,
  },
} as const
