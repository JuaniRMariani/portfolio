import { profile, ui, tr, type Locale } from "@/content"
import { Annotation } from "@/components/editorial/annotation"

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto grid max-w-5xl gap-x-8 gap-y-3 px-4 py-7 sm:grid-cols-3">
        <p className="font-mono text-xs leading-relaxed text-muted-foreground">{tr(ui.footer.built, locale)}</p>
        <p className="sm:text-center">
          <Annotation>{tr(ui.footer.type, locale)}</Annotation>
        </p>
        <p className="font-mono text-xs text-muted-foreground sm:text-right">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  )
}
