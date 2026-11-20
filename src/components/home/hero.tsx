"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ButtonLink } from "@/components/button-link";
import type { Dictionary } from "@/i18n/get-dictionary";
import { img } from "@/lib/content";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export function Hero({ t }: { t: Dictionary["home"]["hero"] }) {
  return (
    <section className="relative overflow-hidden pt-28 pb-12 sm:pt-32 lg:pt-36 lg:pb-8">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-gradient-to-b from-tint to-transparent dark:from-tint/60"
      />

      <div className="container-page grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6">
          <motion.p
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold tracking-wide text-accent"
          >
            <span className="size-1.5 rounded-full bg-gold-500" />
            {t.badge}
          </motion.p>

          <motion.h1
            {...fadeUp(0.05)}
            className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] text-fg"
          >
            {t.title}
          </motion.h1>

          <motion.p {...fadeUp(0.12)} className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {t.intro}
          </motion.p>

          <motion.div {...fadeUp(0.18)} className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <ButtonLink href="/admissions/apply" className="col-span-2">
              {t.apply}
            </ButtonLink>
            <ButtonLink href="/primary" variant="outline" icon={false} className="px-4! whitespace-nowrap sm:px-6!">
              {t.primary}
            </ButtonLink>
            <ButtonLink href="/secondary" variant="outline" icon={false} className="px-4! whitespace-nowrap sm:px-6!">
              {t.secondary}
            </ButtonLink>
          </motion.div>

          <motion.dl
            {...fadeUp(0.25)}
            className="mt-10 grid max-w-xl grid-cols-3 gap-3 border-t border-line pt-6 sm:gap-4"
          >
            {t.facts.map(([a, b]) => (
              <div key={a}>
                <dt className="font-display text-lg leading-tight text-fg sm:text-xl">{a}</dt>
                <dd className="mt-1 text-xs leading-snug text-muted sm:text-sm">{b}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:col-span-6"
        >
          <div className="grid grid-cols-5 gap-3 sm:gap-4">
            <div className="relative col-span-5 aspect-[4/3] overflow-hidden rounded-3xl bg-tint sm:col-span-3 sm:row-span-2 sm:aspect-auto">
              <Image
                src={img("f2.jpg")}
                alt={t.photoAlt}
                fill
                priority
                quality={80}
                sizes="(min-width:1024px) 30vw, (min-width:640px) 60vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="relative hidden aspect-square overflow-hidden rounded-3xl bg-tint sm:col-span-2 sm:block lg:aspect-[4/5]">
              <Image src={img("b6.jpg")} alt="" fill quality={70} sizes="(min-width:1024px) 20vw, 40vw" className="object-cover" />
            </div>
            <div className="relative hidden aspect-square overflow-hidden rounded-3xl bg-tint sm:col-span-2 sm:block lg:aspect-[4/5]">
              <Image src={img("b3.jpg")} alt="" fill quality={70} sizes="(min-width:1024px) 20vw, 40vw" className="object-cover" />
            </div>
          </div>

          <div className="absolute -bottom-5 left-4 rounded-2xl border border-line bg-surface px-5 py-4 shadow-lg shadow-black/5 sm:left-6">
            <p className="font-display text-3xl leading-none text-fg">800+</p>
            <p className="mt-1 text-xs font-medium text-muted">{t.learners}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
