"use client"

import { useEffect, useId, useRef } from "react"
import { motion, useInView } from "motion/react"
import { useAnimation } from "@/components/editorial/animation-context"
import { cn } from "@/lib/utils"

/**
 * Optional screen recordings per project slug, served from /public.
 * Empty by default: drop e.g. `public/media/cuonti.mp4` and add
 * `cuonti: "/media/cuonti.mp4"` here — the video then replaces the
 * generative mockup (muted, looped, only playing while in view).
 */
const PROJECT_MEDIA: Record<string, string> = {}

/** Decorative "screen" for a featured project: a recording if one exists, else a live mockup. */
export function ProjectScreen({ slug, className }: { slug: string; className?: string }) {
  const media = PROJECT_MEDIA[slug]
  return (
    <div aria-hidden="true" className={cn("relative", className)}>
      {media ? (
        <ProjectVideo src={media} />
      ) : slug === "cuonti" ? (
        <CuontiMockup />
      ) : slug === "food-partners" ? (
        <FoodPartnersMockup />
      ) : (
        <CuontiMockup />
      )}
    </div>
  )
}

function useLive<T extends Element>() {
  const ref = useRef<T>(null)
  const inView = useInView(ref, { amount: 0.2 })
  const { enabled } = useAnimation()
  return { ref, live: enabled && inView, enabled }
}

function ProjectVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const inView = useInView(ref, { amount: 0.25 })
  const { enabled } = useAnimation()

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (enabled && inView) video.play().catch(() => {})
    else video.pause()
  }, [enabled, inView])

  return (
    <Frame title={src.split("/").pop() ?? "recording"}>
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        tabIndex={-1}
        className="aspect-[16/10] w-full object-cover"
      />
    </Frame>
  )
}

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background/70 shadow-[0_30px_80px_-30px_oklch(0.74_0.22_46/0.45)]">
      <div className="flex items-center gap-2 border-b border-hairline px-3 py-2">
        <span className="size-2 rounded-full bg-coral/80" />
        <span className="size-2 rounded-full bg-amber/80" />
        <span className="size-2 rounded-full bg-frost/60" />
        <span className="ml-2 truncate rounded-full bg-muted px-3 py-0.5 font-mono text-[10px] tracking-[0.12em] text-muted-foreground">
          {title}
        </span>
      </div>
      {children}
    </div>
  )
}

/* ─── Cuonti: tax dashboard — bars filling, invoices getting their CAE ─── */

const BARS = [38, 52, 44, 61, 57, 70, 64, 78, 72, 86, 81, 94]
const INVOICES = ["A 0004-00012873", "B 0004-00012874", "A 0004-00012875", "C 0002-00000419"]

function CuontiMockup() {
  const { ref, live, enabled } = useLive<HTMLDivElement>()
  const loop = { repeat: Infinity, repeatType: "loop" as const }

  return (
    <div ref={ref}>
      <Frame title="cuonti.app / dashboard">
        <div className="grid grid-cols-[2.25rem_1fr] sm:grid-cols-[3rem_1fr]">
          {/* rail */}
          <div className="flex flex-col items-center gap-3 border-r border-hairline py-4">
            <span className="bg-ember size-5 rounded-md" />
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={cn("size-4 rounded", i === 0 ? "bg-primary/40" : "bg-muted")} />
            ))}
          </div>

          <div className="space-y-3 p-3 sm:p-4">
            {/* KPI tiles */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { k: "facturado", v: "$ 48.2M", c: "text-amber" },
                { k: "iva débito", v: "$ 8.4M", c: "text-primary" },
                { k: "f.931", v: "OK", c: "text-frost" },
              ].map((tile, i) => (
                <div key={tile.k} className="rounded-md border border-hairline bg-muted/40 p-2">
                  <p className="truncate font-mono text-[8px] tracking-[0.14em] text-muted-foreground uppercase sm:text-[9px]">
                    {tile.k}
                  </p>
                  <motion.p
                    className={cn("mt-1 font-display text-sm font-extrabold sm:text-lg", tile.c)}
                    animate={live ? { opacity: [0.55, 1, 1] } : { opacity: 1 }}
                    transition={live ? { duration: 3, delay: i * 0.4, ...loop } : { duration: 0 }}
                  >
                    {tile.v}
                  </motion.p>
                </div>
              ))}
            </div>

            {/* revenue bars */}
            <div className="relative rounded-md border border-hairline bg-muted/30 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="h-1.5 w-16 rounded bg-muted-foreground/30" />
                <span className="font-mono text-[8px] tracking-[0.14em] text-primary uppercase">+18.4%</span>
              </div>
              <div className="flex h-24 items-end gap-1 sm:h-28 sm:gap-1.5">
                {BARS.map((h, i) => (
                  <motion.span
                    key={i}
                    className={cn(
                      "flex-1 origin-bottom rounded-t-sm",
                      i === BARS.length - 1 ? "bg-ember" : "bg-gradient-to-t from-primary/25 to-primary/70",
                    )}
                    style={{ height: `${h}%` }}
                    animate={live ? { scaleY: [0.08, 1, 1, 0.08] } : { scaleY: 1 }}
                    transition={
                      live
                        ? { duration: 5, times: [0, 0.35, 0.85, 1], delay: i * 0.07, ease: [0.16, 1, 0.3, 1], ...loop }
                        : { duration: 0 }
                    }
                  />
                ))}
              </div>
              {/* scan line */}
              {enabled && (
                <motion.span
                  className="pointer-events-none absolute inset-y-2 w-px bg-amber/70 shadow-[0_0_12px_2px_oklch(0.84_0.17_75/0.5)]"
                  animate={live ? { left: ["4%", "96%", "4%"] } : { left: "70%" }}
                  transition={live ? { duration: 6, ease: "easeInOut", ...loop } : { duration: 0 }}
                />
              )}
            </div>

            {/* invoices receiving CAE */}
            <ul className="space-y-1.5">
              {INVOICES.map((inv, i) => (
                <li
                  key={inv}
                  className="flex items-center justify-between gap-2 rounded-md border border-hairline bg-muted/20 px-2 py-1.5"
                >
                  <span className="truncate font-mono text-[9px] text-muted-foreground sm:text-[10px]">{inv}</span>
                  <span className="relative inline-grid shrink-0 font-mono text-[8px] tracking-[0.12em] uppercase sm:text-[9px]">
                    <motion.span
                      className="col-start-1 row-start-1 rounded-full border border-border px-2 py-0.5 text-muted-foreground"
                      animate={live ? { opacity: [1, 1, 0, 0, 1] } : { opacity: 0 }}
                      transition={live ? { duration: 6, times: [0, 0.2 + i * 0.12, 0.25 + i * 0.12, 0.92, 1], ...loop } : { duration: 0 }}
                    >
                      pend.
                    </motion.span>
                    <motion.span
                      className="col-start-1 row-start-1 rounded-full bg-primary/20 px-2 py-0.5 text-primary"
                      animate={live ? { opacity: [0, 0, 1, 1, 0] } : { opacity: 1 }}
                      transition={live ? { duration: 6, times: [0, 0.2 + i * 0.12, 0.25 + i * 0.12, 0.92, 1], ...loop } : { duration: 0 }}
                    >
                      CAE ✓
                    </motion.span>
                  </span>
                </li>
              ))}
            </ul>

            {/* AI assistant */}
            <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-2 py-1.5">
              <span className="text-[10px] text-amber">✦</span>
              <span className="truncate font-mono text-[9px] text-foreground/80 sm:text-[10px]">
                IA · 4 comprobantes listos para declarar
              </span>
              <span className="ml-auto flex gap-0.5">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    className="size-1 rounded-full bg-amber"
                    animate={live ? { opacity: [0.2, 1, 0.2] } : { opacity: 0.6 }}
                    transition={live ? { duration: 1.2, delay: d * 0.2, ...loop } : { duration: 0 }}
                  />
                ))}
              </span>
            </div>
          </div>
        </div>
      </Frame>
    </div>
  )
}

/* ─── Food Partners: supply-chain flow + cold-storage inventory ─── */

const STAGES = [
  { x: 40, y: 70, label: "CAPTURA" },
  { x: 150, y: 40, label: "PLANTA" },
  { x: 260, y: 80, label: "−18°C" },
  { x: 360, y: 45, label: "EXPORT" },
]
const STOCK = [
  { name: "Langostino L1", pct: 82, tint: "bg-coral" },
  { name: "Langostino L2", pct: 64, tint: "bg-primary" },
  { name: "Centolla", pct: 41, tint: "bg-amber" },
  { name: "Cámara 03", pct: 91, tint: "bg-frost" },
]

function FoodPartnersMockup() {
  const { ref, live } = useLive<HTMLDivElement>()
  const id = useId().replace(/:/g, "")
  const pathId = `fp-flow-${id}`
  const flow = "M40 70 C 90 70, 100 40, 150 40 S 220 80, 260 80 S 320 45, 360 45"
  const loop = { repeat: Infinity, repeatType: "loop" as const }

  return (
    <div ref={ref}>
      <Frame title="food-partners / trazabilidad">
        <div className="space-y-3 p-3 sm:p-4">
          <div className="relative rounded-md border border-hairline bg-muted/30">
            <svg viewBox="0 0 400 120" className="h-auto w-full">
              <defs>
                <linearGradient id={`${pathId}-g`} x1="0" x2="1">
                  <stop offset="0%" stopColor="var(--amber)" />
                  <stop offset="55%" stopColor="var(--ember)" />
                  <stop offset="100%" stopColor="var(--frost)" />
                </linearGradient>
              </defs>
              <path id={pathId} d={flow} fill="none" stroke="var(--hairline)" strokeWidth="6" strokeLinecap="round" />
              <motion.path
                d={flow}
                fill="none"
                stroke={`url(#${pathId}-g)`}
                strokeWidth="2"
                strokeDasharray="6 10"
                animate={live ? { strokeDashoffset: [0, -64] } : { strokeDashoffset: 0 }}
                transition={live ? { duration: 1.6, ease: "linear", ...loop } : { duration: 0 }}
              />
              {live &&
                [0, 1, 2].map((p) => (
                  <circle key={p} r="4" fill="var(--amber)">
                    <animateMotion dur="4.5s" begin={`${p * 1.5}s`} repeatCount="indefinite" rotate="auto">
                      <mpath href={`#${pathId}`} />
                    </animateMotion>
                  </circle>
                ))}
              {STAGES.map((stage, i) => (
                <g key={stage.label}>
                  <circle
                    cx={stage.x}
                    cy={stage.y}
                    r="9"
                    fill="var(--background)"
                    stroke={i === 2 ? "var(--frost)" : "var(--ember)"}
                    strokeWidth="2"
                  />
                  <circle cx={stage.x} cy={stage.y} r="3" fill={i === 2 ? "var(--frost)" : "var(--ember)"} />
                  <text
                    x={stage.x}
                    y={stage.y + (stage.y < 60 ? -16 : 24)}
                    textAnchor="middle"
                    className="fill-muted-foreground font-mono"
                    fontSize="9"
                    letterSpacing="1.5"
                  >
                    {stage.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3">
            <ul className="space-y-2 rounded-md border border-hairline bg-muted/20 p-2.5">
              {STOCK.map((row, i) => (
                <li key={row.name} className="grid grid-cols-[minmax(0,5.5rem)_1fr_auto] items-center gap-2">
                  <span className="truncate font-mono text-[9px] text-muted-foreground sm:text-[10px]">{row.name}</span>
                  <span className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.span
                      className={cn("block h-full origin-left rounded-full", row.tint)}
                      style={{ width: `${row.pct}%` }}
                      animate={live ? { scaleX: [0.15, 1, 0.92, 1] } : { scaleX: 1 }}
                      transition={live ? { duration: 4, delay: i * 0.3, times: [0, 0.4, 0.7, 1], ...loop } : { duration: 0 }}
                    />
                  </span>
                  <span className="font-mono text-[9px] text-foreground/80">{row.pct}%</span>
                </li>
              ))}
            </ul>
            <div className="flex w-20 flex-col items-center justify-center rounded-md border border-frost/40 bg-frost/10 p-2 sm:w-24">
              <span className="font-mono text-[8px] tracking-[0.16em] text-frost uppercase">cámara</span>
              <motion.span
                className="font-display text-xl font-extrabold text-frost sm:text-2xl"
                animate={live ? { opacity: [1, 0.7, 1] } : { opacity: 1 }}
                transition={live ? { duration: 2.4, ...loop } : { duration: 0 }}
              >
                −18°
              </motion.span>
              <span className="font-mono text-[8px] tracking-[0.12em] text-muted-foreground uppercase">estable</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-md border border-primary/30 bg-primary/10 px-2 py-1.5">
            <span className="truncate font-mono text-[9px] text-foreground/80 sm:text-[10px]">
              Lote 2026-1043 · contenedor MSKU 77 · listo
            </span>
            <span className="status-pulse size-1.5 shrink-0 rounded-full bg-primary" />
          </div>
        </div>
      </Frame>
    </div>
  )
}
