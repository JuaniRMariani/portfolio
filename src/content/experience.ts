import type { Experience } from "./types"

export const experience: Experience[] = [
  {
    company: "NexoSmart",
    role: {
      en: "Software Engineer",
      es: "Software Engineer",
    },
    period: {
      en: "Sep 2025 – present · Software Developer Intern Jun–Sep 2025",
      es: "Sep 2025 – presente · Pasante Jun–Sep 2025",
    },
    bullets: [
      {
        en: "Develop REST APIs in Laravel and frontend features in Next.js for client-facing products.",
        es: "Desarrollo APIs REST en Laravel y features de frontend en Next.js para productos de clientes.",
      },
      {
        en: "Reduced response times on the highest-traffic endpoints with database indexes and Laravel query caching.",
        es: "Reduje tiempos de respuesta en los endpoints de mayor tráfico con índices de base de datos y query caching de Laravel.",
      },
      {
        en: "Own server configuration, production deployments and release cycles on Linux with Nginx.",
        es: "Me encargo de la configuración de servidores, deploys a producción y ciclos de release en Linux con Nginx.",
      },
    ],
    hash: "a3f9c21",
  },
  {
    company: "Le Pas Sage",
    role: {
      en: "Freelance Full-stack Developer",
      es: "Desarrollador Full-stack Freelance",
    },
    period: {
      en: "2024 – 2025",
      es: "2024 – 2025",
    },
    bullets: [
      {
        en: "Built an e-commerce platform end to end: Laravel backend, Next.js storefront and payment integration.",
        es: "Construí una plataforma de e-commerce de punta a punta: backend Laravel, storefront Next.js e integración de pagos.",
      },
    ],
    hash: "7e0b4d8",
  },
]
