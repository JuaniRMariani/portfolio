import { profile, ui, tr, type Locale } from "@/content"

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-3 px-4 py-6 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center">
        <p>
          <span className="text-term-green" aria-hidden="true">
            ⏺{" "}
          </span>
          {tr(ui.footer.built, locale)}
        </p>
        <p className="shrink-0">
          © {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  )
}
