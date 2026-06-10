import type { Profile } from "./types"

export const profile: Profile = {
  name: "Juan Ignacio Rodríguez Mariani",
  headline: {
    en: "Information Systems Engineer · Full-stack & AI-augmented development",
    es: "Ingeniero en Sistemas de Información · Desarrollo full-stack potenciado con IA",
  },
  status: {
    en: "shipping Cuonti — 50+ active clients in production",
    es: "Cuonti en producción — 50+ clientes activos",
  },
  location: "Bahía Blanca, Argentina",
  about: [
    {
      en: "I build and operate production web platforms end to end: from API design to deployment and release management on Linux infrastructure I run myself. Information Systems Engineer, graduated from Universidad Nacional del Sur.",
      es: "Construyo y opero plataformas web en producción de punta a punta: desde el diseño de APIs hasta el deploy y los ciclos de release sobre infraestructura Linux que administro yo mismo. Ingeniero en Sistemas de Información, recibido en la Universidad Nacional del Sur.",
    },
    {
      en: "By day I work as a Software Engineer at NexoSmart (Laravel + Next.js). Alongside that, I co-created Cuonti, a multi-tenant tax-automation SaaS used in production by 50+ active clients. Agentic AI tooling — Claude Code in particular — is a core part of how I ship.",
      es: "Trabajo como Software Engineer en NexoSmart (Laravel + Next.js). En paralelo co-creé Cuonti, un SaaS multi-tenant de automatización impositiva usado en producción por 50+ clientes activos. Las herramientas de IA agéntica — especialmente Claude Code — son parte central de cómo construyo software.",
    },
  ],
  education: {
    degree: {
      en: "Information Systems Engineering",
      es: "Ingeniería en Sistemas de Información",
    },
    institution: "Universidad Nacional del Sur",
    year: "2026",
  },
  links: {
    github: "https://github.com/JuaniRMariani",
    linkedin: "https://www.linkedin.com/in/juan-ignacio-rodriguez-mariani/",
    email: "juanirmariani@gmail.com",
  },
}
