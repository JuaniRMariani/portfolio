"use client"

import { motion, type TargetAndTransition } from "motion/react"
import { Bot, MonitorSmartphone, Server, type LucideIcon } from "lucide-react"
import { tr, type L, type Locale } from "@/content"
import { useAnimation } from "@/components/editorial/animation-context"
import { Annotation } from "@/components/editorial/annotation"
import { Reveal } from "@/components/editorial/reveal"
import { TiltCard } from "@/components/fx/tilt-card"

export interface Service {
  icon: "monitor" | "bot" | "server"
  title: L<string>
  desc: L<string>
  /** Deliverable line revealed on hover (always shown on touch). */
  get: L<string>
}

const ICONS: Record<Service["icon"], LucideIcon> = { monitor: MonitorSmartphone, bot: Bot, server: Server }

/* One subtle idle loop per icon so the three cards breathe out of phase. */
const LOOPS: Record<Service["icon"], TargetAndTransition> = {
  monitor: { y: [0, -3, 0], scale: [1, 1.06, 1] },
  bot: { rotate: [0, -10, 8, 0] },
  server: { scale: [1, 1.12, 1], opacity: [1, 0.75, 1] },
}

const WHAT_YOU_GET: L<string> = { en: "What you get", es: "Qué obtenés" }

export function ServiceCards({ services, locale }: { services: Service[]; locale: Locale }) {
  const { enabled } = useAnimation()

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {services.map((service, i) => {
        const Icon = ICONS[service.icon]
        const number = String(i + 1).padStart(2, "0")
        return (
          <Reveal key={service.icon} delay={i * 0.14} className="h-full">
            <TiltCard
              as="article"
              max={6}
              className="panel ember-border group flex h-full min-h-[24rem] flex-col rounded-xl p-7 sm:min-h-[27rem] sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="relative flex size-14 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/30 transition-[background,color,box-shadow] duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-[0_0_0_1px_oklch(0.74_0.22_46/0.5),0_10px_40px_-8px_oklch(0.74_0.22_46/0.7)]">
                  {enabled && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-lg border border-primary/60"
                      animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: i * 0.6 }}
                    />
                  )}
                  <motion.span
                    className="flex"
                    animate={enabled ? LOOPS[service.icon] : undefined}
                    transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
                  >
                    <Icon className="size-6" aria-hidden="true" />
                  </motion.span>
                </span>
                <span
                  aria-hidden="true"
                  className="font-display text-7xl leading-[0.8] font-extrabold tracking-tighter text-transparent opacity-50 transition-opacity duration-300 select-none [-webkit-text-stroke:1.5px_var(--ember)] group-hover:opacity-100"
                >
                  {number}
                </span>
              </div>

              <Annotation className="mt-auto pt-12 text-primary">{`// ${number} / 03`}</Annotation>
              <h3 className="mt-3 font-display text-2xl leading-[1.05] font-extrabold tracking-tight text-foreground uppercase">
                {tr(service.title, locale)}
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-muted-foreground">{tr(service.desc, locale)}</p>

              <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out-expo group-hover:grid-rows-[1fr] [@media(hover:none)]:grid-rows-[1fr]">
                <div className="overflow-hidden">
                  <p className="mt-5 border-t border-hairline pt-4 font-mono text-xs leading-relaxed text-amber">
                    <span className="mb-1 block text-[10px] tracking-[0.22em] text-primary uppercase">
                      {tr(WHAT_YOU_GET, locale)}
                    </span>
                    → {tr(service.get, locale)}
                  </p>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        )
      })}
    </div>
  )
}
