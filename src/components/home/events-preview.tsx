import { ButtonLink } from "@/components/button-link";
import { EventCard } from "@/components/event-card";
import { SectionHeading } from "@/components/section-heading";
import { Stagger, StaggerItem } from "@/components/reveal";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

export function EventsPreview({ t, lang }: { t: Dictionary; lang: Locale }) {
  const h = t.home.events;
  return (
    <section className="py-24 sm:py-32">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow={h.eyebrow} title={h.title} />
          <ButtonLink href="/events" variant="outline">
            {h.cta}
          </ButtonLink>
        </div>
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {t.events.list.slice(0, 3).map((e, i) => (
            <StaggerItem key={e.date + e.title} className={i === 2 ? "sm:hidden lg:block" : ""}>
              <EventCard event={e} lang={lang} labels={t.ui} compact />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
