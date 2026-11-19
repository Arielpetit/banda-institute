"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SectionHeading } from "@/components/section-heading";
import type { Dictionary } from "@/i18n/get-dictionary";

export function Journey({ t }: { t: Dictionary["home"]["journey"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="py-24 sm:py-32">
      <div className="container-page grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              eyebrow={t.eyebrow}
              title={
                <>
                  {t.titleA} <em className="text-accent">{t.titleEm}</em>.
                </>
              }
              intro={t.intro}
            />
          </div>
        </div>

        <div ref={ref} className="relative lg:col-span-7">
          <div className="absolute top-2 bottom-2 left-[1.375rem] w-px bg-line" aria-hidden />
          <motion.div
            style={{ scaleY: scale }}
            className="absolute top-2 bottom-2 left-[1.375rem] w-px origin-top bg-gradient-to-b from-gold-400 to-ink-600"
            aria-hidden
          />
          <ol className="space-y-4">
            {t.items.map((j, i) => (
              <motion.li
                key={j.stage}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                transition={{ duration: 0.8, delay: 0.05 }}
                className="relative flex gap-6"
              >
                <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border border-line bg-canvas font-display text-fg-2">
                  {i + 1}
                </span>
                <div className="group flex flex-1 flex-col justify-between gap-1 rounded-2xl border border-transparent p-4 transition-colors hover:border-line hover:bg-surface sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-2xl text-fg">{j.stage}</h3>
                    <p className="text-sm text-muted">{j.note}</p>
                  </div>
                  <span className="w-fit rounded-full bg-tint px-3 py-1 text-xs font-semibold text-accent">{j.ages}</span>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
