import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter, Source_Serif_4 } from "next/font/google";
import "../globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MotionProvider } from "@/components/motion-provider";
import { themeScript } from "@/lib/inline-scripts";
import { hasLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { site } from "@/lib/content";

// Headings: Source Serif 4, a calm, classic serif with optical sizes (sharp at display sizes, sturdy when small).
// Body: Inter, highly legible on screens at every size, with full French accent support.
const serif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  return {
    title: { default: t.meta.title, template: `%s · ${site.name}` },
    description: t.meta.description,
    openGraph: { siteName: site.fullName, locale: t.meta.locale, type: "website" },
    alternates: { languages: { en: "/en", fr: "/fr" } },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf6ef" },
    { media: "(prefers-color-scheme: dark)", color: "#100e0d" },
  ],
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);

  return (
    <html lang={lang} data-scroll-behavior="smooth" className={`${serif.variable} ${sans.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold-400 focus:px-4 focus:py-2 focus:text-ink-950"
        >
          {t.ui.skip}
        </a>
        <MotionProvider>
          <SiteHeader lang={lang} ui={t.ui} nav={t.nav} contactLabel={t.contactLabel} location={t.location} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter t={t} />
        </MotionProvider>
      </body>
    </html>
  );
}
