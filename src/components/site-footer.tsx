import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/button-link";
import { LocaleLink } from "@/components/locale-link";
import type { Dictionary } from "@/i18n/get-dictionary";
import { flattenNav } from "@/i18n/nav";
import { site, tel } from "@/lib/content";

export function SiteFooter({ t }: { t: Dictionary }) {
  const f = t.footer;
  return (
    <footer className="grain relative overflow-hidden bg-ink-950 text-ink-100">
      <div className="container-page relative">
        <div className="flex flex-col items-start justify-between gap-8 border-b border-cream/10 py-16 md:flex-row md:items-end">
          <h2 className="max-w-xl text-4xl leading-tight text-cream sm:text-5xl">
            {f.titleA} <em className="text-gold-300">{f.titleEm}</em>.
          </h2>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/admissions">{f.book}</ButtonLink>
            <ButtonLink href={tel(site.phones.administration)} variant="outline-light" icon={false}>
              {f.call}
            </ButtonLink>
          </div>
        </div>

        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo tone="light" tag={t.ui.logoTag} />
            <p className="max-w-xs text-sm leading-relaxed text-ink-200/80">{f.blurb}</p>
          </div>

          <div>
            <h3 className="eyebrow font-sans text-gold-300">{f.explore}</h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[{ href: "/", label: t.ui.home }, ...flattenNav(t.nav)].map((n) => (
                <li key={n.href}>
                  <LocaleLink href={n.href} className="transition-colors hover:text-gold-300">
                    {n.label}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow font-sans text-gold-300">{f.reach}</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold-400" />
                {t.location}
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-gold-400" />
                <span className="space-y-1">
                  <a className="block hover:text-gold-300" href={tel(site.phones.administration)}>
                    {site.phones.administration}
                  </a>
                  <a className="block hover:text-gold-300" href={tel(site.phones.secondary)}>
                    {site.phones.secondary}
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-gold-400" />
                <a className="break-all hover:text-gold-300" href={`mailto:${site.emails.general}`}>
                  {site.emails.general}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="eyebrow font-sans text-gold-300">{f.hours}</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {t.hours.map((h) => (
                <li key={h.day} className="flex justify-between gap-4 border-b border-cream/10 pb-3">
                  <span>{h.day}</span>
                  <span className="text-cream tabular-nums">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p
          aria-hidden
          className="pointer-events-none -mb-[0.22em] select-none text-center font-display text-[22vw] leading-none font-semibold text-cream/[0.04] lg:text-[16rem]"
        >
          B<span className="italic">&amp;</span>A
        </p>

        <div className="flex flex-col gap-2 border-t border-cream/10 py-6 text-xs text-ink-300 sm:flex-row sm:justify-between">
          <p>
            © {site.founded}–2026 {site.fullName}. {f.rights}
          </p>
          <p>{f.strap}</p>
        </div>
      </div>
    </footer>
  );
}
