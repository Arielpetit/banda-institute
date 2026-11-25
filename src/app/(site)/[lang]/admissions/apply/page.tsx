import type { Metadata } from "next";
import { ApplicationForm } from "@/components/admissions/application-form";
import { SplitHeading } from "@/components/reveal";
import { loadLocale } from "@/i18n/load";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/admissions/apply">): Promise<Metadata> {
  const { lang, t } = await loadLocale(params);
  return pageMetadata({ lang, path: "/admissions/apply", title: t.admissions.form.metaTitle, description: t.admissions.metaDescription, index: false });
}

export default async function ApplyPage({ params }: PageProps<"/[lang]/admissions/apply">) {
  const { lang, t } = await loadLocale(params);
  const f = t.admissions.form;
  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40">
      <div aria-hidden className="absolute -top-20 right-0 size-[30rem] rounded-full bg-gold-200/40 blur-3xl dark:bg-ink-600/15" />
      <div className="container-page relative">
        <div className="max-w-3xl">
          <p className="eyebrow text-accent">{f.eyebrow}</p>
          <SplitHeading text={f.title} className="mt-4 text-5xl leading-[1.02] font-medium text-fg sm:text-6xl" />
          <p className="mt-5 max-w-xl text-lg text-muted">{f.intro}</p>
        </div>
        <div className="mt-14">
          <ApplicationForm t={f} lang={lang} />
        </div>
      </div>
    </section>
  );
}
