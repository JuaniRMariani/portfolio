import type React from "react"
import { Mail } from "lucide-react"
import { GitHubIcon, LinkedInIcon } from "./icons"
import { Magnetic } from "./fx/magnetic"
import { profile } from "@/content"
import { cn } from "@/lib/utils"

interface SocialLink {
  icon: React.ComponentType<{ size?: number; className?: string }>
  href: string
  label: string
}

const SOCIAL_LINKS: SocialLink[] = [
  { icon: GitHubIcon, href: profile.links.github, label: "GitHub" },
  { icon: LinkedInIcon, href: profile.links.linkedin, label: "LinkedIn" },
  { icon: Mail, href: `mailto:${profile.links.email}`, label: "Email" },
]

/** Round glass icon links with a magnetic pull and an ember glow on hover. */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {SOCIAL_LINKS.map((link) => {
        const external = !link.href.startsWith("mailto:")
        return (
          <Magnetic key={link.label} strength={0.4}>
            <a
              href={link.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              aria-label={link.label}
              className="panel flex size-12 items-center justify-center rounded-full text-muted-foreground transition-[color,border-color,box-shadow] duration-300 hover:border-primary hover:text-primary hover:shadow-[0_0_0_1px_oklch(0.74_0.22_46/0.4),0_8px_30px_-6px_oklch(0.74_0.22_46/0.6)]"
            >
              <link.icon size={18} />
            </a>
          </Magnetic>
        )
      })}
    </div>
  )
}
