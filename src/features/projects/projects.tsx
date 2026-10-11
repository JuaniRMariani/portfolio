import { ArrowUpRight, ExternalLink } from "lucide-react"
import { GitHubIcon } from "@/components/icons"
import { projects, ui, tr, type Locale, type Project } from "@/content"
import { SectionShell } from "@/components/editorial/section-shell"
import { Annotation } from "@/components/editorial/annotation"
import { Reveal } from "@/components/editorial/reveal"
import { PressCarousel } from "@/components/editorial/press-carousel"
import { TiltCard } from "@/components/fx/tilt-card"
import { CountUp } from "@/components/fx/count-up"
import { cn } from "@/lib/utils"
import { ProjectScreen } from "./project-screen"

const STATUS_LABELS: Record<Project["status"], Record<Locale, string>> = {
  production: { en: "In production", es: "En producción" },
  "public-repo": { en: "Public repo", es: "Repo público" },
  internal: { en: "Self-hosted", es: "Self-hosted" },
}

function StatusPill({ status, locale }: { status: Project["status"]; locale: Locale }) {
  const live = status === "production"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.18em] uppercase",
        live ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-muted/40 text-muted-foreground",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", live ? "status-pulse bg-primary" : "bg-muted-foreground/60")}
      />
      {STATUS_LABELS[status][locale]}
    </span>
  )
}

function StackChips({ stack }: { stack: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {stack.map((tech) => (
        <li
          key={tech}
          className="rounded-full border border-border bg-background/40 px-3 py-1 font-mono text-[11px] text-muted-foreground"
        >
          {tech}
        </li>
      ))}
    </ul>
  )
}

function Highlights({ items, locale }: { items: Project["highlights"]; locale: Locale }) {
  return (
    <ul className="space-y-2">
      {items.map((highlight, i) => (
        <li key={i} className="flex gap-3 text-sm">
          <span className="mt-[0.55em] h-px w-4 shrink-0 bg-primary/70" aria-hidden="true" />
          <span className="font-sans leading-relaxed text-muted-foreground">{tr(highlight, locale)}</span>
        </li>
      ))}
    </ul>
  )
}

function ProjectLinks({ project, locale }: { project: Project; locale: Locale }) {
  if (!project.links?.github && !project.links?.live) return null
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-hairline pt-4">
      {project.links.github && (
        <a
          href={project.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="link-sweep inline-flex min-h-11 items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <GitHubIcon size={14} />
          {project.links.github.replace("https://github.com/", "github.com/")}
        </a>
      )}
      {project.links.live && (
        <a
          href={project.links.live}
          target="_blank"
          rel="noopener noreferrer"
          className="link-sweep inline-flex min-h-11 items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <ExternalLink size={14} aria-hidden="true" />
          {locale === "en" ? "live" : "en vivo"}
        </a>
      )}
    </div>
  )
}

function FeaturedProject({
  project,
  figure,
  flip,
  locale,
}: {
  project: Project
  figure: string
  flip: boolean
  locale: Locale
}) {
  return (
    <TiltCard
      as="article"
      max={2.5}
      className="panel ember-border grid gap-8 rounded-2xl p-5 sm:p-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12 lg:p-12"
    >
      <div className={cn("flex min-w-0 flex-col gap-6", flip && "lg:order-2")}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Annotation>{figure}</Annotation>
          <StatusPill status={project.status} locale={locale} />
        </div>

        <div>
          <h3 className="font-display text-[clamp(2.4rem,7vw,5.25rem)] leading-[0.85] font-extrabold tracking-tight break-words text-foreground uppercase">
            {project.name}
          </h3>
          <p className="mt-3 font-mono text-xs tracking-[0.1em] text-primary uppercase">{tr(project.role, locale)}</p>
        </div>

        <p className="max-w-xl font-sans text-base leading-relaxed text-foreground/90 sm:text-lg">
          {tr(project.summary, locale)}
        </p>

        {project.metrics && (
          <dl className="grid grid-cols-2 gap-6 border-y border-hairline py-5">
            {project.metrics.map((metric) => (
              <div key={metric.value} className="flex flex-col-reverse">
                <dt className="mt-2">
                  <Annotation>{tr(metric.label, locale)}</Annotation>
                </dt>
                <dd>
                  <CountUp
                    value={metric.value}
                    className="text-ember font-display text-[clamp(3.25rem,9vw,6.5rem)] leading-[0.85] font-extrabold tracking-tighter"
                  />
                </dd>
              </div>
            ))}
          </dl>
        )}

        <Highlights items={project.highlights} locale={locale} />
        <StackChips stack={project.stack} />
        <ProjectLinks project={project} locale={locale} />
      </div>

      <ProjectScreen
        slug={project.slug}
        className={cn("min-w-0 self-center", flip && "lg:order-1")}
      />
    </TiltCard>
  )
}

/* bento rhythm: wide + narrow, then a full-width row */
const BENTO_SPANS = ["lg:col-span-2", "lg:col-span-1", "lg:col-span-3"]

function BentoProject({ project, figure, locale }: { project: Project; figure: string; locale: Locale }) {
  return (
    <TiltCard
      as="article"
      max={5}
      className="panel ember-border group relative flex h-full flex-col gap-5 overflow-visible rounded-2xl p-6 sm:p-8"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-4 right-5 font-display text-6xl leading-none font-extrabold text-transparent opacity-40 transition-opacity duration-500 select-none [-webkit-text-stroke:1px_var(--ember)] group-hover:opacity-90"
      >
        {figure.split(".")[1]?.padStart(2, "0")}
      </span>

      <div className="flex flex-wrap items-center gap-3 pr-16">
        <Annotation>{figure}</Annotation>
        <StatusPill status={project.status} locale={locale} />
      </div>

      <div>
        <h3 className="flex items-start gap-2 font-display text-3xl leading-[0.9] font-extrabold tracking-tight text-foreground uppercase sm:text-4xl">
          <span className="min-w-0 break-words">{project.name}</span>
          <ArrowUpRight
            aria-hidden="true"
            className="mt-1 size-6 shrink-0 text-primary opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100 motion-reduce:transition-none"
          />
        </h3>
        <p className="mt-2 font-mono text-xs tracking-[0.1em] text-primary uppercase">{tr(project.role, locale)}</p>
      </div>

      <p className="font-sans text-base leading-relaxed text-foreground/90">{tr(project.summary, locale)}</p>

      {/* On hover-capable devices the details slide open on hover/focus; touch devices always show them. */}
      <div className="grid transition-[grid-template-rows,opacity] duration-500 ease-out-expo motion-reduce:transition-none [@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:opacity-50 [@media(hover:hover)]:group-focus-within:grid-rows-[1fr] [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:grid-rows-[1fr] [@media(hover:hover)]:group-hover:opacity-100">
        <div className="min-h-0 overflow-hidden">
          <Highlights items={project.highlights} locale={locale} />
        </div>
      </div>

      <div className="mt-auto space-y-4">
        <StackChips stack={project.stack} />
        <ProjectLinks project={project} locale={locale} />
      </div>
    </TiltCard>
  )
}

export function Projects({ locale }: { locale: Locale }) {
  const featured = projects.filter((project) => project.featured)
  const rest = projects.filter((project) => !project.featured)
  const pressItems = projects
    .flatMap((project) => project.press ?? [])
    .map((article) => ({ ...article, title: tr(article.title, locale) }))

  return (
    <SectionShell id="projects" index="04" title={tr(ui.nav.projects, locale)}>
      <div className="space-y-8 sm:space-y-12">
        {featured.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.15}>
            <FeaturedProject project={project} figure={`4.${i + 1}`} flip={i % 2 === 1} locale={locale} />
          </Reveal>
        ))}
      </div>

      {rest.length > 0 && (
        <div className="mt-8 grid gap-5 sm:mt-12 lg:grid-cols-3">
          {rest.map((project, i) => (
            <Reveal key={project.slug} delay={(i % 3) * 0.12} className={BENTO_SPANS[i % BENTO_SPANS.length]}>
              <BentoProject project={project} figure={`4.${featured.length + i + 1}`} locale={locale} />
            </Reveal>
          ))}
        </div>
      )}

      {pressItems.length > 0 && (
        <div className="mt-16">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="flex items-baseline gap-3 font-display text-xl font-extrabold tracking-tight text-foreground uppercase">
              <span className="font-mono text-xs font-bold text-primary" aria-hidden="true">
                4.{projects.length + 1}
              </span>
              {tr(ui.press.heading, locale)}
            </h3>
            <Annotation>{tr(ui.press.sub, locale)}</Annotation>
          </div>
          <PressCarousel
            items={pressItems}
            readLabel={tr(ui.press.readArticle, locale)}
            countLabel={`${pressItems.length.toString().padStart(2, "0")} ${locale === "en" ? "articles" : "notas"}`}
            prevLabel={tr(ui.press.prev, locale)}
            nextLabel={tr(ui.press.next, locale)}
          />
        </div>
      )}
    </SectionShell>
  )
}
