import { SectionHeading } from "@/components/section-heading"
import { Mail } from "lucide-react"

export function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="mx-auto max-w-2xl text-center">
        <SectionHeading number="05" title="Contacto" />

        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          Actualmente estoy buscando nuevas oportunidades. Ya sea que tengas una pregunta, una propuesta de proyecto, o
          simplemente quieras saludar, ¡estaré encantado de responder!
        </p>

        <div className="flex flex-col items-center gap-4 mb-8">
          <p className="text-muted-foreground">
            <span className="font-medium">Ubicación:</span> Bahía Blanca, Buenos Aires
          </p>
          <p className="text-muted-foreground">
            <span className="font-medium">Teléfono:</span> (+54) 9 291 423 7634
          </p>
        </div>

        <a
          href="mailto:juanirmariani@gmail.com"
          className="inline-flex items-center gap-2 px-8 py-4 border-2 border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Mail size={20} />
          Envíame un mensaje
        </a>
      </div>
    </section>
  )
}
