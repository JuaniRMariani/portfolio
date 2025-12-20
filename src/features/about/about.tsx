import { SectionHeading } from "<Juan Ignacio>/components/section-heading";
import Image from "next/image.js";

export function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="mx-auto max-w-4xl">
        <SectionHeading number="01" title="Sobre mí" />

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Soy un apasionado por la tecnología y el aprendizaje constante, actualmente cursando el quinto año
              de la carrera de Ingeniería en Sistemas de Información. He desarrollado una sólida base técnica y analítica
              que me permite enfrentar desafíos con motivación y adaptarme fácilmente a distintos entornos.
            </p>
            <p>
              Me destaco por mis habilidades de comunicación en ámbitos laborales, lo que me permite integrarme y
              colaborar eficazmente en equipos de trabajo. Soy una persona disciplinada, con un mindset ágil y
              perseverante, comprometida con el desarrollo profesional.
            </p>
            <p>
              Mi enfoque principal es aportar valor a proyectos que impulsen tanto mi crecimiento técnico como el éxito
              de la organización, contribuyendo a experiencias digitales accesibles e inclusivas.
            </p>            
          </div>

          <div className="relative group">
            <div className="relative rounded-lg overflow-hidden">
              <Image
                src="/images/Yo.jpg"
                alt="Foto de perfil"
                width={300}
                height={500}
                className="w-full aspect-square object-cover hover:grayscale-0 transition-all duration-300"
              />
              <div className="absolute inset-0 border-2 border-primary rounded-lg translate-x-4 translate-y-4 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}