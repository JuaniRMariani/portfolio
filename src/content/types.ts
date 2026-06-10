export type Locale = "en" | "es"

export const LOCALES = ["en", "es"] as const satisfies readonly Locale[]
export const DEFAULT_LOCALE: Locale = "en"

/** A field translated into every supported locale. */
export type L<T> = Record<Locale, T>

/** Resolve a translated field for a locale. */
export function tr<T>(field: L<T>, locale: Locale): T {
  return field[locale]
}

export interface Profile {
  name: string
  headline: L<string>
  status: L<string>
  location: string
  about: L<string>[]
  education: {
    degree: L<string>
    institution: string
    year: string
  }
  links: {
    github: string
    linkedin: string
    email: string
  }
}

export type ProjectStatus = "production" | "public-repo" | "internal"

export interface Project {
  slug: string
  name: string
  role: L<string>
  summary: L<string>
  highlights: L<string>[]
  stack: string[]
  links?: {
    github?: string
    live?: string
  }
  status: ProjectStatus
  featured?: boolean
  /** Verifiable media coverage. */
  press?: {
    outlet: string
    title: L<string>
    url: string
  }[]
  /** How the project renders as a terminal tool call, e.g. Task(cuonti). */
  terminal: {
    tool: string
    arg: string
  }
}

export interface Experience {
  company: string
  role: L<string>
  period: L<string>
  bullets: L<string>[]
  /** Decorative short hash for the git-log style rendering. */
  hash: string
}

export interface SkillGroup {
  id: string
  title: L<string>
  note: L<string>
  items: string[]
}

export interface AiPractice {
  title: L<string>
  detail: L<string>
}

export interface AiEngineering {
  intro: L<string>
  practices: AiPractice[]
  tools: { name: string; detail: L<string> }[]
}
