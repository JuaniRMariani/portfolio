import { SectionHeading } from "<Juan Ignacio>/components/section-heading"
import { SkillCategory } from "./skill-category"


interface Skill {
  name: string
  level: number
}

interface SkillCategoryData {
  title: string
  skills: Skill[]
}

const SKILL_CATEGORIES: SkillCategoryData[] = [
  {
    title: "Lenguajes de Programación",
    skills: [
      { name: "Java", level: 90 },
      { name: "JavaScript", level: 85 },
      { name: "TypeScript", level: 80 },
      { name: "Python", level: 85 },
      { name: "C", level: 75 },
      { name: "Prolog", level: 70 },
      { name: "Kotlin", level: 70 },
      { name: "PHP", level: 75 },
      { name: "SQL", level: 80 },
    ],
  },
  {
    title: "Tecnologías Web",
    skills: [
      { name: "HTML", level: 90 },
      { name: "CSS", level: 90 },
      { name: "React", level: 85 },
      { name: "Next.js", level: 80 },
      { name: "Node.js", level: 80 },
      { name: "Django", level: 75 },
    ],
  },
  {
    title: "Herramientas y Sistemas",
    skills: [
      { name: "Git / GitHub", level: 85 },
      { name: "Testing Automatizado", level: 75 },
      { name: "Testing Manual", level: 75 },
      { name: "Windows", level: 80 },
      { name: "Linux", level: 75 },
      { name: "Máquinas Virtuales", level: 70 },
      { name: "Nginx", level: 70 },
    ],
  },
  {
    title: "Idiomas",
    skills: [
      { name: "Español", level: 100 },
      { name: "Inglés", level: 75 },
      { name: "Italiano", level: 25 },
    ],
  },
]

export function Skills() {
  return (
    <section id="skills" className="py-24 px-6 bg-card/50">
      <div className="mx-auto max-w-4xl">
        <SectionHeading number="04" title="Habilidades" />

        <div className="grid md:grid-cols-3 gap-8">
          {SKILL_CATEGORIES.map((category) => (
            <SkillCategory key={category.title} title={category.title} skills={category.skills} />
          ))}
        </div>
      </div>
    </section>
  )
}
