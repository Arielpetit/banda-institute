import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeading } from "@/components/section-heading";
import { ContactForm } from "@/components/contact-form";
import { Faq } from "@/components/faq";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { loadLocale } from "@/i18n/load";
import { img, site, tel } from "@/lib/content";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { t } = await loadLocale(params);
  return { title: t.contact.metaTitle, description: t.contact.metaDescription };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang, t } = await loadLocale(params);
  const c = t.contact;
  const cards = [
    { icon: MapPin, title: c.cards.visit, lines: [t.location] },
    {
      icon: Phone,
      title: c.cards.call,
      lines: [`${c.cards.administration} · ${site.phones.administration}`, `${c.cards.secondary} · ${site.phones.secondary}`],
      hrefs: [tel(site.phones.administration), tel(site.phones.secondary)],
    },
    {
      icon: Mail,
      title: c.cards.write,
      lines: [site.emails.admissions, site.emails.general],
      hrefs: [`mailto:${site.emails.admissions}`, `mailto:${site.emails.general}`],
    },
    { icon: Clock, title: c.cards.hours, lines: t.hours.map((h) => `${h.day} · ${h.time}`) },
  ];

  return (
    <>
      <PageHero
        home={t.ui.home}
        breadcrumb={t.ui.breadcrumb}
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        intro={c.hero.intro}
        image={img("f2.jpg")}
        imageAlt={c.hero.alt}
      />

      <section className="py-20 sm:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={c.heading.eyebrow} title={c.heading.title} />
            <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {cards.map(({ icon: Icon, title, lines, hrefs }) => (
                <StaggerItem key={title} className="flex gap-4 rounded-3xl border border-line bg-surface p-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-ink-800 text-gold-300">
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-sans text-sm font-bold text-fg">{title}</h3>
                    {lines.map((l, i) =>
                      hrefs?.[i] ? (
                        <a key={l} href={hrefs[i]} className="mt-1 block break-words text-sm text-muted hover:text-accent">
                          {l}
                        </a>
                      ) : (
                        <p key={l} className="mt-1 text-sm text-muted">
                          {l}
                        </p>
                      ),
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <Reveal className="rounded-[2rem] border border-line bg-surface p-6 shadow-[0_40px_80px_-50px_rgba(66,29,75,0.5)] sm:p-10 lg:col-span-7" delay={0.1}>
            <h2 className="text-3xl text-fg">{c.formTitle}</h2>
            <p className="mt-2 mb-8 text-sm text-muted">{c.formIntro}</p>
            <ContactForm t={c.form} />
          </Reveal>
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="container-page">
          <Reveal className="overflow-hidden rounded-[2rem] border border-line">
            <iframe
              title={c.mapTitle}
              src={`https://www.google.com/maps?q=Nkolbisson,+Yaound%C3%A9,+Cameroon&z=14&hl=${lang}&output=embed`}
              className="h-[24rem] w-full grayscale-[30%] sm:h-[28rem]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-subtle py-20 sm:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={c.faqHeading.eyebrow} title={c.faqHeading.title} />
          </div>
          <Reveal className="lg:col-span-8">
            <Faq faqs={c.faqs} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
