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
      en: "Psst — this page hides 8 secrets. Press / for the terminal.",
      es: "Psst — esta página esconde 8 secretos. Apretá / para la terminal.",
    } satisfies L<string>,
    heroHint: { en: "move · click · hold to charge", es: "mové · clickeá · mantené para cargar" } satisfies L<string>,
    heroHintTouch: { en: "tilt · drag · hold to charge", es: "inclinalo · arrastrá · mantené" } satisfies L<string>,
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
      "ember-hunt": {
        title: { en: "Ember hunter — caught all five embers", es: "Cazador de brasas — atrapaste las cinco" },
        hint: { en: "Five embers drift before Experience", es: "Cinco brasas flotan antes de Experiencia" },
      },
      "the-end": {
        title: { en: "Completionist — read until the end", es: "Completista — leíste hasta el final" },
        hint: { en: "Scroll all the way down", es: "Bajá hasta el final" },
      },
    } satisfies Record<string, { title: L<string>; hint: L<string> }>,
  },
  terminal: {
    title: { en: "juani@bahia-blanca: ~", es: "juani@bahia-blanca: ~" } satisfies L<string>,
    dialog: { en: "Interactive terminal", es: "Terminal interactiva" } satisfies L<string>,
    close: { en: "Close terminal", es: "Cerrar terminal" } satisfies L<string>,
    inputLabel: { en: "Terminal command", es: "Comando de terminal" } satisfies L<string>,
    boot: {
      en: [
        "JRM-OS 26.10 (ember) — tty1",
        "[ ok ] mounting /dev/patagonia",
        "[ ok ] igniting ember field ............ 100%",
        "[ ok ] indexing projects, roles & skills",
      ],
      es: [
        "JRM-OS 26.10 (ember) — tty1",
        "[ ok ] montando /dev/patagonia",
        "[ ok ] encendiendo campo de brasas ..... 100%",
        "[ ok ] indexando proyectos, roles y skills",
      ],
    } satisfies L<readonly string[]>,
    welcome: {
      en: "Welcome, visitor. Type `help` (or click a command) to begin.",
      es: "Bienvenido/a. Escribí `help` (o clickeá un comando) para empezar.",
    } satisfies L<string>,
    helpTitle: { en: "Available commands:", es: "Comandos disponibles:" } satisfies L<string>,
    helpFooter: {
      en: "Tip: Tab autocompletes, ↑/↓ browse history, Esc closes.",
      es: "Tip: Tab autocompleta, ↑/↓ recorre el historial, Esc cierra.",
    } satisfies L<string>,
    commands: {
      help: { en: "this list", es: "esta lista" },
      whoami: { en: "who is this guy", es: "quién es este tipo" },
      about: { en: "the longer story", es: "la historia larga" },
      experience: { en: "where I've worked", es: "dónde trabajé" },
      projects: { en: "things I've shipped", es: "cosas que puse en producción" },
      skills: { en: "the toolbox", es: "la caja de herramientas" },
      contact: { en: "how to reach me", es: "cómo contactarme" },
      open: { en: "jump to a section — open <section>", es: "ir a una sección — open <sección>" },
      "sudo hire-me": { en: "escalate privileges", es: "escalar privilegios" },
      ember: { en: "light it up", es: "prendelo fuego" },
      play: { en: "skills breakout", es: "skills breakout" },
      lang: { en: "switch to Spanish", es: "cambiar a inglés" },
      achievements: { en: "secrets found so far", es: "secretos encontrados" },
      ls: { en: "list files", es: "listar archivos" },
      clear: { en: "clear the screen", es: "limpiar la pantalla" },
      exit: { en: "close the terminal", es: "cerrar la terminal" },
    } satisfies Record<string, L<string>>,
    location: { en: "location", es: "ubicación" } satisfies L<string>,
    status: { en: "status", es: "estado" } satisfies L<string>,
    education: { en: "education", es: "formación" } satisfies L<string>,
    projectStatus: {
      production: { en: "live in production", es: "en producción" },
      "public-repo": { en: "public repo", es: "repo público" },
      internal: { en: "internal", es: "interno" },
    } satisfies Record<string, L<string>>,
    openUsage: {
      en: "usage: open <section> — try: ",
      es: "uso: open <sección> — probá: ",
    } satisfies L<string>,
    opening: { en: "opening", es: "abriendo" } satisfies L<string>,
    sudoPrompt: { en: "[sudo] password for visitor:", es: "[sudo] contraseña para visitante:" } satisfies L<string>,
    sudoCheck: {
      en: "verifying credentials with the ember council...",
      es: "verificando credenciales con el consejo de las brasas...",
    } satisfies L<string>,
    sudoGranted: { en: "ACCESS GRANTED", es: "ACCESO CONCEDIDO" } satisfies L<string>,
    sudoCta: {
      en: "Juani is open to full-time roles & freelance projects. Next step:",
      es: "Juani está abierto a posiciones full-time y proyectos freelance. Próximo paso:",
    } satisfies L<string>,
    sudoOther: {
      en: "visitor is not in the sudoers file. This incident will be reported (to nobody).",
      es: "visitante no está en el archivo sudoers. Este incidente será reportado (a nadie).",
    } satisfies L<string>,
    emailMe: { en: "email me", es: "escribime" } satisfies L<string>,
    ember: { en: "* the ember field flares up *", es: "* el campo de brasas se aviva *" } satisfies L<string>,
    play: { en: "launching skills breakout...", es: "iniciando skills breakout..." } satisfies L<string>,
    lang: { en: "switching locale → es", es: "cambiando idioma → en" } satisfies L<string>,
    achievementsTitle: { en: "secrets found", es: "secretos encontrados" } satisfies L<string>,
    rmrf: {
      en: "rm: refusing to burn down the portfolio. It took a while to build.",
      es: "rm: me niego a prender fuego el portfolio. Costó construirlo.",
    } satisfies L<string>,
    secrets: {
      en: "There are 8 secrets on this page. You've found",
      es: "Hay 8 secretos en esta página. Encontraste",
    } satisfies L<string>,
    notFound: { en: "command not found:", es: "comando no encontrado:" } satisfies L<string>,
    didYouMean: { en: "did you mean", es: "quisiste decir" } satisfies L<string>,
    noSuchFile: { en: "no such file or directory", es: "no existe el archivo o directorio" } satisfies L<string>,
    vim: {
      en: "Nice try. Nobody has ever left vim. Staying in the terminal instead.",
      es: "Buen intento. Nadie salió jamás de vim. Mejor quedate en la terminal.",
    } satisfies L<string>,
    coffee: {
      en: "Brewing... mate is ready. This is Argentina.",
      es: "Preparando... el mate está listo. Esto es Argentina.",
    } satisfies L<string>,
    konami: { en: "EMBER STORM", es: "TORMENTA DE BRASAS" } satisfies L<string>,
    konamiBody: {
      en: "You know the code. Respect.",
      es: "Te sabés el código. Respeto.",
    } satisfies L<string>,
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
