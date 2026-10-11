"use client"

import { useState } from "react"
import Image from "next/image"
import { MapPin } from "lucide-react"
import { Annotation } from "@/components/editorial/annotation"
import { TiltCard } from "@/components/fx/tilt-card"

/**
 * Optional transparent cutout of the portrait. Flip to `true` once
 * `/public/images/me-cutout.webp` exists (transparent background, same
 * framing as Yo.jpg): it renders on top of the frame, breaking out of
 * its top edge for a pop-out effect. Left off, only Yo.jpg is used.
 */
const HAS_CUTOUT = false

const PHOTO = "/images/Yo.jpg"
const SIZES = "(min-width: 1024px) 24rem, (min-width: 640px) 22rem, 85vw"

/** Corner bracket of the CAD frame. */
function Bracket({ className }: { className: string }) {
  return <span aria-hidden="true" className={`absolute z-20 size-4 border-foreground/70 ${className}`} />
}

/**
 * Portrait in natural colour inside a clean CAD frame: soft ember rim
 * light, 3D tilt toward the pointer (or the phone's tilt), and a glass
 * reflection that sweeps across on hover / tap.
 */
export function Portrait({ alt, location, coords }: { alt: string; location: string; coords: string }) {
  const [sweep, setSweep] = useState(0)

  return (
    <figure className="relative mx-auto w-full max-w-[22rem] lg:max-w-none">
      {/* top dimension line */}
      <div aria-hidden="true" className="mb-3 flex items-center gap-2 pr-7 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
        <span className="h-2.5 w-px bg-primary/70" />
        <span className="h-px flex-1 bg-primary/30" />
        <span>W 400</span>
        <span className="h-px flex-1 bg-primary/30" />
        <span className="h-2.5 w-px bg-primary/70" />
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 [perspective:1000px]">
          {/* ember rim light behind the frame */}
          <div
            aria-hidden="true"
            className="absolute -inset-3 rounded-2xl bg-[radial-gradient(60%_50%_at_70%_15%,oklch(0.74_0.22_46/0.35),transparent_70%),radial-gradient(50%_45%_at_15%_90%,oklch(0.72_0.13_225/0.18),transparent_70%)] blur-xl"
          />
          <TiltCard max={7} className="group relative rounded-xl">
            <div
              onPointerEnter={(event) => event.pointerType === "mouse" && setSweep((n) => n + 1)}
              onPointerDown={(event) => event.pointerType !== "mouse" && setSweep((n) => n + 1)}
              className="relative isolate aspect-[4/5] overflow-hidden rounded-xl border border-[oklch(0.5_0.08_262/0.5)] bg-card shadow-[0_30px_80px_-30px_oklch(0_0_0/0.85),0_0_0_1px_oklch(0.74_0.22_46/0.15)]"
            >
              <Image
                src={PHOTO}
                alt={alt}
                fill
                sizes={SIZES}
                className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
              />

              {/* gentle grade: lifts the frame into the page without recolouring the photo */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,oklch(0.13_0.05_262/0.7))]" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-xl shadow-[inset_0_0_0_1px_oklch(1_0_0/0.06),inset_0_-40px_60px_-40px_oklch(0.74_0.22_46/0.35)]" />

              {/* glass reflection sweep (re-keyed to replay) */}
              <span key={sweep} aria-hidden="true" className={sweep ? "portrait-sweep" : "hidden"} />

              <Bracket className="top-3 left-3 border-t border-l" />
              <Bracket className="top-3 right-3 border-t border-r" />
              <Bracket className="bottom-3 left-3 border-b border-l" />
              <Bracket className="right-3 bottom-3 border-r border-b" />

              <p className="absolute bottom-5 left-5 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[oklch(0.13_0.05_262/0.55)] px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-foreground uppercase backdrop-blur-md">
                <MapPin className="size-3 text-primary" aria-hidden="true" />
                {location}
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
          </TiltCard>
        </div>

        {/* right dimension line */}
        <div aria-hidden="true" className="flex w-4 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
          <span className="h-px w-2.5 bg-primary/70" />
          <span className="w-px flex-1 bg-primary/30" />
          <span className="[writing-mode:vertical-rl]">H 500</span>
          <span className="w-px flex-1 bg-primary/30" />
          <span className="h-px w-2.5 bg-primary/70" />
        </div>
      </div>

      <figcaption className="mt-3 flex flex-wrap justify-between gap-x-4 gap-y-1 pr-7">
        <Annotation>Fig. 01 — {location}</Annotation>
        <Annotation className="text-primary">{coords}</Annotation>
      </figcaption>
    </figure>
  )
}
