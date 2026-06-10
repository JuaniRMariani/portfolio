import Image from "next/image"
import { GraduationCap } from "lucide-react"
import { profile, tr, type Locale } from "@/content"
import { TerminalSection } from "@/components/terminal/terminal-section"
import { ToolCallCard } from "@/components/terminal/tool-call-card"

export function About({ locale }: { locale: Locale }) {
  return (
    <TerminalSection id="about" command="cat profile.md">
      <ToolCallCard tool="Read" arg="profile.md" defaultOpen>
        <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-start">
          <div className="space-y-4">
            {profile.about.map((paragraph, i) => (
              <p key={i} className="font-sans text-base leading-relaxed text-muted-foreground">
                {tr(paragraph, locale)}
              </p>
            ))}
            <p className="flex items-center gap-2 font-mono text-sm text-foreground">
              <GraduationCap className="size-4 shrink-0 text-primary" aria-hidden="true" />
              {tr(profile.education.degree, locale)} — {profile.education.institution} ({profile.education.year})
            </p>
          </div>
          <div className="shrink-0">
            <Image
              src="/images/Yo.jpg"
              alt={profile.name}
              width={160}
              height={160}
              className="size-32 rounded-lg border border-border object-cover sm:size-40"
            />
          </div>
        </div>
      </ToolCallCard>
    </TerminalSection>
  )
}
