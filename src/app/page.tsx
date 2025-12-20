import { Hero } from "<Juan Ignacio>/components/hero";
import { Footer } from "<Juan Ignacio>/components/layout/footer";
import { Header } from "<Juan Ignacio>/components/layout/header";
import { About } from "<Juan Ignacio>/features/about/about";
import { Contact } from "<Juan Ignacio>/features/contact/contact";
import { Experience } from "<Juan Ignacio>/features/experience/experience";
import { Projects } from "<Juan Ignacio>/features/projects/projects";
import { Skills } from "<Juan Ignacio>/features/skills/skills";


export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
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
    </div>
  )
}
