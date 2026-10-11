"use client"

import { useEffect, useRef, useState } from "react"
import { aiEngineering, tr, type Locale } from "@/content"
import { useAnimation } from "@/components/editorial/animation-context"
import { Annotation } from "@/components/editorial/annotation"
import { Reveal } from "@/components/editorial/reveal"
import { cn } from "@/lib/utils"

/* Agent label per practice (same order as aiEngineering.practices). Decorative. */
const AGENTS = ["agent:planner", "skill:/review", "mcp:servers", "verify:ci"]

const T = {
  hint: { en: "hover a node or a card", es: "pasá el mouse por un nodo o tarjeta" },
  processes: { en: "active processes", es: "procesos activos" },
  status: { en: "status", es: "estado" },
  role: { en: "role", es: "rol" },
  running: { en: "running", es: "activo" },
  serving: { en: "serving", es: "sirviendo" },
}

/* Diagram geometry in viewBox units. */
const SIZE = 400
const C = SIZE / 2
const ORBIT = 138
const BASE_ANGLES = [-135, -45, 45, 135].map((d) => (d * Math.PI) / 180)
/** Full revolution period (ms). */
const PERIOD = 90_000
const PULSE_MS = 2200

function pos(i: number, rot: number) {
  const a = BASE_ANGLES[i] + rot
  return { x: C + Math.cos(a) * ORBIT, y: C + Math.sin(a) * ORBIT }
}

export function Orchestration({ locale }: { locale: Locale }) {
  const [active, setActive] = useState<number | null>(null)
  const practices = aiEngineering.practices

  return (
    <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
      <div className="lg:sticky lg:top-24">
        <Diagram active={active} onActive={setActive} />
        <p aria-hidden="true" className="mt-3 text-center">
          <Annotation className="hidden text-[10px] lg:inline">{tr(T.hint, locale)}</Annotation>
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {practices.map((practice, i) => (
          <li key={practice.title.en}>
            <Reveal delay={i * 0.08} className="h-full">
              <article
                tabIndex={0}
                data-active={active === i}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className={cn(
                  "panel ember-border h-full rounded-lg p-5 transition-transform duration-300 outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:p-6",
                  active === i && "-translate-y-1",
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <Annotation className="text-primary">5.{i + 1}</Annotation>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "rounded-sm border px-1.5 py-px font-mono text-[10px] tracking-wider transition-colors",
                      active === i ? "border-primary/70 text-primary" : "border-border text-muted-foreground",
                    )}
                  >
                    {AGENTS[i] ?? "agent"}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl leading-tight font-extrabold tracking-tight text-foreground uppercase">
                  {tr(practice.title, locale)}
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">{tr(practice.detail, locale)}</p>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Diagram({ active, onActive }: { active: number | null; onActive: (i: number | null) => void }) {
  const { enabled } = useAnimation()
  const wrapRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<(SVGGElement | null)[]>([])
  const edgeRefs = useRef<(SVGLineElement | null)[]>([])
  const outRefs = useRef<(SVGCircleElement | null)[]>([])
  const inRefs = useRef<(SVGCircleElement | null)[]>([])
  const coreRef = useRef<SVGCircleElement>(null)
  const activeRef = useRef<number | null>(active)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!enabled || !wrap) return
    let raf = 0
    let visible = false
    let last = performance.now()
    let elapsed = 0

    const frame = (now: number) => {
      elapsed += Math.min(now - last, 64)
      last = now
      const rot = (elapsed / PERIOD) * Math.PI * 2
      for (let i = 0; i < BASE_ANGLES.length; i++) {
        const p = pos(i, rot)
        nodeRefs.current[i]?.setAttribute("transform", `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`)
        const edge = edgeRefs.current[i]
        edge?.setAttribute("x2", p.x.toFixed(2))
        edge?.setAttribute("y2", p.y.toFixed(2))
        const speed = activeRef.current === i ? 2.2 : 1
        const t = ((elapsed * speed) / PULSE_MS + i * 0.27) % 1
        const tIn = ((elapsed * speed) / PULSE_MS + i * 0.27 + 0.5) % 1
        const out = outRefs.current[i]
        const back = inRefs.current[i]
        // dispatch: core → agent; result: agent → core
        out?.setAttribute("cx", (C + (p.x - C) * t).toFixed(2))
        out?.setAttribute("cy", (C + (p.y - C) * t).toFixed(2))
        out?.setAttribute("opacity", Math.sin(t * Math.PI).toFixed(2))
        back?.setAttribute("cx", (p.x + (C - p.x) * tIn).toFixed(2))
        back?.setAttribute("cy", (p.y + (C - p.y) * tIn).toFixed(2))
        back?.setAttribute("opacity", (Math.sin(tIn * Math.PI) * 0.85).toFixed(2))
      }
      coreRef.current?.setAttribute("r", (62 + Math.sin(elapsed / 700) * 5).toFixed(2))
      raf = requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver(([entry]) => {
      const next = entry.isIntersecting
      if (next === visible) return
      visible = next
      if (visible) {
        last = performance.now()
        raf = requestAnimationFrame(frame)
      } else {
        cancelAnimationFrame(raf)
      }
    })
    io.observe(wrap)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  return (
    <div ref={wrapRef} className="relative mx-auto aspect-square w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[480px]">
      <svg aria-hidden="true" viewBox={`0 0 ${SIZE} ${SIZE}`} className="size-full overflow-visible">
        <defs>
          <radialGradient id="orch-core">
            <stop offset="0%" stopColor="var(--amber)" stopOpacity="0.55" />
            <stop offset="45%" stopColor="var(--ember)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--ember)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="orch-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--amber)" />
            <stop offset="50%" stopColor="var(--ember)" />
            <stop offset="100%" stopColor="var(--coral)" />
          </linearGradient>
        </defs>

        {/* orbit guides */}
        <circle cx={C} cy={C} r={ORBIT} fill="none" stroke="var(--hairline)" strokeDasharray="2 7" />
        <circle cx={C} cy={C} r={ORBIT + 34} fill="none" stroke="var(--hairline)" strokeOpacity={0.5} />
        <circle cx={C} cy={C} r={ORBIT - 52} fill="none" stroke="var(--hairline)" strokeOpacity={0.5} strokeDasharray="1 5" />
        {[0, 90, 180, 270].map((d) => (
          <line
            key={d}
            x1={C}
            y1={C - ORBIT - 44}
            x2={C}
            y2={C - ORBIT - 30}
            stroke="var(--border)"
            transform={`rotate(${d} ${C} ${C})`}
          />
        ))}

        {/* edges + pulses */}
        {BASE_ANGLES.map((_, i) => {
          const p = pos(i, 0)
          const on = active === i
          const dim = active !== null && !on
          return (
            <g key={i}>
              <line
                ref={(el) => {
                  edgeRefs.current[i] = el
                }}
                x1={C}
                y1={C}
                x2={p.x}
                y2={p.y}
                stroke={on ? "var(--ember)" : "var(--border)"}
                strokeWidth={on ? 2.5 : 1.25}
                strokeOpacity={dim ? 0.35 : 1}
                strokeDasharray={on ? undefined : "4 5"}
                style={{ transition: "stroke-opacity .3s, stroke-width .3s" }}
              />
              {enabled && (
                <>
                  <circle
                    ref={(el) => {
                      outRefs.current[i] = el
                    }}
                    r={on ? 4.5 : 3}
                    cx={C}
                    cy={C}
                    opacity={0}
                    fill="var(--amber)"
                  />
                  <circle
                    ref={(el) => {
                      inRefs.current[i] = el
                    }}
                    r={2.5}
                    cx={p.x}
                    cy={p.y}
                    opacity={0}
                    fill="var(--frost)"
                  />
                </>
              )}
            </g>
          )
        })}

        {/* core */}
        <circle ref={coreRef} cx={C} cy={C} r={62} fill="url(#orch-core)" />
        <circle cx={C} cy={C} r={40} fill="var(--background)" stroke="url(#orch-ring)" strokeWidth={2} />
        <circle
          cx={C}
          cy={C}
          r={48}
          fill="none"
          stroke="var(--ember)"
          strokeOpacity={0.5}
          strokeDasharray="3 6"
          className={enabled ? "origin-center animate-[spin_24s_linear_infinite] [transform-box:fill-box]" : undefined}
        />
        <text x={C} y={C - 3} textAnchor="middle" className="fill-foreground font-display text-[13px] font-extrabold tracking-tight uppercase">
          Claude
        </text>
        <text x={C} y={C + 12} textAnchor="middle" className="fill-primary font-mono text-[9px] tracking-[0.22em] uppercase">
          code
        </text>

        {/* agent nodes */}
        {BASE_ANGLES.map((_, i) => {
          const p = pos(i, 0)
          const on = active === i
          const dim = active !== null && !on
          return (
            <g
              key={i}
              ref={(el) => {
                nodeRefs.current[i] = el
              }}
              transform={`translate(${p.x} ${p.y})`}
              onPointerEnter={() => onActive(i)}
              onPointerLeave={() => onActive(null)}
              className="cursor-pointer"
              style={{ opacity: dim ? 0.45 : 1, transition: "opacity .3s" }}
            >
              {/* generous hit area */}
              <circle r={30} fill="transparent" />
              {on && <circle r={26} fill="url(#orch-core)" />}
              <circle
                r={on ? 15 : 12}
                fill={on ? "var(--primary)" : "var(--background)"}
                stroke={on ? "var(--amber)" : "var(--ember)"}
                strokeWidth={2}
                style={{ transition: "r .3s, fill .3s" }}
              />
              <text
                y={4}
                textAnchor="middle"
                className={cn("font-mono text-[10px] font-bold", on ? "fill-primary-foreground" : "fill-primary")}
              >
                {i + 1}
              </text>
              <text
                y={32}
                textAnchor="middle"
                className={cn("font-mono text-[10px] tracking-wider", on ? "fill-amber" : "fill-muted-foreground")}
              >
                {AGENTS[i]}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function ProcessList({ locale }: { locale: Locale }) {
  const tools = aiEngineering.tools
  return (
    <Reveal className="mt-12">
      <div className="panel overflow-hidden rounded-lg">
        <div className="flex items-center gap-2 border-b border-hairline px-4 py-3" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-coral/80" />
          <span className="size-2.5 rounded-full bg-amber/80" />
          <span className="size-2.5 rounded-full bg-frost/70" />
          <span className="ml-3 font-mono text-[11px] tracking-wider text-muted-foreground">
            ~/juani $ ps --agents · {tr(T.processes, locale)}
          </span>
        </div>
        <div
          aria-hidden="true"
          className="hidden grid-cols-[4rem_10rem_7rem_1fr] gap-4 border-b border-hairline px-4 py-2 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase sm:grid"
        >
          <span>pid</span>
          <span>process</span>
          <span>{tr(T.status, locale)}</span>
          <span>{tr(T.role, locale)}</span>
        </div>
        <ul>
          {tools.map((tool, i) => {
            const primary = i === 0
            const serving = i === tools.length - 1 && tools.length > 2
            return (
              <li
                key={tool.name}
                className="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-1 border-b border-hairline/60 px-4 py-4 last:border-b-0 sm:grid-cols-[4rem_10rem_7rem_1fr]"
              >
                <span aria-hidden="true" className="font-mono text-[11px] text-muted-foreground">
                  {String(4100 + i * 37)}
                </span>
                <h3 className={cn("font-mono text-sm font-bold", primary ? "text-ember" : "text-foreground")}>
                  {tool.name}
                </h3>
                <span aria-hidden="true" className="col-start-2 flex items-center gap-2 font-mono text-[11px] sm:col-start-auto">
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      serving ? "bg-frost" : "status-pulse bg-primary",
                    )}
                  />
                  <span className={serving ? "text-frost" : "text-primary"}>
                    {tr(serving ? T.serving : T.running, locale)}
                  </span>
                </span>
                <p className="col-start-2 font-sans text-sm leading-relaxed text-muted-foreground sm:col-start-auto">
                  {tr(tool.detail, locale)}
                </p>
              </li>
            )
          })}
        </ul>
        <div aria-hidden="true" className="border-t border-hairline px-4 py-3 font-mono text-[11px] text-muted-foreground">
          ~/juani ${" "}
          <span className="inline-block h-3.5 w-2 translate-y-0.5 bg-primary motion-safe:animate-pulse" />
        </div>
      </div>
    </Reveal>
  )
}
