import { SectionHeading } from "../../components/section-heading"
import { ProjectCard } from "./project-card"


export interface Project {
  title: string
  description: string
  image: string
  tags: string[]
  github?: string
  live?: string
}

const PROJECTS: Project[] = [
  {
    title: "Sistema de Gestión Médica",
    description:
      "Plataforma completa para la administración de pacientes, turnos y profesionales médicos. Desarrollada aplicando metodologías ágiles para una gestión eficiente.",
    image: "/modern-ecommerce-dashboard-dark-theme.png",
    tags: ["Metodologías Ágiles", "Gestión Médica", "Web"],
  },
  {
    title: "Visualización de Datos Fórmula 1",
    description:
      "Aplicación web y de escritorio para visualizar datos de Fórmula 1. Integración con API FastF1, utilizando React, Electron y Pandas para análisis de datos.",
    image: "/task-management-app-kanban-board-dark-theme.jpg",
    tags: ["React", "Electron", "Pandas", "FastF1 API"],
  },
  {
    title: "Juego 2248",
    description:
      "Juego 2248 desarrollado utilizando Prolog para la lógica y React para la interfaz de usuario. Implementación de mecánicas de juego interactivas.",
    image: "/ai-content-generator-interface-dark-theme-blue-acc.jpg",
    tags: ["Prolog", "React", "Juegos"],
  },
  {
    title: "Plants vs Zombies",
    description:
      "Versión del juego Plants vs Zombies implementada en Java, aplicando patrones de diseño y gestión avanzada de eventos para una experiencia de juego fluida.",
    image: "/modern-ecommerce-dashboard-dark-theme.png",
    tags: ["Java", "Patrones de Diseño", "Gestión de Eventos"],
  },
  {
    title: "Snake Game",
    description:
      "Clásico juego Snake desarrollado en Java, aplicando principios de Programación Orientada a Objetos y estructuras de datos eficientes.",
    image: "/task-management-app-kanban-board-dark-theme.jpg",
    tags: ["Java", "POO", "Estructuras de Datos"],
  },
]

export function Projects() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="mx-auto max-w-5xl">
        <SectionHeading number="03" title="Proyectos destacados" />

        <div className="space-y-24">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.title} project={project} isReversed={index % 2 !== 0} />
          ))}
        </div>
      </div>
    </section>
  )
}
