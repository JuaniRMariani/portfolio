import type React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Schibsted_Grotesk } from "next/font/google"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
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
  return {
    metadataBase: new URL(SITE_URL),
    title: tr(ui.meta.title, locale),
    description: tr(ui.meta.description, locale),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", es: "/es", "x-default": "/en" },
    },
    icons: {
      icon: [
        { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
        { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: "/apple-icon.png",
    },
  }
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params
  if (!LOCALES.includes(locale as Locale)) notFound()

  return (
    <html lang={locale}>
      <body
        className={`${schibsted.variable} ${commitMono.variable} ${departureMono.variable} font-mono antialiased`}
      >
        {/* Marks JS availability before paint: reveal targets are only
            hidden for the terminal animation when this attribute exists. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.dataset.js=''" }} />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
