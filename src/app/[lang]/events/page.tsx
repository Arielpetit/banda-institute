import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { EventsList } from "@/components/events-list";
import { Stagger, StaggerItem } from "@/components/reveal";
import { loadLocale } from "@/i18n/load";
import { img } from "@/lib/content";

export async function generateMetadata({ params }: PageProps<"/[lang]/events">): Promise<Metadata> {
  const { t } = await loadLocale(params);
  return { title: t.events.metaTitle, description: t.events.metaDescription };
}

export default async function EventsPage({ params }: PageProps<"/[lang]/events">) {
  const { lang, t } = await loadLocale(params);
  const e = t.events;
  return (
    <>
      <PageHero
        home={t.ui.home}
        breadcrumb={t.ui.breadcrumb}
        eyebrow={e.hero.eyebrow}
        title={e.hero.title}
        intro={e.hero.intro}
        image={img("f1.jpg")}
        imageAlt={e.hero.alt}
      />
      <section className="py-24 sm:py-32">
        <div className="container-page">
          <SectionHeading eyebrow={e.upcoming.eyebrow} title={e.upcoming.title} />
          <EventsList
            events={e.list}
            lang={lang}
            labels={{ all: t.ui.all, filter: e.filterAria, addToCalendar: t.ui.addToCalendar, googleCalendar: t.ui.googleCalendar }}
          />
        </div>
      </section>
      <section className="bg-subtle py-24 sm:py-32">
        <div className="container-page">
          <SectionHeading eyebrow={e.calendarHeading.eyebrow} title={e.calendarHeading.title} />
          <Stagger className="mt-12 grid gap-4 md:grid-cols-3">
            {e.terms.map((term, i) => (
              <StaggerItem key={term.term} className="relative overflow-hidden rounded-3xl bg-surface p-8 ring-1 ring-line">
                <span className="absolute -top-6 -right-2 font-display text-[8rem] leading-none text-ink-50">{i + 1}</span>
                <div className="relative">
                  <h3 className="text-2xl text-fg">{term.term}</h3>
                  <p className="mt-6 flex items-center gap-3 text-sm font-medium text-accent">
                    {term.from}
                    <span className="h-px flex-1 bg-gradient-to-r from-gold-400 to-ink-500" />
                    {term.to}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-6 text-sm text-muted">{e.calendarNote}</p>
        </div>
      </section>
    </>
  );
}
