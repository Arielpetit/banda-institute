"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/section-heading";
import { img } from "@/lib/content";

type Moment = { time: string; title: string; body: string; image: string };

/** Pinned section: vertical scroll moves a row of moments horizontally. */
export function DayInLife({ t }: { t: { eyebrow: string; title: string; intro: string; moments: Moment[] } }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={section} className="relative bg-ink-950 text-cream" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="grain sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-24">
        <div className="container-page">
          <SectionHeading tone="light" eyebrow={t.eyebrow} title={t.title} intro={t.intro} />
        </div>
        <motion.div ref={track} style={{ x }} className="mt-12 flex w-max gap-5 pr-[10vw] pl-4 sm:pl-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          {t.moments.map((m, i) => (
            <article key={m.time} className="group relative h-[22rem] w-[78vw] shrink-0 overflow-hidden rounded-[2rem] sm:h-[26rem] sm:w-[26rem]">
              <Image src={img(m.image)} alt={m.title} fill quality={70} sizes="(min-width:640px) 26rem, 78vw" className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/95 via-ink-950/30 to-transparent" />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
                <span className="rounded-full bg-gold-400 px-3 py-1 font-display text-lg text-ink-950 tabular-nums">{m.time}</span>
                <span className="font-display text-sm text-cream/60">0{i + 1}</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="text-2xl sm:text-3xl">{m.title}</h3>
                <p className="mt-2 text-sm text-ink-100/85">{m.body}</p>
              </div>
            </article>
          ))}
        </motion.div>
        <div className="container-page mt-10">
          <div className="h-px w-full bg-cream/10">
            <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-gold-400" />
          </div>
        </div>
      </div>
    </section>
  );
}
