import type { L } from "./types"

export const ui = {
  nav: {
    about: { en: "About", es: "Sobre mí" } satisfies L<string>,
    services: { en: "Freelance Services", es: "Servicios Freelance" } satisfies L<string>,
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
  press: {
    heading: { en: "Press coverage", es: "En los medios" } satisfies L<string>,
    sub: {
      en: "Agro BCS in national and regional media",
      es: "Agro BCS en medios nacionales y regionales",
    } satisfies L<string>,
    readArticle: { en: "Read article", es: "Leer nota" } satisfies L<string>,
    prev: { en: "Previous articles", es: "Notas anteriores" } satisfies L<string>,
    next: { en: "Next articles", es: "Notas siguientes" } satisfies L<string>,
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
  play: {
    hint: {
      en: "Psst — this page hides 7 secrets. Press / for the terminal.",
      es: "Psst — esta página esconde 7 secretos. Apretá / para la terminal.",
    } satisfies L<string>,
    heroHint: { en: "move · click · break it", es: "mové · clickeá · rompelo" } satisfies L<string>,
    scroll: { en: "scroll", es: "scroll" } satisfies L<string>,
    terminal: { en: "Open terminal", es: "Abrir terminal" } satisfies L<string>,
    copied: { en: "Email copied to clipboard", es: "Email copiado al portapapeles" } satisfies L<string>,
    copyHint: { en: "click to copy", es: "click para copiar" } satisfies L<string>,
    playGame: { en: "Play skills breakout", es: "Jugar skills breakout" } satisfies L<string>,
    exitGame: { en: "Exit game", es: "Salir del juego" } satisfies L<string>,
  },
  achievements: {
    label: { en: "Secrets found", es: "Secretos encontrados" } satisfies L<string>,
    unlocked: { en: "Achievement unlocked", es: "Logro desbloqueado" } satisfies L<string>,
    close: { en: "Close", es: "Cerrar" } satisfies L<string>,
    items: {
      scatter: {
        title: { en: "Pyromaniac — you blew up my name", es: "Pirómano — volaste mi nombre" },
        hint: { en: "The hero is not just for looking", es: "El hero no es solo para mirar" },
      },
      terminal: {
        title: { en: "Root access — opened the terminal", es: "Acceso root — abriste la terminal" },
        hint: { en: "Real devs use the keyboard", es: "Los devs de verdad usan el teclado" },
      },
      konami: {
        title: { en: "Ember storm — old-school code", es: "Tormenta de brasas — código de la vieja escuela" },
        hint: { en: "↑ ↑ ↓ ↓ ...", es: "↑ ↑ ↓ ↓ ..." },
      },
      breakout: {
        title: { en: "Stack overflow — broke every skill", es: "Stack overflow — rompiste todos los skills" },
        hint: { en: "Skills are meant to be played with", es: "Los skills están para jugar" },
      },
      "copy-email": {
        title: { en: "Inbox incoming — copied my email", es: "Inbox en camino — copiaste mi email" },
        hint: { en: "The fastest way to reach me", es: "La vía más rápida para contactarme" },
      },
      "hidden-ember": {
        title: { en: "Sharp eye — found the hidden ember", es: "Ojo de águila — encontraste la brasa oculta" },
        hint: { en: "Something glows where it shouldn't", es: "Algo brilla donde no debería" },
      },
      "the-end": {
        title: { en: "Completionist — read until the end", es: "Completista — leíste hasta el final" },
        hint: { en: "Scroll all the way down", es: "Bajá hasta el final" },
      },
    } satisfies Record<string, { title: L<string>; hint: L<string> }>,
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
