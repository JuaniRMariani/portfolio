import type { Project } from "./types"

export const projects: Project[] = [
  {
    slug: "cuonti",
    name: "Cuonti",
    role: {
      en: "Co-creator & full-stack engineer",
      es: "Co-creador e ingeniero full-stack",
    },
    summary: {
      en: "Multi-tenant SaaS that automates Argentine tax compliance for accounting firms. In production with 50+ active clients and 150+ registered accounts.",
      es: "SaaS multi-tenant que automatiza el cumplimiento impositivo argentino para estudios contables. En producción con 50+ clientes activos y 150+ cuentas creadas.",
    },
    highlights: [
      {
        en: "Native integrations with ARCA (Argentina's federal tax agency): electronic invoicing and F.931 payroll-tax filing generation.",
        es: "Integraciones nativas con ARCA: facturación electrónica y generación de F.931.",
      },
      {
        en: "In-product AI assistant that lets accounting firms query and operate on their tax data.",
        es: "Asistente de IA integrado para que los estudios consulten y operen sobre sus datos impositivos.",
      },
      {
        en: "Multi-tenant architecture serving every firm from a single deployment.",
        es: "Arquitectura multi-tenant que sirve a todos los estudios desde un único deployment.",
      },
    ],
    stack: ["Laravel", "React", "MySQL"],
    status: "production",
    featured: true,
    metrics: [
      { value: "50+", label: { en: "active clients", es: "clientes activos" } },
      { value: "150+", label: { en: "registered accounts", es: "cuentas creadas" } },
    ],
  },
  {
    slug: "agro-bcs",
    name: "Agro BCS",
    role: {
      en: "Engineer — UNS & INTA research collaboration",
      es: "Ingeniero — colaboración de investigación UNS e INTA",
    },
    summary: {
      en: "Mobile app built with INTA researchers that estimates bovine body condition scores (BCS) from field photos, using image processing to replace manual visual scoring.",
      es: "App móvil construida con investigadores del INTA que estima la condición corporal bovina (BCS) a partir de fotos en el campo, usando procesamiento de imágenes en lugar del scoring visual manual.",
    },
    highlights: [
      {
        en: "Thesis project (with Ian Sebalt and Lucas Bazán), directed by Dr. Dana Urribarri and Dr. Martín Larrea, in collaboration with INTA.",
        es: "Proyecto de tesis (con Ian Sebalt y Lucas Bazán), dirigido por los Dres. Dana Urribarri y Martín Larrea, en colaboración con el INTA.",
      },
      {
        en: "Already in use on real farms in the region — works offline in the field.",
        es: "Ya en uso en campos reales de la región — funciona sin conexión en el campo.",
      },
      {
        en: "Covered by regional press and industry media.",
        es: "Con cobertura en prensa regional y medios del sector.",
      },
    ],
    stack: ["TypeScript", "Python"],
    links: {
      github: "https://github.com/JuaniRMariani/proyecto-agro_backend",
    },
    status: "public-repo",
    press: [
      {
        outlet: "La Brújula 24",
        title: {
          en: "Bahía Blanca students built an AI app that detects nutritional problems in cattle",
          es: "Estudiantes bahienses crearon una app con IA que detecta problemas nutricionales en el ganado",
        },
        url: "https://www.labrujula24.com/notas/2026/04/06/estudiantes-bahienses-crearon-una-app-con-ia-que-detecta-problemas-nutricionales-en-el-ganado-n493719/",
      },
      {
        outlet: "Vet Market",
        title: {
          en: "An app evaluates cattle body condition from a single photo",
          es: "Una app permite evaluar la condición corporal del ganado con solo una foto",
        },
        url: "https://vetmarketportal.com.ar/nota/4987/una-app-permite-evaluar-la-condicion-corporal-del-ganado-con-solo-una-foto/",
      },
    ],
  },
  {
    slug: "vps-infra",
    name: "Production VPS",
    role: {
      en: "Owner & operator",
      es: "Owner y operador",
    },
    summary: {
      en: "Self-managed Ubuntu VPS where my applications run in production: Nginx reverse proxy, Cloudflare in front, and deploy pipelines I built and operate myself.",
      es: "VPS Ubuntu autoadministrado donde corren mis aplicaciones en producción: reverse proxy Nginx, Cloudflare al frente y pipelines de deploy que armé y opero yo mismo.",
    },
    highlights: [
      {
        en: "Full ownership of the path from merge to production: server config, TLS, releases and rollbacks.",
        es: "Ownership completo del camino de merge a producción: configuración del server, TLS, releases y rollbacks.",
      },
    ],
    stack: ["Ubuntu", "Nginx", "Cloudflare", "CI/CD"],
    status: "internal",
  },
]
