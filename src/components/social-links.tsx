import type React from "react"
import { Mail } from "lucide-react"
import { GitHubIcon, LinkedInIcon } from "./icons"

interface SocialLink {
  icon: React.ElementType
  href: string
  label: string
}

const SOCIAL_LINKS: SocialLink[] = [
  { icon: GitHubIcon, href: "https://github.com/JuaniRMariani", label: "GitHub" },
  { icon: LinkedInIcon, href: "https://www.linkedin.com/in/juan-ignacio-rodriguez-mariani/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:juanirmariani@gmail.com", label: "Email" },
]

export function SocialLinks() {
  return (
    <div className="flex items-center gap-4">
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-muted-foreground hover:text-primary transition-colors"
          aria-label={link.label}
        >
          <link.icon size={20} />
        </a>
      ))}
    </div>
  )
}
