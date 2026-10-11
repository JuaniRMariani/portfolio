"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { useAnimation } from "@/components/editorial/animation-context"

gsap.registerPlugin(ScrollTrigger, useGSAP)

/* Each word blends from a dim navy-grey to its final colour by --p (0..1).
   --p defaults to 1, so SSR / reduced motion render the finished state. */
const DIM = "oklch(0.5 0.05 258)"
const mix = (to: string) => `color-mix(in srgb, ${to} calc(var(--p, 1) * 100%), ${DIM})`
const NORMAL = mix("var(--foreground)")
const ACCENT = mix("var(--primary)")

const normalize = (word: string) => word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "")

/**
 * Lead paragraph whose words light up one by one as it scrolls through
 * the viewport (GSAP ScrollTrigger scrub). Text is plain DOM throughout.
 */
export function ScrubLead({ text, accents = [], className }: { text: string; accents?: string[]; className?: string }) {
  const { enabled } = useAnimation()
  const ref = useRef<HTMLParagraphElement>(null)
  const accentSet = new Set(accents.map(normalize))

  useGSAP(
    () => {
      if (!enabled || !ref.current) return
      gsap.fromTo(
        ref.current.querySelectorAll("[data-word]"),
        { "--p": 0 },
        {
          "--p": 1,
          ease: "none",
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: "top 82%", end: "bottom 45%", scrub: 0.6 },
        },
      )
    },
    { scope: ref, dependencies: [enabled], revertOnUpdate: true },
  )

  return (
    <p ref={ref} className={className}>
      {text.split(/(\s+)/).map((part, i) =>
        /^\s+$/.test(part) ? (
          part
        ) : (
          <span key={i} data-word="" style={{ color: accentSet.has(normalize(part)) ? ACCENT : NORMAL }}>
            {part}
          </span>
        ),
      )}
    </p>
  )
}
