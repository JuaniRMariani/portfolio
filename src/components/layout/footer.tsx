"use client"

import { motion } from "motion/react"
import { ArrowUp } from "lucide-react"
import { profile, ui, tr, type Locale } from "@/content"
import { Annotation } from "@/components/editorial/annotation"
import { useAnimation } from "@/components/editorial/animation-context"
import { Magnetic } from "@/components/fx/magnetic"
import { emitFx } from "@/components/fx/scene/store"
import { scrollToTarget } from "@/components/fx/smooth-scroll"
import { usePlay } from "@/components/play/achievements"

const LABELS = {
  top: { en: "Back to top", es: "Volver arriba" },
  ember: { en: "A stray ember", es: "Una brasa suelta" },
  coords: "38.7183° S · 62.2663° W",
} as const

function backToTop(smooth: boolean) {
  if (document.querySelector("#top")) scrollToTarget("#top")
  else window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" })
}

/**
 * Footer: faded "JRM" wordmark, colophon lines, magnetic back-to-top and
 * the hidden ember — the full stop after "JRM" is a real (if very quiet)
 * button that unlocks "hidden-ember" and floods the field.
 */
export function Footer({ locale }: { locale: Locale }) {
  const { enabled } = useAnimation()
  const { unlock } = usePlay()

  function ignite() {
    unlock("hidden-ember")
    emitFx("burst")
  }

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-hairline">
      <div aria-hidden="true" className="bg-ember absolute inset-x-0 top-0 h-px opacity-40" />

      <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
        {/* wordmark */}
        <div className="relative inline-block font-display text-[clamp(7rem,30vw,24rem)] leading-[0.78] font-extrabold tracking-tighter select-none">
          <span
            aria-hidden="true"
            className="block bg-[linear-gradient(180deg,oklch(0.96_0.012_75/0.14),oklch(0.96_0.012_75/0.015)_85%)] bg-clip-text text-transparent [-webkit-text-stroke:1px_oklch(0.74_0.22_46/0.22)]"
          >
            JRM
          </span>
          <motion.button
            type="button"
            onClick={ignite}
            aria-label={LABELS.ember[locale]}
            data-cursor="?"
            className="group absolute right-0 bottom-[0.06em] flex size-11 translate-x-[110%] cursor-pointer items-center justify-center rounded-full"
            whileTap={enabled ? { scale: 0.7 } : undefined}
          >
            <span
              className="block size-[7px] rounded-full bg-primary opacity-40 shadow-[0_0_10px_2px_oklch(0.74_0.22_46/0.55)] transition-[opacity,transform] duration-500 group-hover:scale-150 group-hover:opacity-100 group-focus-visible:opacity-100"
              style={enabled ? { animation: "status-pulse 3.6s ease-in-out infinite" } : undefined}
            />
          </motion.button>
        </div>

        <div className="mt-10 grid gap-x-8 gap-y-5 border-t border-hairline py-8 sm:grid-cols-[1fr_auto] sm:items-end">
          <div className="space-y-2">
            <p className="max-w-md font-mono text-xs leading-relaxed text-muted-foreground">{tr(ui.footer.built, locale)}</p>
            <p>
              <Annotation>{tr(ui.footer.type, locale)}</Annotation>
            </p>
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              <Annotation className="text-foreground/80">
                © <span suppressHydrationWarning>{new Date().getFullYear()}</span> {profile.name}
              </Annotation>
              <Annotation className="text-primary/80">{LABELS.coords}</Annotation>
            </p>
          </div>

          <Magnetic strength={0.45} className="justify-self-start sm:justify-self-end">
            <button
              type="button"
              onClick={() => backToTop(enabled)}
              className="group panel flex min-h-14 cursor-pointer items-center gap-3 rounded-full py-2 pr-2 pl-5 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground"
            >
              {LABELS.top[locale]}
              <span className="bg-ember flex size-10 items-center justify-center rounded-full text-primary-foreground transition-transform duration-300 group-hover:-translate-y-0.5">
                <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
              </span>
            </button>
          </Magnetic>
        </div>
      </div>
    </footer>
  )
}
