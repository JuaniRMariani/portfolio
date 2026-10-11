"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Annotation } from "./annotation"
import { useAnimation } from "./animation-context"

export interface PressCard {
  outlet: string
  title: string
  url: string
  image?: string
}

interface PressCarouselProps {
  items: PressCard[]
  readLabel: string
  countLabel: string
  prevLabel: string
  nextLabel: string
}

interface DragState {
  pointerId: number
  startX: number
  startScroll: number
  lastX: number
  lastT: number
  velocity: number
  moved: boolean
}

const GAP = 20

/**
 * Horizontal scroll-snap carousel of press articles. Every card is a
 * plain anchor always present in the DOM — arrows, keys and mouse drag
 * (with inertia) only move the strip, so crawlers and keyboard users
 * reach every article. Cards lean into the scroll direction.
 */
export function PressCarousel({ items, readLabel, countLabel, prevLabel, nextLabel }: PressCarouselProps) {
  const { enabled } = useAnimation()
  const trackRef = useRef<HTMLDivElement>(null)
  const drag = useRef<DragState | null>(null)
  const suppressClick = useRef(false)
  const inertia = useRef(0)
  const settleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  function cardStep() {
    const card = trackRef.current?.querySelector("li")
    return card ? card.getBoundingClientRect().width + GAP : 320
  }

  function scrollByCards(direction: 1 | -1) {
    trackRef.current?.scrollBy({ left: cardStep() * direction, behavior: enabled ? "smooth" : "auto" })
  }

  function stopInertia() {
    cancelAnimationFrame(inertia.current)
    clearTimeout(settleTimer.current)
  }

  /** Re-enable snapping by gliding to the nearest card first (avoids a hard jump). */
  function settle() {
    const track = trackRef.current
    if (!track) return
    const origin = track.getBoundingClientRect().left
    let offset = Infinity
    track.querySelectorAll("li").forEach((li) => {
      const d = li.getBoundingClientRect().left - origin
      if (Math.abs(d) < Math.abs(offset)) offset = d
    })
    const max = track.scrollWidth - track.clientWidth
    const target = Math.min(max, Math.max(0, track.scrollLeft + (Number.isFinite(offset) ? offset : 0)))
    track.scrollTo({ left: target, behavior: enabled ? "smooth" : "auto" })
    settleTimer.current = setTimeout(() => {
      track.style.scrollSnapType = ""
      track.style.scrollBehavior = ""
    }, 450)
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    // touch & pen keep native scrolling (already inertial); mouse gets drag
    if (event.pointerType !== "mouse" || event.button !== 0) return
    const track = trackRef.current
    if (!track) return
    stopInertia()
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: track.scrollLeft,
      lastX: event.clientX,
      lastT: event.timeStamp,
      velocity: 0,
      moved: false,
    }
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const state = drag.current
    const track = trackRef.current
    if (!state || !track || event.pointerId !== state.pointerId) return
    const dx = event.clientX - state.startX
    if (!state.moved) {
      if (Math.abs(dx) < 6) return
      state.moved = true
      // capture only once it is a real drag, so plain clicks still reach the links
      track.setPointerCapture(event.pointerId)
      track.style.scrollSnapType = "none"
      track.style.scrollBehavior = "auto"
      track.dataset.dragging = "true"
    }
    track.scrollLeft = state.startScroll - dx
    const dt = Math.max(1, event.timeStamp - state.lastT)
    state.velocity = state.velocity * 0.6 + ((event.clientX - state.lastX) / dt) * 0.4
    state.lastX = event.clientX
    state.lastT = event.timeStamp
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const state = drag.current
    const track = trackRef.current
    if (!state || !track || event.pointerId !== state.pointerId) return
    drag.current = null
    if (!state.moved) return
    suppressClick.current = true
    delete track.dataset.dragging
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId)

    if (!enabled) {
      settle()
      return
    }
    let v = state.velocity * 16 // px per frame
    const glide = () => {
      const max = track.scrollWidth - track.clientWidth
      track.scrollLeft -= v
      v *= 0.94
      if (Math.abs(v) < 0.5 || track.scrollLeft <= 0 || track.scrollLeft >= max) settle()
      else inertia.current = requestAnimationFrame(glide)
    }
    inertia.current = requestAnimationFrame(glide)
  }

  function onClickCapture(event: React.MouseEvent) {
    if (!suppressClick.current) return
    suppressClick.current = false
    event.preventDefault()
    event.stopPropagation()
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const track = trackRef.current
    if (!track) return
    if (event.key === "ArrowRight") scrollByCards(1)
    else if (event.key === "ArrowLeft") scrollByCards(-1)
    else if (event.key === "Home") track.scrollTo({ left: 0, behavior: enabled ? "smooth" : "auto" })
    else if (event.key === "End") track.scrollTo({ left: track.scrollWidth, behavior: enabled ? "smooth" : "auto" })
    else return
    event.preventDefault()
  }

  // cards lean into the scroll direction (any input: drag, wheel, touch, keys)
  useEffect(() => {
    const track = trackRef.current
    if (!track || !enabled) return
    let last = track.scrollLeft
    let target = 0
    let tilt = 0
    let raf = 0
    const tick = () => {
      tilt += (target - tilt) * 0.18
      target *= 0.82
      track.style.setProperty("--tilt", `${tilt.toFixed(2)}deg`)
      if (Math.abs(tilt) > 0.05 || Math.abs(target) > 0.05) raf = requestAnimationFrame(tick)
      else {
        track.style.setProperty("--tilt", "0deg")
        raf = 0
      }
    }
    const onScroll = () => {
      const delta = track.scrollLeft - last
      last = track.scrollLeft
      target = Math.max(-9, Math.min(9, target - delta * 0.35))
      if (!raf) raf = requestAnimationFrame(tick)
    }
    track.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      track.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
      track.style.removeProperty("--tilt")
    }
  }, [enabled])

  useEffect(
    () => () => {
      cancelAnimationFrame(inertia.current)
      clearTimeout(settleTimer.current)
    },
    [],
  )

  return (
    <div className="relative">
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={countLabel}
        tabIndex={0}
        data-cursor="drag"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
        className="scrollbar-hidden -mx-4 snap-x snap-mandatory overflow-x-auto scroll-smooth px-4 pt-2 pb-4 select-none data-[dragging=true]:cursor-grabbing motion-reduce:scroll-auto"
      >
        <ul className="flex w-max gap-5">
          {items.map((article) => (
            <li
              key={article.url}
              className="w-[260px] shrink-0 snap-start [transform:perspective(900px)_rotateY(var(--tilt,0deg))] sm:w-[300px]"
            >
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                draggable={false}
                data-cursor="drag"
                className="panel group flex h-full flex-col overflow-hidden rounded-xl transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_24px_60px_-28px_oklch(0.74_0.22_46/0.6)] motion-reduce:transition-none"
              >
                {article.image && (
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
                    <Image
                      src={article.image}
                      alt={`${article.outlet} — ${article.title}`}
                      fill
                      sizes="300px"
                      draggable={false}
                      className="object-cover grayscale-[0.85] transition-[filter,scale] duration-500 group-hover:scale-[1.05] group-hover:grayscale-0 group-focus-visible:grayscale-0 motion-reduce:transition-none"
                    />
                    <span className="absolute top-2 left-2 rounded-full bg-background/85 px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-[0.14em] text-primary uppercase backdrop-blur-sm">
                      {article.outlet}
                    </span>
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <p className="line-clamp-3 font-sans text-sm leading-snug text-foreground">{article.title}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.14em] text-muted-foreground uppercase transition-colors group-hover:text-primary">
                    {readLabel}
                    <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <Annotation>{countLabel}</Annotation>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label={prevLabel}
            onClick={() => scrollByCards(-1)}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            onClick={() => scrollByCards(1)}
            className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
