import type React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Schibsted_Grotesk } from "next/font/google"
import localFont from "next/font/local"
import { LOCALES, ui, tr, SITE_URL, type Locale } from "@/content"
import "../globals.css"

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  variable: "--font-schibsted",
  display: "swap",
})

const commitMono = localFont({
  src: [
    { path: "../../fonts/commit-mono-400.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/commit-mono-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-commit",
  display: "swap",
})

const departureMono = localFont({
  src: "../../fonts/departure-mono-400.woff2",
  weight: "400",
  variable: "--font-departure",
  display: "swap",
})

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export const dynamicParams = false

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = raw as Locale
  const title = tr(ui.meta.title, locale)
  const description = tr(ui.meta.description, locale)
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", es: "/es", "x-default": "/en" },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}`,
      siteName: "Juan Ignacio Rodríguez Mariani",
      locale: locale === "en" ? "en_US" : "es_AR",
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
  }
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params
  if (!LOCALES.includes(locale as Locale)) notFound()

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Juan Ignacio Rodríguez Mariani",
    jobTitle: "Information Systems Engineer",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Universidad Nacional del Sur",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bahía Blanca",
      addressCountry: "AR",
    },
    email: "mailto:juanirmariani@gmail.com",
    url: `${SITE_URL}/${locale}`,
    sameAs: [
      "https://github.com/JuaniRMariani",
      "https://www.linkedin.com/in/juan-ignacio-rodriguez-mariani/",
    ],
  }

  return (
    <html lang={locale}>
      <body
        className={`${schibsted.variable} ${commitMono.variable} ${departureMono.variable} font-mono antialiased`}
      >
        {/* Marks JS availability before paint: reveal targets are only
            hidden for the terminal animation when this attribute exists. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js=''" }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}
