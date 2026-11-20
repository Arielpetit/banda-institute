import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";
import { LocaleLink } from "@/components/locale-link";
import type { Dictionary } from "@/i18n/get-dictionary";

export function Programmes({ t }: { t: Dictionary["home"]["programmes"] }) {
  return (
    <section className="bg-subtle py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          intro={t.intro}
          align="center"
        />
        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {t.items.map((p, i) => (
            <Reveal key={p.href} delay={i * 0.12}>
              <LocaleLink
                href={p.href}
                className="group flex h-full flex-col overflow-hidden rounded-[2rem] bg-surface ring-1 ring-line transition-shadow duration-500 hover:shadow-[0_40px_80px_-40px_rgba(66,29,75,0.45)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    quality={80}
                    sizes="(min-width:1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/0" />
                  <p className="absolute bottom-5 left-6 rounded-full bg-canvas/90 px-3 py-1 text-xs font-semibold text-fg-2 backdrop-blur">
                    {p.range}
                  </p>
                  <span className="absolute top-5 right-5 grid size-12 place-items-center rounded-full bg-gold-400 text-ink-950 transition-transform duration-500 ease-out-expo group-hover:rotate-45">
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7 sm:p-9">
                  <h3 className="text-3xl text-fg sm:text-4xl">{p.label}</h3>
                  <p className="mt-3 text-muted">{p.body}</p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-2.5 text-sm text-fg">
                        <span className="grid size-5 place-items-center rounded-full bg-tint text-accent">
                          <Check className="size-3" />
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </LocaleLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
