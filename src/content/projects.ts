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
    slug: "food-partners",
    name: "Food Partners Patagonia",
    role: {
      en: "Lead Engineer — Xenova",
      es: "Lead Engineer — Xenova",
    },
    summary: {
      en: "Enterprise system for an integrated seafood exporter (red shrimp, king crab) facing international audits and demanding wholesale buyers.",
      es: "Sistema empresarial para un exportador integrado de productos del mar con auditorías internacionales y compradores mayoristas exigentes.",
    },
    highlights: [
      {
        en: "Built a custom ERP module to track inventory and export operations across the supply chain.",
        es: "Construí un módulo ERP a medida para rastrear inventario y operaciones de exportación en toda la cadena de suministro.",
      },
      {
        en: "Handled full-stack development from database schema to the final user interface.",
        es: "Lideré el desarrollo full-stack desde el esquema de base de datos hasta la interfaz de usuario.",
      },
    ],
    stack: ["React", "Laravel", "MySQL"],
    status: "production",
    featured: true,
  },
  {
    slug: "madryn-buceo",
    name: "Madryn Buceo",
    role: {
      en: "Full-stack Engineer — Xenova",
      es: "Ingeniero Full-stack — Xenova",
    },
    summary: {
      en: "Digital transformation for an adventure tourism operator, centralizing scattered bookings from manual channels into a single platform.",
      es: "Transformación digital para un operador de turismo de aventura, centralizando reservas dispersas de canales manuales en una sola plataforma.",
    },
    highlights: [
      {
        en: "Integrated secure payment processing (Stripe) and automated booking confirmations.",
        es: "Integración de pagos seguros (Stripe) y confirmaciones de reservas automatizadas.",
      },
      {
        en: "Developed a modern, responsive frontend with Next.js and a robust Node.js API.",
        es: "Desarrollé un frontend moderno y responsivo con Next.js y una API robusta en Node.js.",
      },
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
    status: "production",
    featured: false,
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
        outlet: "Infocampo",
        title: {
          en: "Just one photo and AI: three young engineers built an app that simplifies a key aspect of cattle management",
          es: "Solo una foto y la IA: tres jóvenes diseñaron una app que facilita el manejo de un aspecto clave en los bovinos",
        },
        url: "https://www.infocampo.com.ar/solo-una-foto-y-la-ia-tres-jovenes-disenaron-una-app-que-facilita-el-manejo-de-un-aspecto-clave-en-los-bovinos/",
        image: "/press/infocampo.jpg",
      },
      {
        outlet: "El Día",
        title: {
          en: "Bahía Blanca students create an AI app to assess cattle nutritional condition",
          es: "Estudiantes de Bahía Blanca crean una app con IA para evaluar estado nutricional del ganado",
        },
        url: "https://www.eldia.com/nota/2026-4-8-12-19-0-estudiantes-de-bahia-blanca-crean-una-app-con-ia-para-evaluar-estado-nutricional-del-ganado-politica-y-economia",
        image: "/press/eldia.jpg",
      },
      {
        outlet: "La Brújula 24",
        title: {
          en: "Bahía Blanca students built an AI app that detects nutritional problems in cattle",
          es: "Estudiantes bahienses crearon una app con IA que detecta problemas nutricionales en el ganado",
        },
        url: "https://www.labrujula24.com/notas/2026/04/06/estudiantes-bahienses-crearon-una-app-con-ia-que-detecta-problemas-nutricionales-en-el-ganado-n493719/",
        image: "/press/labrujula24.jpg",
      },
      {
        outlet: "Vet Market",
        title: {
          en: "An app evaluates cattle body condition from a single photo",
          es: "Una app permite evaluar la condición corporal del ganado con solo una foto",
        },
        url: "https://vetmarketportal.com.ar/nota/4987/una-app-permite-evaluar-la-condicion-corporal-del-ganado-con-solo-una-foto/",
        image: "/press/vetmarket.jpg",
      },
      {
        outlet: "Estación K2",
        title: {
          en: "Students built an app that identifies potential nutritional problems in cattle",
          es: "Estudiantes crearon una app que permite identificar posibles problemas nutricionales en el ganado",
        },
        url: "https://estacionk2.com/nota/181618/estudiantes-crearon-una-app-que-permite-identificar-posibles-problemas-nutricionales-en-el-ganado/",
        image: "/press/estacionk2.jpg",
      },
      {
        outlet: "Infobonaerenses",
        title: {
          en: "A student-built app aims to safeguard cattle feeding",
          es: "Una app creada por estudiantes apunta a cuidar la alimentación del ganado",
        },
        url: "https://infobonaerenses.com.ar/nota/43062/una-app-creada-por-estudiantes-apunta-a-cuidar-la-alimentacion-del-ganado/",
        image: "/press/infobonaerenses.jpg",
      },
      {
        outlet: "Ecos de la Ciudad",
        title: {
          en: "UNS: students create an app to evaluate cattle nutritional status",
          es: "UNS: estudiantes crean app que permite evaluar el estado nutricional del ganado",
        },
        url: "https://ecosdelaciudad.com.ar/2026/04/07/uns-estudiantes-crean-app-que-permite-evaluar-el-estado-nutricional-del-ganado/",
        image: "/press/ecosdelaciudad.jpg",
      },
      {
        outlet: "Enfoque U (UNS)",
        title: {
          en: "Students built an app that uses AI to detect nutritional problems in cattle",
          es: "Estudiantes crearon una app que usa IA para detectar problemas nutricionales en el ganado",
        },
        url: "https://www.enfoqueu.uns.edu.ar/estudiantes-crearon-una-app-que-usa-ia-para-detectar-problemas-nutricionales-en-el-ganado/",
        image: "/press/enfoqueu.jpg",
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
