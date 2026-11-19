"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { defaultLocale, hasLocale, localizeHref } from "@/i18n/config";

/** next/link that prefixes internal paths with the current locale. */
export function LocaleLink(props: React.ComponentProps<typeof Link> & { href: string }) {
  const params = useParams<{ lang?: string }>();
  const lang = params.lang && hasLocale(params.lang) ? params.lang : defaultLocale;
  return <Link {...props} href={localizeHref(props.href, lang)} />;
}
