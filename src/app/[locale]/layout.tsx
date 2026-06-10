import type React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LOCALES, ui, tr, SITE_URL, type Locale } from "@/content"
import "../globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" })

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
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
