import type { Metadata } from "next";
import Image from "next/image";
import { Check, Music, Palette, Sprout, Theater } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { ButtonLink } from "@/components/button-link";
import { loadLocale } from "@/i18n/load";
import { img } from "@/lib/content";

export async function generateMetadata({ params }: PageProps<"/[lang]/primary">): Promise<Metadata> {
  const { t } = await loadLocale(params);
  return { title: t.primary.metaTitle, description: t.primary.metaDescription };
}

const clubs = [
  { icon: Music, image: img("m9.JPG") },
  { icon: Palette, image: img("m10.JPG") },
  { icon: Theater, image: img("m12.JPG") },
  { icon: Sprout, image: img("m14.JPG") },
];

export default async function PrimaryPage({ params }: PageProps<"/[lang]/primary">) {
  const { t } = await loadLocale(params);
  const p = t.primary;
  return (
    <>
      <PageHero
        home={t.ui.home}
        breadcrumb={t.ui.breadcrumb}
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        intro={p.hero.intro}
        image={img("m17.JPG")}
        imageAlt={p.hero.alt}
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/contact">{p.hero.cta}</ButtonLink>
          <ButtonLink href="#stages" variant="outline-light" icon={false}>
            {p.hero.stages}
          </ButtonLink>
        </div>
      </PageHero>

      <section id="stages" className="scroll-mt-24 py-24 sm:py-32">
        <div className="container-page">
          <SectionHeading eyebrow={p.stagesHeading.eyebrow} title={p.stagesHeading.title} intro={p.stagesHeading.intro} />
          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {p.stages.map((s) => (
              <StaggerItem key={s.title} className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-surface">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    quality={70}
                    sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-gold-400 px-3 py-1 text-xs font-bold text-ink-950">{s.ages}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl text-fg">{s.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {s.points.map((pt) => (
                      <li key={pt} className="flex gap-2.5 text-sm text-muted">
                        <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow={p.bilingual.eyebrow} title={p.bilingual.title} intro={p.bilingual.intro} />
            <Reveal className="mt-8 grid gap-4 sm:grid-cols-2" delay={0.1}>
              {p.bilingual.cards.map(([title, body]) => (
                <div key={title} className="rounded-2xl border border-line bg-surface p-5">
                  <p className="font-display text-xl text-fg">{title}</p>
                  <p className="mt-1 text-sm text-muted">{body}</p>
                </div>
              ))}
            </Reveal>
          </div>
          <Reveal className="grid grid-cols-2 gap-4" delay={0.15}>
            <div className="relative mt-12 aspect-[3/4] overflow-hidden rounded-3xl">
              <Image src={img("M2.JPG")} alt={p.bilingual.altA} fill quality={70} sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
              <Image src={img("m18.JPG")} alt={p.bilingual.altB} fill quality={70} sizes="(min-width:1024px) 25vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink-900 py-24 text-cream sm:py-32">
        <div className="container-page">
          <SectionHeading tone="light" eyebrow={p.clubs.eyebrow} title={p.clubs.title} />
          <Stagger className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {clubs.map(({ icon: Icon, image }, i) => (
              <StaggerItem key={image} className="group relative aspect-[3/4] overflow-hidden rounded-3xl">
                <Image src={image} alt={p.clubs.items[i]} fill quality={70} sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10" />
                <div className="absolute inset-x-5 bottom-5 flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold-400 text-ink-950">
                    <Icon className="size-4" />
                  </span>
                  <span className="font-display text-xl sm:text-2xl">{p.clubs.items[i]}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
