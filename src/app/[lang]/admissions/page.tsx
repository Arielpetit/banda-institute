import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, Check, FileCheck2 } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { ButtonLink } from "@/components/button-link";
import { Faq } from "@/components/faq";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { loadLocale } from "@/i18n/load";
import { img, stockUrl } from "@/lib/content";

export async function generateMetadata({ params }: PageProps<"/[lang]/admissions">): Promise<Metadata> {
  const { t } = await loadLocale(params);
  return { title: t.admissions.metaTitle, description: t.admissions.metaDescription };
}

export default async function AdmissionsPage({ params }: PageProps<"/[lang]/admissions">) {
  const { t } = await loadLocale(params);
  const a = t.admissions;
  return (
    <>
      <PageHero
        home={t.ui.home}
        breadcrumb={t.ui.breadcrumb}
        eyebrow={a.hero.eyebrow}
        title={a.hero.title}
        intro={a.hero.intro}
        image={img("b19.jpg")}
        imageAlt={a.hero.alt}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/admissions/apply">{a.hero.cta}</ButtonLink>
          <ButtonLink href="/contact" variant="outline-light" icon={false}>
            {a.hero.secondary}
          </ButtonLink>
        </div>
      </PageHero>

      {/* Process */}
      <section className="py-24 sm:py-32">
        <div className="container-page">
          <SectionHeading eyebrow={a.process.eyebrow} title={a.process.title} intro={a.process.intro} />
          <div className="relative mt-16">
          <div aria-hidden className="absolute top-7 right-[12%] left-[12%] hidden h-px bg-gradient-to-r from-gold-400 via-accent to-gold-400 lg:block" />
          <Stagger as="ul" className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {a.process.steps.map((s, i) => (
              <StaggerItem as="li" key={s.title} className="relative">
                <span className="relative z-10 grid size-14 place-items-center rounded-full border-4 border-canvas bg-primary font-display text-xl text-on-primary">
                  {i + 1}
                </span>
                <div className="mt-6 rounded-3xl border border-line bg-surface p-6">
                  <p className="text-xs font-bold tracking-wider text-accent uppercase">{s.time}</p>
                  <h3 className="mt-2 text-2xl text-fg">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="bg-subtle py-24 sm:py-32">
        <div className="container-page">
          <SectionHeading eyebrow={a.requirements.eyebrow} title={a.requirements.title} align="center" />
          <Stagger className="mt-14 grid gap-5 lg:grid-cols-3">
            {a.requirements.groups.map((g, i) => (
              <StaggerItem
                key={g.title}
                className={i === 1 ? "rounded-[2rem] bg-ink-900 p-8 text-cream" : "rounded-[2rem] border border-line bg-surface p-8"}
              >
                <p className={i === 1 ? "eyebrow text-gold-300" : "eyebrow text-accent"}>{g.levels}</p>
                <h3 className={i === 1 ? "mt-3 text-3xl" : "mt-3 text-3xl text-fg"}>{g.title}</h3>
                <ul className="mt-6 space-y-3">
                  {g.items.map((it) => (
                    <li key={it} className="flex gap-3 text-sm">
                      <span className={i === 1 ? "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold-400 text-ink-950" : "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-tint text-accent"}>
                        <Check className="size-3" />
                      </span>
                      <span className={i === 1 ? "text-ink-100" : "text-muted"}>{it}</span>
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Dates + documents */}
      <section className="py-24 sm:py-32">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow flex items-center gap-2 text-accent">
              <CalendarDays className="size-4" /> {a.dates.eyebrow}
            </p>
            <h2 className="mt-4 text-4xl text-fg sm:text-5xl">{a.dates.title}</h2>
            <ol className="mt-10 border-l border-line">
              {a.dates.items.map((d) => (
                <li key={d.title} className="relative pb-8 pl-8 last:pb-0">
                  <span className="absolute top-1.5 -left-[7px] size-3.5 rounded-full border-2 border-canvas bg-gold-400" />
                  <p className="text-sm font-semibold text-accent">{d.date}</p>
                  <p className="mt-1 text-lg text-fg">{d.title}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-sm text-muted">{a.dates.note}</p>
          </Reveal>
          <Reveal delay={0.1} className="relative overflow-hidden rounded-[2rem] bg-surface ring-1 ring-line">
            <div className="relative aspect-[16/9]">
              <Image src={stockUrl("writing", 1200)} alt="" fill quality={70} sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="p-8">
              <p className="eyebrow flex items-center gap-2 text-accent">
                <FileCheck2 className="size-4" /> {a.documents.eyebrow}
              </p>
              <h3 className="mt-3 text-3xl text-fg">{a.documents.title}</h3>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {a.documents.items.map((d) => (
                  <li key={d} className="flex gap-2.5 text-sm text-muted">
                    <Check className="mt-0.5 size-4 shrink-0 text-gold-500" />
                    {d}
                  </li>
                ))}
              </ul>
              <ButtonLink href="/admissions/apply" className="mt-8">
                {a.hero.cta}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-subtle py-24 sm:py-32">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={t.contact.faqHeading.eyebrow} title={t.contact.faqHeading.title} />
          </div>
          <Reveal className="lg:col-span-8">
            <Faq faqs={t.contact.faqs} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
