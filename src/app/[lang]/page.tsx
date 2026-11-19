import { Hero } from "@/components/home/hero";
import { Pillars } from "@/components/home/pillars";
import { Programmes } from "@/components/home/programmes";
import { DayInLife } from "@/components/home/day-in-life";
import { Stats } from "@/components/home/stats";
import { Journey } from "@/components/home/journey";
import { Proprietor } from "@/components/home/proprietor";
import { AdmissionsBand } from "@/components/home/admissions-band";
import { EventsPreview } from "@/components/home/events-preview";
import { loadLocale } from "@/i18n/load";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang, t } = await loadLocale(params);
  const h = t.home;
  return (
    <>
      <Hero t={h.hero} />
      <Pillars t={h.pillars} />
      <Programmes t={h.programmes} />
      <DayInLife t={h.day} />
      <Journey t={h.journey} />
      <Stats t={h.stats} />
      <Proprietor t={t.proprietor} />
      <AdmissionsBand t={h.admissions} />
      <EventsPreview t={t} lang={lang} />
    </>
  );
}
