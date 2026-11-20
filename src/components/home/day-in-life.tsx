import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { Stagger, StaggerItem } from "@/components/reveal";
import { img } from "@/lib/content";

type Moment = { time: string; title: string; body: string; image: string };

/** A school day in six moments: swipeable row on phones, grid from tablet up. */
export function DayInLife({ t }: { t: { eyebrow: string; title: string; intro: string; moments: Moment[] } }) {
  return (
    <section className="bg-ink-950 py-20 text-cream sm:py-28">
      <div className="container-page">
        <SectionHeading tone="light" eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
      </div>
      <Stagger className="container-page mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3 lg:gap-5">
        {t.moments.map((m) => (
          <StaggerItem
            key={m.time}
            as="article"
            className="relative h-80 w-[80%] shrink-0 snap-start overflow-hidden rounded-3xl bg-ink-900 sm:h-96 sm:w-auto"
          >
            <Image
              src={img(m.image)}
              alt=""
              fill
              quality={70}
              sizes="(min-width:1024px) 26rem, (min-width:640px) 45vw, 80vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/40 to-transparent" />
            <span className="absolute top-5 left-5 rounded-full bg-gold-300 px-3 py-1 text-sm font-semibold text-ink-950 tabular-nums">
              {m.time}
            </span>
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="text-2xl">{m.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-100/85">{m.body}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
