import { ExternalLink } from "lucide-react"
import { GitHubIcon } from "@/components/icons"
import { projects, ui, tr, type Locale, type Project } from "@/content"
import { SectionShell } from "@/components/editorial/section-shell"
import { Annotation } from "@/components/editorial/annotation"
import { Reveal } from "@/components/editorial/reveal"
import { PressCarousel } from "@/components/editorial/press-carousel"
import { cn } from "@/lib/utils"

const STATUS_LABELS: Record<Project["status"], Record<Locale, string>> = {
  production: { en: "In production", es: "En producción" },
  "public-repo": { en: "Public repo", es: "Repo público" },
  internal: { en: "Self-hosted", es: "Self-hosted" },
}

function ProjectLinks({ project, locale }: { project: Project; locale: Locale }) {
  if (!project.links) return null
  return (
    <div className="space-y-2 border-t border-hairline pt-4">
      {project.links?.github && (
        <a
          href={project.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <GitHubIcon size={14} />
          {project.links.github.replace("https://github.com/", "github.com/")}
        </a>
      )}
      {project.links?.live && (
        <a
          href={project.links.live}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <ExternalLink size={14} aria-hidden="true" />
          {locale === "en" ? "live" : "en vivo"}
        </a>
      )}
    </div>
  )
}

function ProjectCard({
  project,
  figure,
  locale,
}: {
  project: Project
  figure: string
  locale: Locale
}) {
  const featured = !!project.featured
  return (
    <article
      className={cn(
        "group relative flex flex-col gap-5 rounded-sm border border-border bg-card/40 p-6 transition-colors hover:border-primary/60 sm:p-8",
        featured && "border-t-2 border-t-primary",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <Annotation>
          {figure} — {STATUS_LABELS[project.status][locale]}
        </Annotation>
        {project.status === "production" && (
          <span className="status-pulse size-2 rounded-full bg-primary" aria-hidden="true" />
        )}
      </div>

      <div>
        <h3 className={cn("font-display font-bold text-foreground", featured ? "text-3xl sm:text-4xl" : "text-2xl")}>
          {project.name}
        </h3>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{tr(project.role, locale)}</p>
      </div>

      <p className="max-w-2xl font-sans text-base leading-relaxed text-foreground">{tr(project.summary, locale)}</p>

      {project.metrics && (
        <dl className="flex flex-wrap gap-x-10 gap-y-4 border-y border-hairline py-4">
          {project.metrics.map((metric) => (
            <div key={metric.value}>
              <dd className="font-display text-4xl font-extrabold text-primary sm:text-5xl">{metric.value}</dd>
              <dt className="mt-1">
                <Annotation>{tr(metric.label, locale)}</Annotation>
              </dt>
            </div>
          ))}
        </dl>
      )}

      <ul className="space-y-1.5">
        {project.highlights.map((highlight, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <span className="select-none font-mono text-primary/70" aria-hidden="true">
              —
            </span>
            <span className="font-sans leading-relaxed text-muted-foreground">{tr(highlight, locale)}</span>
          </li>
        ))}
      </ul>

      <ul className="flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded-sm border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground"
          >
            {tech}
          </li>
        ))}
      </ul>

      <ProjectLinks project={project} locale={locale} />
    </article>
  )
}

export function Projects({ locale }: { locale: Locale }) {
  const featured = projects.filter((project) => project.featured)
  const rest = projects.filter((project) => !project.featured)
  const pressItems = projects
    .flatMap((project) => project.press ?? [])
    .map((article) => ({ ...article, title: tr(article.title, locale) }))

  return (
    <SectionShell id="projects" index="03" title={tr(ui.nav.projects, locale)}>
      <div className="space-y-5">
        {featured.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.2}>
            <ProjectCard project={project} figure={`3.${i + 1}`} locale={locale} />
          </Reveal>
        ))}
        <div className="grid gap-5 lg:grid-cols-2">
          {rest.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.15}>
              <ProjectCard project={project} figure={`3.${featured.length + i + 1}`} locale={locale} />
            </Reveal>
          ))}
        </div>
      </div>

      {pressItems.length > 0 && (
        <div className="mt-12">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="flex items-baseline gap-3 font-display text-base font-bold text-foreground uppercase">
              <span className="font-mono text-xs font-bold text-primary" aria-hidden="true">
                3.{projects.length + 1}
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
