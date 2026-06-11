"use client"

import { useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Annotation } from "./annotation"

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

/**
 * Horizontal scroll-snap carousel of press articles. Every card is a
 * plain anchor always present in the DOM — arrows just scroll the strip,
 * so crawlers and keyboard users reach every article.
 */
export function PressCarousel({ items, readLabel, countLabel, prevLabel, nextLabel }: PressCarouselProps) {
  const trackRef = useRef<HTMLUListElement>(null)

  function scrollByCards(direction: 1 | -1) {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector("li")
    const step = card ? card.getBoundingClientRect().width + 20 : 320
    track.scrollBy({ left: step * direction, behavior: "smooth" })
  }

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        className="scrollbar-hidden -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-2"
      >
        {items.map((article) => (
          <li key={article.url} className="w-[270px] shrink-0 snap-start sm:w-[300px]">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card/40 transition-colors hover:border-primary/60"
            >
              {article.image && (
                <div className="relative aspect-[16/10] overflow-hidden border-b border-border">
                  <Image
                    src={article.image}
                    alt={`${article.outlet} — ${article.title}`}
                    fill
                    sizes="300px"
                    className="object-cover saturate-[0.7] transition-[filter,transform] duration-300 group-hover:scale-[1.03] group-hover:saturate-100 motion-reduce:transition-none"
                  />
                  <span className="absolute top-2 left-2 rounded-sm bg-background/85 px-2 py-0.5 font-mono text-[10px] font-bold tracking-[0.14em] text-primary uppercase backdrop-blur-sm">
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

      <div className="mt-4 flex items-center justify-between gap-4">
        <Annotation>{countLabel}</Annotation>
        <div className="flex gap-2">
          <button
            type="button"
            aria-label={prevLabel}
            onClick={() => scrollByCards(-1)}
            className="flex size-11 cursor-pointer items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            onClick={() => scrollByCards(1)}
            className="flex size-11 cursor-pointer items-center justify-center rounded-sm border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
