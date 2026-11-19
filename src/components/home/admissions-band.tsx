import { ButtonLink } from "@/components/button-link";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";

type Props = { t: { eyebrow: string; title: string; body: string; cta: string; secondary: string; steps: { title: string; body: string }[] } };

export function AdmissionsBand({ t }: Props) {
  return (
    <section className="py-24 sm:py-32">
      <div className="container-page">
        <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-gold-300 p-8 text-ink-950 sm:p-14 lg:p-16">
          <div aria-hidden className="absolute -top-24 -right-24 size-96 rounded-full border-[40px] border-ink-950/[0.06]" />
          <div aria-hidden className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-gold-200 blur-2xl" />
          <div className="relative grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow flex items-center gap-3 text-ink-800">
                <span className="h-px w-8 bg-current" />
                {t.eyebrow}
              </p>
              <h2 className="mt-4 text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">{t.title}</h2>
              <p className="mt-5 max-w-md text-lg text-ink-900/80">{t.body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/admissions/apply" className="bg-ink-950! text-cream! hover:bg-ink-800!">
                  {t.cta}
                </ButtonLink>
                <ButtonLink href="/admissions" variant="outline" className="border-ink-950/25! text-ink-950! hover:bg-ink-950! hover:text-cream!">
                  {t.secondary}
                </ButtonLink>
              </div>
            </div>
            <Stagger as="ul" className="grid gap-3 sm:grid-cols-2 lg:col-span-7">
              {t.steps.map((s, i) => (
                <StaggerItem as="li" key={s.title} className="rounded-3xl bg-cream/60 p-6 backdrop-blur">
                  <span className="font-display text-4xl text-ink-800/40">0{i + 1}</span>
                  <h3 className="mt-3 text-xl">{s.title}</h3>
                  <p className="mt-1 text-sm text-ink-900/75">{s.body}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
