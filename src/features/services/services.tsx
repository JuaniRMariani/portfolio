import { ui, tr, type Locale } from "@/content"
import { SectionShell } from "@/components/editorial/section-shell"
import { Reveal } from "@/components/editorial/reveal"
import { MonitorSmartphone, Bot, Server } from "lucide-react"

const SERVICES = [
  {
    icon: MonitorSmartphone,
    title: { en: "Custom Software & Web Platforms", es: "Software a Medida y Plataformas Web" },
    desc: {
      en: "End-to-end development of web apps, SaaS, and internal management systems that automate your business.",
      es: "Desarrollo de punta a punta de aplicaciones web, SaaS y sistemas de gestión interna que automatizan tu negocio.",
    },
  },
  {
    icon: Bot,
    title: { en: "AI Integration & Automation", es: "Integración de IA y Automatización" },
    desc: {
      en: "Integration of smart agents (Claude, Gemini) and WhatsApp bots to optimize customer support and operations.",
      es: "Integración de agentes inteligentes (Claude, Gemini) y bots de WhatsApp para optimizar la atención al cliente y las operaciones.",
    },
  },
  {
    icon: Server,
    title: { en: "Architecture & DevOps", es: "Arquitectura y DevOps" },
    desc: {
      en: "Software that doesn't go down. Complete management from codebase to production servers (Linux, Nginx).",
      es: "Software que no se cae. Gestión completa desde el código hasta los servidores en producción (Linux, Nginx).",
    },
  },
]

export function Services({ locale }: { locale: Locale }) {
  return (
    <SectionShell id="services" index="02" title={tr(ui.nav.services, locale)}>
      <div className="grid gap-5 sm:grid-cols-3">
        {SERVICES.map((service, i) => {
          const Icon = service.icon
          return (
            <Reveal key={i} delay={i * 0.15}>
              <div
                className="group relative flex flex-col gap-4 rounded-sm border border-border bg-card/40 p-6 transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_oklch(0.72_0.19_50/0.3)] hover:border-primary/60"
              >
                <div className="flex size-10 items-center justify-center rounded-sm bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground text-lg mb-2">
                    {tr(service.title, locale)}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-muted-foreground">
                    {tr(service.desc, locale)}
                  </p>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </SectionShell>
  )
}
