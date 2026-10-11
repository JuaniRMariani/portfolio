"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react"
import { useAnimation } from "@/components/editorial/animation-context"
import { Annotation } from "@/components/editorial/annotation"

/**
 * Optional transparent cutout of the portrait. Flip to `true` once
 * `/public/images/me-cutout.webp` exists (transparent background, same
 * framing as Yo.jpg): it renders on top of the frame, breaking out of
 * its top edge for a pop-out effect. Left off, only Yo.jpg is used.
 */
const HAS_CUTOUT = false

const PHOTO = "/images/Yo.jpg"
const SIZES = "(min-width: 1024px) 24rem, (min-width: 640px) 22rem, 85vw"
const REVEAL_RADIUS = 170

/** Corner bracket of the CAD frame. */
function Bracket({ className }: { className: string }) {
  return <span aria-hidden="true" className={`absolute z-20 size-5 border-primary ${className}`} />
}

/**
 * CAD-framed portrait. Base layer is an ember/navy duotone; a full-colour
 * copy is revealed through a radial mask that follows the pointer, with a
 * crosshair + coordinate readout tracking it. Tap toggles colour on touch.
 */
export function Portrait({ alt, location, coords }: { alt: string; location: string; coords: string }) {
  const { enabled } = useAnimation()
  const frame = useRef<HTMLDivElement>(null)
  const x = useMotionValue(50)
  const y = useMotionValue(50)
  const radius = useSpring(0, { stiffness: 140, damping: 22 })
  const mask = useMotionTemplate`radial-gradient(circle ${radius}px at ${x}% ${y}%, #000 50%, transparent 100%)`
  const left = useMotionTemplate`${x}%`
  const top = useMotionTemplate`${y}%`
  const readX = useTransform(x, (v) => `X ${v.toFixed(1).padStart(4, "0")}`)
  const readY = useTransform(y, (v) => `Y ${v.toFixed(1).padStart(4, "0")}`)

  function setRadius(value: number) {
    if (enabled) radius.set(value)
    else radius.jump(value)
  }

  function track(event: React.PointerEvent<HTMLDivElement>) {
    const el = frame.current
    if (!el || event.pointerType !== "mouse") return
    const rect = el.getBoundingClientRect()
    x.set(((event.clientX - rect.left) / rect.width) * 100)
    y.set(((event.clientY - rect.top) / rect.height) * 100)
  }

  return (
    <figure className="relative mx-auto w-full max-w-[22rem] lg:max-w-none">
      {/* top dimension line */}
      <div aria-hidden="true" className="mb-3 flex items-center gap-2 pr-7 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
        <span className="h-2.5 w-px bg-primary" />
        <span className="h-px flex-1 bg-primary/40" />
        <span>W 400</span>
        <span className="h-px flex-1 bg-primary/40" />
        <span className="h-2.5 w-px bg-primary" />
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <div
            ref={frame}
            data-cursor="view"
            className="relative isolate aspect-[4/5] overflow-hidden rounded-sm border border-hairline bg-card"
            onPointerEnter={(event) => event.pointerType === "mouse" && setRadius(REVEAL_RADIUS)}
            onPointerMove={track}
            onPointerLeave={(event) => {
              if (event.pointerType !== "mouse") return
              setRadius(0)
              x.set(50)
              y.set(50)
            }}
            onPointerDown={(event) => {
              if (event.pointerType === "mouse") return
              setRadius(radius.get() > REVEAL_RADIUS ? 0 : 900)
            }}
          >
            {/* duotone base */}
            <Image src={PHOTO} alt={alt} fill sizes={SIZES} className="object-cover brightness-95 contrast-125 grayscale" />
            <div aria-hidden="true" className="absolute inset-0 bg-[oklch(0.74_0.22_46)] mix-blend-multiply" />
            <div aria-hidden="true" className="absolute inset-0 bg-[oklch(0.25_0.09_262)] mix-blend-screen" />

            {/* full colour, revealed around the pointer */}
            <motion.div aria-hidden="true" className="absolute inset-0" style={{ maskImage: mask, WebkitMaskImage: mask }}>
              <Image src={PHOTO} alt="" fill sizes={SIZES} className="object-cover" />
            </motion.div>

            {/* grid + scan glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(oklch(0.96_0.012_75/0.12)_1px,transparent_1px),linear-gradient(90deg,oklch(0.96_0.012_75/0.12)_1px,transparent_1px)] [background-size:12.5%_10%]"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,oklch(0.13_0.05_262/0.75))]" />

            {/* crosshair */}
            <motion.span aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-px bg-primary/50" style={{ left }} />
            <motion.span aria-hidden="true" className="pointer-events-none absolute inset-x-0 h-px bg-primary/50" style={{ top }} />
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary shadow-[0_0_14px_oklch(0.74_0.22_46/0.6)]"
              style={{ left, top }}
            />

            <Bracket className="top-2 left-2 border-t-2 border-l-2" />
            <Bracket className="top-2 right-2 border-t-2 border-r-2" />
            <Bracket className="bottom-2 left-2 border-b-2 border-l-2" />
            <Bracket className="right-2 bottom-2 border-r-2 border-b-2" />

            <p aria-hidden="true" className="absolute bottom-3 left-4 z-20 flex gap-3 font-mono text-[10px] tracking-[0.18em] text-foreground/80 tabular-nums">
              <motion.span>{readX}</motion.span>
              <motion.span>{readY}</motion.span>
            </p>
            <p aria-hidden="true" className="absolute top-3 right-4 z-20 font-mono text-[10px] tracking-[0.18em] text-primary">
              REC ●
            </p>
          </div>

          {HAS_CUTOUT && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-[14%] bottom-0 z-30">
              <Image
                src="/images/me-cutout.webp"
                alt=""
                fill
                sizes={SIZES}
                className="object-cover object-bottom drop-shadow-[0_20px_40px_oklch(0_0_0/0.6)]"
              />
            </div>
          )}
        </div>

        {/* right dimension line */}
        <div aria-hidden="true" className="flex w-4 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
          <span className="h-px w-2.5 bg-primary" />
          <span className="w-px flex-1 bg-primary/40" />
          <span className="[writing-mode:vertical-rl]">H 500</span>
          <span className="w-px flex-1 bg-primary/40" />
          <span className="h-px w-2.5 bg-primary" />
        </div>
      </div>

      <figcaption className="mt-3 flex flex-wrap justify-between gap-x-4 gap-y-1 pr-7">
        <Annotation>Fig. 01 — {location}</Annotation>
        <Annotation className="text-primary">{coords}</Annotation>
      </figcaption>
    </figure>
  )
}
