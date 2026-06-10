import type { MetadataRoute } from "next"
import { LOCALES, SITE_URL } from "@/content"

export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    changeFrequency: "monthly",
    priority: locale === "en" ? 1 : 0.8,
    alternates: {
      languages: {
        en: `${SITE_URL}/en`,
        es: `${SITE_URL}/es`,
      },
    },
  }))
}
