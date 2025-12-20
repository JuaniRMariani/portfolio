"use client"

import { SectionHeading } from "<Juan Ignacio>/components/section-heading"
import { cn } from "<Juan Ignacio>/lib/utils"
import { useState } from "react"


interface Job {
  company: string
  role: string
  period: string
  description: string[]
}

const JOBS: Job[] = [
  {
    company: "NexoSmart",
    role: "Software Engineer",
    period: "2025 — Presente",
    description: [
      "Resolución de problemas de manera proactiva, proponiendo soluciones innovadoras y eficientes.",
      "Desarrollo frontend con React/NextJS",
      "Desarrollo backend con Laravel PHP",
      "Trabajo con metodologías ágiles y estimación de tareas",
      "Trabajo en equipo, fomentando una comunicación efectiva y coordinada para alcanzar objetivos comunes",
    ],
  },
  {
    company: "Le Pas Sage",
    role: "Freelance Full Stack Developer",
    period: "2024 — 2025",
    description: [
      "Análisis y gestión de requerimientos.",
      "Desarrollo del frontend utilizando React",
      "Implementación del backend en Django",
      "Soporte técnico y capacitación básica",
      "Toma de decisiones en diseño, funcionalidad y arquitectura",
    ],
  },
]

export function Experience() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section id="experience" className="py-24 px-6 bg-card/50">
      <div className="mx-auto max-w-4xl">
        <SectionHeading number="02" title="Experiencia" />

        <div className="flex flex-col md:flex-row gap-8">
          {/* Tabs */}
          <div className="flex md:flex-col overflow-x-auto md:overflow-visible border-b md:border-b-0 md:border-l border-border">
            {JOBS.map((job, index) => (
              <button
                key={job.company}
                onClick={() => setActiveTab(index)}
                className={cn(
                  "px-4 py-3 text-sm font-mono whitespace-nowrap text-left transition-all",
                  "border-b-2 md:border-b-0 md:border-l-2 -mb-px md:mb-0 md:-ml-px",
                  activeTab === index
                    ? "text-primary border-primary bg-primary/5"
                    : "text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary/50",
                )}
              >
                {job.company}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 min-h-75">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xl font-medium text-foreground">
                {JOBS[activeTab].role} <span className="text-primary">@ {JOBS[activeTab].company}</span>
              </h3>              
            </div>
            <p className="text-sm font-mono text-muted-foreground mb-6">{JOBS[activeTab].period}</p>
            <ul className="space-y-4">
              {JOBS[activeTab].description.map((item, index) => (
                <li key={index} className="flex gap-3 text-muted-foreground">
                  <span className="text-primary mt-1.5">▹</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
