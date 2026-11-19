export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "NEXT_LOCALE";

export const hasLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/** Prefixes an internal path with the locale: ("/about", "fr") -> "/fr/about". */
export function localizeHref(href: string, lang: Locale) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const first = href.split("/")[1];
  if (hasLocale(first)) return href;
  return href === "/" ? `/${lang}` : `/${lang}${href}`;
}

/** Swaps the locale segment of a pathname. */
export function switchLocalePath(pathname: string, to: Locale) {
  const parts = pathname.split("/");
  if (hasLocale(parts[1] ?? "")) parts[1] = to;
  else parts.splice(1, 0, to);
  return parts.join("/") || `/${to}`;
}
