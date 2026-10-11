import { ui, tr, type Locale } from "@/content"
import { SectionShell } from "@/components/editorial/section-shell"
import { ServiceCards, type Service } from "./service-cards"

const SERVICES: Service[] = [
  {
    icon: "monitor",
    title: { en: "Custom Software & Web Platforms", es: "Software a Medida y Plataformas Web" },
    desc: {
      en: "End-to-end development of web apps, SaaS, and internal management systems that automate your business.",
      es: "Desarrollo de punta a punta de aplicaciones web, SaaS y sistemas de gestión interna que automatizan tu negocio.",
    },
    get: {
      en: "Scoping, build, deploy and handoff — one engineer, end to end.",
      es: "Relevamiento, desarrollo, deploy y traspaso — un solo ingeniero, de punta a punta.",
    },
  },
  {
    icon: "bot",
    title: { en: "AI Integration & Automation", es: "Integración de IA y Automatización" },
    desc: {
      en: "Integration of smart agents (Claude, Gemini) and WhatsApp bots to optimize customer support and operations.",
      es: "Integración de agentes inteligentes (Claude, Gemini) y bots de WhatsApp para optimizar la atención al cliente y las operaciones.",
    },
    get: {
      en: "Agents wired to your real data, with human review where it matters.",
      es: "Agentes conectados a tus datos reales, con revisión humana donde importa.",
    },
  },
  {
    icon: "server",
    title: { en: "Architecture & DevOps", es: "Arquitectura y DevOps" },
    desc: {
      en: "Software that doesn't go down. Complete management from codebase to production servers (Linux, Nginx).",
      es: "Software que no se cae. Gestión completa desde el código hasta los servidores en producción (Linux, Nginx).",
    },
    get: {
      en: "Linux + Nginx servers, automated deploys and a release process you can trust.",
      es: "Servidores Linux + Nginx, deploys automatizados y un proceso de release confiable.",
    },
  },
]

export function Services({ locale }: { locale: Locale }) {
  return (
    <SectionShell id="services" index="02" title={tr(ui.nav.services, locale)}>
      <ServiceCards services={SERVICES} locale={locale} />
    </SectionShell>
  )
}
