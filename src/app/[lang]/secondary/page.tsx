import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { PathwayTabs } from "@/components/pathway-tabs";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { ButtonLink } from "@/components/button-link";
import { loadLocale } from "@/i18n/load";
import { img } from "@/lib/content";

export async function generateMetadata({ params }: PageProps<"/[lang]/secondary">): Promise<Metadata> {
  const { t } = await loadLocale(params);
  return { title: t.secondary.metaTitle, description: t.secondary.metaDescription };
}

export default async function SecondaryPage({ params }: PageProps<"/[lang]/secondary">) {
  const { t } = await loadLocale(params);
  const s = t.secondary;
  return (
    <>
      <PageHero
        home={t.ui.home}
        breadcrumb={t.ui.breadcrumb}
        eyebrow={s.hero.eyebrow}
        title={s.hero.title}
        intro={s.hero.intro}
        image={img("b4.jpg")}
        imageAlt={s.hero.alt}
      >
        <ButtonLink href="/contact">{s.hero.cta}</ButtonLink>
      </PageHero>

      <section className="py-24 sm:py-32">
        <div className="container-page">
          <SectionHeading eyebrow={s.pathwaysHeading.eyebrow} title={s.pathwaysHeading.title} intro={s.pathwaysHeading.intro} />
          <PathwayTabs t={s} />
        </div>
      </section>

      <section className="bg-subtle py-24 sm:py-32">
        <div className="container-page">
          <SectionHeading
            eyebrow={s.systemsHeading.eyebrow}
            title={s.systemsHeading.title}
            intro={s.systemsHeading.intro}
            align="center"
          />
          <Stagger className="mt-14 grid gap-5 lg:grid-cols-2">
            {s.systems.map((sys, i) => (
              <StaggerItem
                key={sys.title}
                className={`rounded-[2rem] p-8 sm:p-12 ${i === 0 ? "bg-ink-800 text-cream" : "bg-surface text-ink-950 ring-1 ring-line"}`}
              >
                <p className={`eyebrow ${i === 0 ? "text-gold-300" : "text-accent"}`}>{sys.system}</p>
                <h3 className="mt-3 text-4xl">{sys.title}</h3>
                <ul className="mt-8 space-y-4">
                  {sys.points.map((pt) => (
                    <li key={pt} className="flex gap-3">
                      <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ${i === 0 ? "bg-gold-400 text-ink-950" : "bg-tint text-accent"}`}>
                        <Check className="size-3.5" />
                      </span>
                      <span className={i === 0 ? "text-ink-100" : "text-muted"}>{pt}</span>
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container-page">
          <SectionHeading eyebrow={s.facilitiesHeading.eyebrow} title={s.facilitiesHeading.title} />
          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {s.facilities.map((f) => (
              <StaggerItem key={f.title} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                  <Image src={f.image} alt={f.title} fill quality={70} sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105" />
                </div>
                <h3 className="mt-5 text-2xl text-fg">{f.title}</h3>
                <p className="mt-1 text-sm text-muted">{f.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="container-page">
          <Reveal className="grain relative overflow-hidden rounded-[2rem] bg-ink-900 p-8 text-cream sm:p-14">
            <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
              <Image src={img("b20.jpg")} alt="" fill quality={70} sizes="50vw" className="object-cover opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-r from-ink-900 to-transparent" />
            </div>
            <div className="relative max-w-lg">
              <h2 className="text-4xl sm:text-5xl">{s.cta.title}</h2>
              <p className="mt-4 text-ink-100/85">{s.cta.body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/contact">{s.cta.primary}</ButtonLink>
                <ButtonLink href="/events" variant="outline-light" icon={false}>
                  {s.cta.secondary}
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
