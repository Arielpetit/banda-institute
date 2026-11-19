import { notFound } from "next/navigation";
import { hasLocale } from "./config";
import { getDictionary } from "./get-dictionary";

/** Resolves the [lang] param and its dictionary for a page or layout. */
export async function loadLocale(params: Promise<{ lang: string }>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return { lang, t: await getDictionary(lang) };
}
