import { Counter } from "@/components/counter";
import Image from "next/image";
import { Stagger, StaggerItem } from "@/components/reveal";
import type { Dictionary } from "@/i18n/get-dictionary";
import { img } from "@/lib/content";

export function Stats({ t }: { t: Dictionary["home"]["stats"] }) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-950 py-24 text-cream sm:py-32">
      <Image src={img("h1.JPG")} alt="" fill sizes="100vw" quality={70} className="-z-10 object-cover opacity-30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/90 via-ink-950/60 to-ink-950" />
      <div className="container-page">
        <p className="eyebrow text-gold-300">{t.eyebrow}</p>
        <h2 className="mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl">
          {t.titleA} <em className="text-gold-300">{t.titleEm}</em>
          {t.titleB}
        </h2>
        <Stagger className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-cream/10 lg:grid-cols-4">
          {t.items.map((s) => (
            <StaggerItem key={s.label} className="bg-ink-950/70 p-6 backdrop-blur sm:p-8">
              <p className="font-display text-5xl text-gold-300 sm:text-6xl">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-3 text-sm text-ink-200">{s.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
