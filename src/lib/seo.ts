import type { Metadata } from "next";
import type { Locale } from "@/i18n/config";
import { site } from "@/lib/content";

/**
 * Public origin used to build absolute URLs for canonical links and share
 * images. Set NEXT_PUBLIC_SITE_URL once the final domain is known.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://banda-institute.vercel.app")
).replace(/\/$/, "");

const ogLocale: Record<Locale, string> = { en: "en_CM", fr: "fr_CM" };

// 1200x630 share images in /public/og, one per language.
const ogAlt: Record<Locale, string> = {
  en: "B&A Institute staff and teachers in front of the school in Nkolbisson, Yaoundé",
  fr: "Le personnel et les enseignants de B&A Institute devant l’école à Nkolbisson, Yaoundé",
};

type Input = {
  lang: Locale;
  /** Path after the language segment, e.g. "/about". Empty for the home page. */
  path?: string;
  /** Page title (the site name is appended). Omit on the home page. */
  title?: string;
  /** Full title for the share card when there is no page title (home page). */
  homeTitle?: string;
  description: string;
  index?: boolean;
};

/** Title, description, canonical, alternates, Open Graph and Twitter card for one page. */
export function pageMetadata({ lang, path = "", title, homeTitle, description, index = true }: Input): Metadata {
  const fullTitle = title ? `${title} · ${site.name}` : homeTitle;
  const url = `/${lang}${path}`;
  const image = { url: `/og/${lang}.jpg`, width: 1200, height: 630, alt: ogAlt[lang], type: "image/jpeg" };

  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: url,
      languages: { en: `/en${path}`, fr: `/fr${path}`, "x-default": `/en${path}` },
    },
    ...(index ? {} : { robots: { index: false } }),
    openGraph: {
      type: "website",
      siteName: site.fullName,
      locale: ogLocale[lang],
      alternateLocale: ogLocale[lang === "en" ? "fr" : "en"],
      url,
      ...(fullTitle ? { title: fullTitle } : {}),
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      ...(fullTitle ? { title: fullTitle } : {}),
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}
