import Link from "next/link"
import { ArrowDown } from "lucide-react"
import { SocialLinks } from "./social-links"

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-4xl">
        <p className="text-primary font-mono text-sm mb-4">Hola, mi nombre es</p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 text-balance">Juan Ignacio Rodriguez Mariani</h1>
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-muted-foreground mb-6 text-balance">
          Estudiante de Ingeniería en Sistemas de Información.
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mb-8 leading-relaxed">
          Estudiante avanzado apasionado por la tecnología. Me destaco por mi capacidad de comunicación en entornos de
          equipo, basado en mi adaptabilidad y flexibilidad. Soy una persona disciplinada y tenaz, dispuesta a aprender
          y afrontar nuevos desafíos.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12">
          <Link
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Ver proyectos
          </Link>
          <SocialLinks />
        </div>

        <Link
          href="#about"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors animate-bounce"
          aria-label="Scroll to about section"
        >
          <ArrowDown size={20} />
        </Link>
      </div>
    </section>
  )
}
