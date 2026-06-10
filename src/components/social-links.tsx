import type React from "react"
import { Mail } from "lucide-react"
import { GitHubIcon, LinkedInIcon } from "./icons"
import { profile } from "@/content"

interface SocialLink {
  icon: React.ElementType
  href: string
  label: string
}

const SOCIAL_LINKS: SocialLink[] = [
  { icon: GitHubIcon, href: profile.links.github, label: "GitHub" },
  { icon: LinkedInIcon, href: profile.links.linkedin, label: "LinkedIn" },
  { icon: Mail, href: `mailto:${profile.links.email}`, label: "Email" },
]

export function SocialLinks() {
  return (
    <div className="flex items-center gap-2">
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex size-11 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          aria-label={link.label}
        >
          <link.icon size={18} />
        </a>
      ))}
    </div>
  )
}
