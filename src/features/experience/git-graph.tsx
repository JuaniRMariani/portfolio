"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useMotionValue, useScroll, useSpring, type MotionValue } from "motion/react"
import { experience, tr, type Locale } from "@/content"
import { useAnimation } from "@/components/editorial/animation-context"
import { Annotation } from "@/components/editorial/annotation"
import { Reveal } from "@/components/editorial/reveal"
import { TiltCard } from "@/components/fx/tilt-card"
import { cn } from "@/lib/utils"

type Lane = "main" | "branch"

/* Decorative git metadata, matched to `experience` by index (newest first). */
const GIT: { hash: string; lane: Lane; ref: string }[] = [
  { hash: "a3f9c1e", lane: "main", ref: "HEAD -> main" },
  { hash: "7d2b04f", lane: "branch", ref: "feat/xenova" },
  { hash: "e81c5a9", lane: "main", ref: "tag: v0.1-freelance" },
]

/* Geometry (CSS px). Desktop: graph column 148px wide, lanes at x=40 / x=100. */
const NODE_Y = 34
const LANE_X: Record<Lane, number> = { main: 40, branch: 100 }
const HEAD_Y = 30
const GRAPH_W = 148

/* Static class strings so Tailwind can see them. Node offset = laneX - list padding. */
const NODE_LEFT: Record<Lane, string> = {
  main: "left-[-28px] md:left-[-108px]",
  branch: "left-[-28px] md:left-[-48px]",
}

interface Geometry {
  h: number
  ys: number[]
}

function curve(x1: number, y1: number, x2: number, y2: number) {
  const my = (y1 + y2) / 2
  return `C ${x1} ${my} ${x2} ${my} ${x2} ${y2}`
}

function buildPaths({ h, ys }: Geometry) {
  const xm = LANE_X.main
  const xb = LANE_X.branch
  const tail = h - 18
  const main = `M ${xm} ${HEAD_Y} L ${xm} ${tail}`

  const branchIdx = ys.map((_, i) => i).filter((i) => (GIT[i]?.lane ?? "main") === "branch")
  if (branchIdx.length === 0) return { main, branch: null, tail }

  const first = ys[branchIdx[0]]
  const last = ys[branchIdx[branchIdx.length - 1]]
  const nextMain = ys.find((y, i) => i > branchIdx[branchIdx.length - 1] && (GIT[i]?.lane ?? "main") === "main")
  const forkEnd = (nextMain ?? tail) - 26
  const forkStart = Math.max(last + 30, forkEnd - 64)
  const mergeEnd = Math.min(HEAD_Y + 64, first - 30)

  const branch = [
    `M ${xm} ${HEAD_Y}`,
    curve(xm, HEAD_Y, xb, mergeEnd),
    `L ${xb} ${forkStart}`,
    curve(xb, forkStart, xm, forkEnd),
  ].join(" ")

  return { main, branch, tail, mergeEnd, forkStart }
}

export function GitGraph({ locale }: { locale: Locale }) {
  const { enabled } = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const [geom, setGeom] = useState<Geometry | null>(null)

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 75%", "end 55%"] })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })
  const full = useMotionValue(1)
  const progress = enabled ? smooth : full

  useEffect(() => {
    const container = containerRef.current
    const list = listRef.current
    if (!container || !list) return
    const measure = () => {
      const items = Array.from(list.children) as HTMLElement[]
      setGeom({ h: container.offsetHeight, ys: items.map((el) => el.offsetTop + NODE_Y) })
    }
    const ro = new ResizeObserver(measure)
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="relative">
      {/* mobile: single rail */}
      <div aria-hidden="true" className="absolute top-0 bottom-0 left-[11px] w-[2px] bg-hairline md:hidden">
        <motion.div
          className="h-full w-full origin-top"
          style={{
            scaleY: progress,
            background: "linear-gradient(to bottom, var(--amber), var(--ember) 50%, var(--coral))",
          }}
        />
      </div>

      {/* desktop: two-lane git graph */}
      {geom && <GraphSvg geom={geom} progress={progress} />}

      <ol ref={listRef} className="space-y-10 pl-10 md:space-y-14 md:pt-16 md:pl-[148px]">
        {experience.map((job, i) => (
          <JobCard key={job.company} index={i} locale={locale} />
        ))}
      </ol>
    </div>
  )
}

function GraphSvg({ geom, progress }: { geom: Geometry; progress: MotionValue<number> }) {
  const { main, branch, tail, mergeEnd, forkStart } = buildPaths(geom)
  const xm = LANE_X.main
  const xb = LANE_X.branch

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute top-0 left-0 hidden overflow-visible md:block"
      width={GRAPH_W}
      height={geom.h}
      viewBox={`0 0 ${GRAPH_W} ${geom.h}`}
    >
      <defs>
        <linearGradient id="gitgraph-ember" x1="0" y1="0" x2="0" y2={geom.h} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--amber)" />
          <stop offset="55%" stopColor="var(--ember)" />
          <stop offset="100%" stopColor="var(--coral)" />
        </linearGradient>
      </defs>

      {/* ghost track */}
      <g fill="none" stroke="var(--hairline)" strokeWidth={2} strokeLinecap="round">
        <path d={main} />
        {branch && <path d={branch} strokeDasharray="2 6" />}
      </g>

      {/* glow + drawn lanes */}
      <g fill="none" stroke="url(#gitgraph-ember)" strokeLinecap="round">
        <motion.path d={main} strokeWidth={7} opacity={0.18} style={{ pathLength: progress }} />
        <motion.path d={main} strokeWidth={2.5} style={{ pathLength: progress }} />
        {branch && (
          <>
            <motion.path d={branch} strokeWidth={7} opacity={0.18} style={{ pathLength: progress }} />
            <motion.path d={branch} strokeWidth={2.5} style={{ pathLength: progress }} />
          </>
        )}
      </g>

      {/* HEAD merge node + root */}
      <circle cx={xm} cy={HEAD_Y} r={7} fill="var(--background)" stroke="var(--amber)" strokeWidth={2.5} />
      <circle cx={xm} cy={HEAD_Y} r={2.5} fill="var(--amber)" />
      <text x={xm + 14} y={HEAD_Y - 10} className="fill-amber font-mono text-[10px] tracking-[0.18em] uppercase">
        HEAD
      </text>
      <circle cx={xm} cy={tail} r={4} fill="var(--background)" stroke="var(--border)" strokeWidth={2} />
      <text x={xm + 12} y={tail + 3} className="fill-muted-foreground font-mono text-[10px] tracking-[0.18em]">
        init
      </text>

      {/* lane labels */}
      <text
        transform={`translate(${xm - 16} ${HEAD_Y + 120}) rotate(-90)`}
        textAnchor="end"
        className="fill-muted-foreground font-mono text-[10px] tracking-[0.22em] uppercase"
      >
        main
      </text>
      {branch && mergeEnd !== undefined && forkStart !== undefined && (
        <text
          transform={`translate(${xb + 16} ${(mergeEnd + forkStart) / 2}) rotate(90)`}
          textAnchor="middle"
          className="fill-primary font-mono text-[10px] tracking-[0.22em]"
        >
          feat/xenova · parallel
        </text>
      )}
    </svg>
  )
}

function JobCard({ index, locale }: { index: number; locale: Locale }) {
  const job = experience[index]
  const git = GIT[index] ?? { hash: "0000000", lane: "main" as const, ref: "main" }
  const { enabled } = useAnimation()
  const ref = useRef<HTMLLIElement>(null)
  const centered = useInView(ref, { margin: "-45% 0px -45% 0px" })
  const passed = useInView(ref, { once: true, margin: "0px 0px -50% 0px" })
  const lit = !enabled || passed
  const active = enabled && centered

  return (
    <li ref={ref} className="relative">
      <CommitNode lane={git.lane} lit={lit} active={active} animate={enabled} />

      <Reveal>
        <TiltCard as="article" max={4} className="rounded-lg">
          <div
            data-active={active}
            className={cn(
              "panel ember-border rounded-lg p-5 transition-shadow duration-500 sm:p-7",
              active && "shadow-[0_30px_80px_-40px_oklch(0.74_0.22_46/0.6)]",
            )}
          >
            <p
              aria-hidden="true"
              className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] tracking-wider text-muted-foreground"
            >
              <span className="text-amber">commit {git.hash}</span>
              <span className={cn("rounded-sm border px-1.5 py-px", git.lane === "branch" ? "border-primary/50 text-primary" : "border-border")}>
                {git.ref}
              </span>
            </p>
            <h3 className="mt-3 font-display text-[clamp(1.6rem,4vw,2.4rem)] leading-none font-extrabold tracking-tight text-foreground uppercase">
              {job.company}
            </h3>
            <p className="mt-2 font-mono text-sm text-primary">{tr(job.role, locale)}</p>
            <p className="mt-2">
              <Annotation>{tr(job.period, locale)}</Annotation>
            </p>
            <ul className="mt-5 space-y-2.5 border-t border-hairline pt-5">
              {job.bullets.map((bullet, b) => (
                <li key={b} className="flex gap-3 text-sm">
                  <span className="font-mono text-primary/70 select-none" aria-hidden="true">
                    +
                  </span>
                  <span className="font-sans leading-relaxed text-muted-foreground">{tr(bullet, locale)}</span>
                </li>
              ))}
            </ul>
          </div>
        </TiltCard>
      </Reveal>
    </li>
  )
}

function CommitNode({ lane, lit, active, animate }: { lane: Lane; lit: boolean; active: boolean; animate: boolean }) {
  return (
    <motion.span
      aria-hidden="true"
      className={cn("absolute z-10 grid size-[18px] -translate-x-1/2 -translate-y-1/2 place-items-center", NODE_LEFT[lane])}
      style={{ top: NODE_Y }}
      animate={{ scale: active ? 1.35 : 1 }}
      transition={animate ? { type: "spring", stiffness: 300, damping: 16 } : { duration: 0 }}
    >
      {/* ignition burst (plays once when lit) */}
      {animate && (
        <motion.span
          className="absolute inset-0 rounded-full bg-primary"
          initial={false}
          animate={lit ? { scale: [0.6, 3.2], opacity: [0.8, 0] } : { scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      )}
      {/* ping while centered */}
      {active && (
        <motion.span
          className="absolute inset-0 rounded-full border border-primary"
          animate={{ scale: [1, 2.4], opacity: [0.7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      <span
        className={cn(
          "relative size-full rounded-full border-2 transition-[background-color,border-color,box-shadow] duration-500",
          lit
            ? "border-amber bg-primary shadow-[0_0_18px_4px_oklch(0.74_0.22_46/0.55)]"
            : "border-border bg-background",
        )}
      />
    </motion.span>
  )
}
