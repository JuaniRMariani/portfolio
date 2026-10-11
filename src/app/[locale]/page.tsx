import { AnimationProvider } from "@/components/editorial/animation-context"
import { PlayProvider } from "@/components/play/achievements"
import { Terminal } from "@/components/play/terminal"
import { FxLayer } from "@/components/fx/fx-layer"
import { SmoothScroll } from "@/components/fx/smooth-scroll"
import { Cursor } from "@/components/fx/cursor"
import { ScrollHud } from "@/components/fx/scroll-hud"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/features/hero/hero"
import { About } from "@/features/about/about"
import { Services } from "@/features/services/services"
import { Experience } from "@/features/experience/experience"
import { Projects } from "@/features/projects/projects"
import { AiEngineering } from "@/features/ai-engineering/ai-engineering"
import { Skills } from "@/features/skills/skills"
import { Contact } from "@/features/contact/contact"
import { ui, tr, type Locale } from "@/content"

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = raw as Locale

  const hudLabels = {
    top: "Index",
    about: tr(ui.nav.about, locale),
    services: tr(ui.nav.services, locale),
    experience: tr(ui.nav.experience, locale),
    projects: tr(ui.nav.projects, locale),
    "how-i-work": tr(ui.nav.ai, locale),
    skills: tr(ui.nav.skills, locale),
    contact: tr(ui.nav.contact, locale),
  }

  return (
    <AnimationProvider>
      <PlayProvider locale={locale}>
        <FxLayer />
        <SmoothScroll />
        <Cursor />
        <ScrollHud labels={hudLabels} />
        <Header locale={locale} />
        <Hero locale={locale} />
        <main className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <About locale={locale} />
          <Services locale={locale} />
          <Experience locale={locale} />
          <Projects locale={locale} />
          <AiEngineering locale={locale} />
          <Skills locale={locale} />
          <Contact locale={locale} />
        </main>
        <Footer locale={locale} />
        <Terminal locale={locale} />
      </PlayProvider>
    </AnimationProvider>
  )
}
