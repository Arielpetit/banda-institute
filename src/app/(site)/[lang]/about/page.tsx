import type { Metadata } from "next";
import Image from "next/image";
import { Compass, Eye } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { Proprietor } from "@/components/home/proprietor";
import { Stats } from "@/components/home/stats";
import { loadLocale } from "@/i18n/load";
import { img } from "@/lib/content";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { t } = await loadLocale(params);
  return { title: t.about.metaTitle, description: t.about.metaDescription };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { t } = await loadLocale(params);
  const a = t.about;
  return (
    <>
      <PageHero
        home={t.ui.home}
        breadcrumb={t.ui.breadcrumb}
        eyebrow={a.hero.eyebrow}
        title={a.hero.title}
        intro={a.hero.intro}
        image={img("h7.JPG")}
        imageAlt={a.hero.alt}
      />

      <section className="py-24 sm:py-32">
        <div className="container-page">
          <Stagger className="grid gap-5 md:grid-cols-2">
            {[
              { icon: Compass, ...a.mission, tone: "bg-ink-800 text-cream" },
              { icon: Eye, ...a.vision, tone: "bg-gold-300 text-ink-950" },
            ].map(({ icon: Icon, title, body, tone }) => (
              <StaggerItem key={title} className={`rounded-[2rem] p-8 sm:p-12 ${tone}`}>
                <Icon className="size-8" />
                <h2 className="mt-10 text-4xl">{title}</h2>
                <p className="mt-4 max-w-md text-lg leading-relaxed opacity-85">{body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-subtle py-24 sm:py-32">
        <div className="container-page">
          <SectionHeading eyebrow={a.story.eyebrow} title={a.story.title} intro={a.story.intro} />
          <ol className="mt-16 space-y-16 lg:space-y-24">
            {a.timeline.map((item, i) => (
              <li key={item.title} className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
                <Reveal className={`lg:col-span-6 ${i % 2 ? "lg:order-2" : ""}`}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
                    <Image src={item.image} alt={item.title} fill quality={80} sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
                  </div>
                </Reveal>
                <Reveal className="lg:col-span-6" delay={0.1}>
                  <p className="font-display text-6xl text-gold-500 italic sm:text-7xl">{item.year}</p>
                  <h3 className="mt-4 text-3xl text-fg sm:text-4xl">{item.title}</h3>
                  <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">{item.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Proprietor t={t.proprietor} />
      <Stats t={t.home.stats} />
    </>
  );
}
