import { Hero } from "@/components/hero"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { About } from "@/features/about/about"
import { Contact } from "@/features/contact/contact"
import { Experience } from "@/features/experience/experience"
import { Projects } from "@/features/projects/projects"
import { Skills } from "@/features/skills/skills"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
