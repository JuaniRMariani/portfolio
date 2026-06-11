import Image from "next/image"
import { profile, ui, tr, type Locale } from "@/content"
import { SectionShell } from "@/components/editorial/section-shell"
import { Annotation } from "@/components/editorial/annotation"

export function About({ locale }: { locale: Locale }) {
  return (
    <SectionShell id="about" index="01" title={tr(ui.nav.about, locale)}>
      <div className="flex flex-col-reverse gap-8 sm:flex-row sm:items-start sm:gap-10">
        <div className="flex-1 space-y-5">
          {profile.about.map((paragraph, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "font-sans text-lg leading-relaxed text-foreground"
                  : "font-sans text-base leading-relaxed text-muted-foreground"
              }
            >
              {tr(paragraph, locale)}
            </p>
          ))}
          <p className="border-l-2 border-primary pl-4 font-mono text-sm text-foreground">
            {tr(profile.education.degree, locale)} — {profile.education.institution} ({profile.education.year})
          </p>
        </div>
        <figure className="shrink-0">
          <Image
            src="/images/Yo.jpg"
            alt={profile.name}
            width={176}
            height={176}
            className="size-36 rounded-sm border border-border object-cover sm:size-44"
          />
          <figcaption className="mt-2">
            <Annotation>Fig. 01 — {profile.location}</Annotation>
          </figcaption>
        </figure>
      </div>
    </SectionShell>
  )
}
