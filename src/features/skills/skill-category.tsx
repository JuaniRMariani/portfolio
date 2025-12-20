interface Skill {
  name: string
  level: number
}

interface SkillCategoryProps {
  title: string
  skills: Skill[]
}

export function SkillCategory({ title, skills }: SkillCategoryProps) {
  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-6">{title}</h3>
      <ul className="space-y-4">
        {skills.map((skill) => (
          <li key={skill.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">{skill.name}</span>
              <span className="text-primary font-mono">{skill.level}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
