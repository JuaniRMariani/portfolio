import { SocialLinks } from "../social-links";

export function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl flex flex-col items-center gap-4">
        <SocialLinks />
        <p className="text-sm text-muted-foreground font-mono">
          Diseñado y desarrollado por <span className="text-primary">Juani</span>
        </p>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
