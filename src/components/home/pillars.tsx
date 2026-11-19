import Image from "next/image";
import { FlaskConical, GraduationCap, HeartHandshake, Languages } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Stagger, StaggerItem } from "@/components/reveal";
import type { Dictionary } from "@/i18n/get-dictionary";
import { img, stockUrl } from "@/lib/content";
import { cn } from "@/lib/cn";

const icons = { languages: Languages, flask: FlaskConical, graduation: GraduationCap, heart: HeartHandshake };

/** Bento grid: two photo tiles, two colour tiles, one statement tile. */
export function Pillars({ t }: { t: Dictionary["home"]["pillars"] }) {
  const [bilingual, facilities, teachers, character] = t.items;
  const Icon = (k: string) => icons[k as keyof typeof icons] ?? Languages;

  return (
    <section id="why" className="scroll-mt-24 py-24 sm:py-32">
      <div className="container-page">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow={t.eyebrow}
            title={
              <>
                {t.titleA} <em className="text-accent">{t.titleEm}</em> {t.titleB}
              </>
            }
          />
          <p className="max-w-sm text-muted lg:pb-2">{t.aside}</p>
        </div>

        <Stagger className="mt-14 grid auto-rows-[minmax(15rem,auto)] gap-4 md:grid-cols-6">
          <StaggerItem className="group relative overflow-hidden rounded-[2rem] md:col-span-4 md:row-span-2">
            <Image src={img("m1.jpg")} alt="" fill quality={80} sizes="(min-width:768px) 66vw, 100vw" className="object-cover transition-transform duration-[1.6s] ease-out-expo group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent" />
            <div className="relative flex h-full min-h-[26rem] flex-col justify-end p-7 text-cream sm:p-10">
              <Tile icon={Icon(bilingual.icon)} light />
              <h3 className="mt-6 max-w-md text-3xl sm:text-5xl">{bilingual.title}</h3>
              <p className="mt-3 max-w-md text-ink-100/90">{bilingual.body}</p>
            </div>
          </StaggerItem>

          <StaggerItem className="group relative overflow-hidden rounded-[2rem] md:col-span-2">
            <Image src={stockUrl("microscope", 900)} alt="" fill quality={70} sizes="(min-width:768px) 33vw, 100vw" className="object-cover transition-transform duration-[1.6s] ease-out-expo group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 to-ink-950/10" />
            <div className="relative flex h-full flex-col justify-end p-7 text-cream">
              <Tile icon={Icon(facilities.icon)} light />
              <h3 className="mt-4 text-2xl">{facilities.title}</h3>
              <p className="mt-2 text-sm text-ink-100/90">{facilities.body}</p>
            </div>
          </StaggerItem>

          <StaggerItem className="flex flex-col justify-between rounded-[2rem] border border-line bg-surface p-7 md:col-span-2">
            <Tile icon={Icon(teachers.icon)} />
            <div>
              <h3 className="mt-6 text-2xl text-fg">{teachers.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{teachers.body}</p>
            </div>
          </StaggerItem>

          <StaggerItem className="flex flex-col justify-between rounded-[2rem] bg-gold-300 p-7 text-ink-950 md:col-span-3">
            <Tile icon={Icon(character.icon)} gold />
            <div>
              <h3 className="mt-6 text-3xl">{character.title}</h3>
              <p className="mt-2 max-w-md text-ink-900/80">{character.body}</p>
            </div>
          </StaggerItem>

          <StaggerItem className="grain relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-ink-900 p-7 text-cream md:col-span-3">
            <div aria-hidden className="absolute -right-10 -bottom-16 font-display text-[14rem] leading-none text-cream/[0.06] italic">
              &amp;
            </div>
            <p className="eyebrow text-gold-300">{t.exams.eyebrow}</p>
            <div className="relative mt-6 grid grid-cols-2 gap-6">
              {t.exams.items.map(([title, sub]) => (
                <div key={title}>
                  <p className="font-display text-3xl sm:text-4xl">{title}</p>
                  <p className="mt-1 text-sm text-ink-200">{sub}</p>
                </div>
              ))}
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}

function Tile({ icon: Icon, light, gold }: { icon: typeof Languages; light?: boolean; gold?: boolean }) {
  return (
    <span
      className={cn(
        "grid size-12 place-items-center rounded-2xl",
        light ? "bg-cream/15 text-gold-300 backdrop-blur" : gold ? "bg-ink-950 text-gold-300" : "bg-ink-800 text-gold-300",
      )}
    >
      <Icon className="size-5" />
    </span>
  );
}
