import { AnimationProvider } from "@/components/terminal/animation-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Hero } from "@/features/hero/hero"
import { About } from "@/features/about/about"
import { Experience } from "@/features/experience/experience"
import { Projects } from "@/features/projects/projects"
import { AiEngineering } from "@/features/ai-engineering/ai-engineering"
import { Skills } from "@/features/skills/skills"
import { Contact } from "@/features/contact/contact"
import type { Locale } from "@/content"

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = raw as Locale

  return (
    <AnimationProvider>
      <Header locale={locale} />
      <main className="mx-auto max-w-4xl px-4">
        <Hero locale={locale} />
        <About locale={locale} />
        <Experience locale={locale} />
        <Projects locale={locale} />
        <AiEngineering locale={locale} />
        <Skills locale={locale} />
        <Contact locale={locale} />
      </main>
      <Footer locale={locale} />
    </AnimationProvider>
  )
}
