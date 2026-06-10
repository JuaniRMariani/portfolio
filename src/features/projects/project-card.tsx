import { ExternalLink } from "lucide-react"
import { GitHubIcon } from "@/components/icons"
import { cn } from "@/lib/utils"
import { Project } from "./projects"

interface ProjectCardProps {
  project: Project
  isReversed?: boolean
}

export function ProjectCard({ project, isReversed = false }: ProjectCardProps) {
  return (
    <div className={cn("relative grid md:grid-cols-12 gap-4 items-center", isReversed && "md:text-right")}>
      {/* Image */}
      <div className={cn("md:col-span-7 relative group", isReversed ? "md:col-start-6" : "md:col-start-1")}>
        <a href={project.live || project.github} target="_blank" rel="noopener noreferrer">
          <div className="relative overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors z-10" />
            <img
              src={project.image || "/placeholder.svg"}
              alt={project.title}
              className="w-full aspect-video object-cover"
            />
          </div>
        </a>
      </div>

      {/* Content */}
      <div className={cn("md:col-span-6 md:absolute", isReversed ? "md:left-0" : "md:right-0")}>
        <p className="text-primary font-mono text-sm mb-2">Proyecto destacado</p>
        <h3 className="text-2xl font-bold text-foreground mb-4">{project.title}</h3>

        <div className="bg-card p-6 rounded-lg shadow-lg mb-4">
          <p className="text-muted-foreground">{project.description}</p>
        </div>

        <ul
          className={cn(
            "flex flex-wrap gap-3 mb-4 font-mono text-sm text-muted-foreground",
            isReversed && "md:justify-end",
          )}
        >
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        <div className={cn("flex gap-4", isReversed && "md:justify-end")}>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Ver código en GitHub"
            >
              <GitHubIcon size={20} />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-colors"
              aria-label="Ver proyecto en vivo"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
