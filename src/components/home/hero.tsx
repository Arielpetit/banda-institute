"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { MapPin } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { SplitHeading } from "@/components/reveal";
import type { Dictionary } from "@/i18n/get-dictionary";
import { img } from "@/lib/content";

const ease = [0.76, 0, 0.24, 1] as const;

/**
 * Text and photo side by side, inside the header's width. The photo card is
 * exactly as tall as the text block: its top lines up with the badge, its
 * bottom with the facts. The whole block is centred on the first screen.
 */
export function Hero({ t }: { t: Dictionary["home"]["hero"] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const zoom = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const facts = [["800+", t.learners], ...t.facts].map(([a, b]) => [a, b] as const);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-28 pb-12 sm:pt-32 lg:pt-36 lg:pb-16"
    >
      <div aria-hidden className="absolute -top-48 -left-40 size-[38rem] rounded-full bg-gold-200/40 blur-3xl dark:bg-gold-500/[0.07]" />

      <div className="container-page relative grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-stretch lg:gap-14">
        {/* Text */}
        <div className="flex flex-col justify-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-2 text-accent backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold-500 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-gold-500" />
            </span>
            {t.badge}
          </motion.p>

          <SplitHeading
            text={t.title}
            className="mt-6 text-[clamp(2.4rem,3.9vw,3.9rem)] leading-[1.04] font-medium text-fg"
            delay={0.15}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-muted"
          >
            {t.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.9 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <ButtonLink href="/admissions/apply">{t.apply}</ButtonLink>
            <ButtonLink href="/about" variant="outline">
              {t.explore}
            </ButtonLink>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-7 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
          >
            {facts.map(([a, b]) => (
              <div key={a}>
                <dt className="font-display text-2xl leading-none whitespace-nowrap text-fg">{a}</dt>
                <dd className="mt-2 text-xs leading-snug text-muted">{b}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Photo card: same height as the text column on large screens */}
        <motion.div
          className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl shadow-black/10 lg:aspect-auto lg:h-full lg:min-h-[30rem] lg:rounded-[2.5rem]"
          initial={{ clipPath: "inset(12% 0% 12% 30% round 2.5rem)", opacity: 0 }}
          animate={{ clipPath: "inset(0% 0% 0% 0% round 2.5rem)", opacity: 1 }}
          transition={{ duration: 1.3, ease, delay: 0.25 }}
        >
          <motion.div style={{ scale: zoom }} className="absolute inset-0">
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.18 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            >
              <Image
                src={img("h1.jpg")}
                alt={t.imgA}
                fill
                priority
                quality={80}
                sizes="(min-width:1024px) 52vw, 100vw"
                className="object-cover object-[50%_35%]"
              />
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="absolute bottom-5 left-5 inline-flex items-center gap-1.5 rounded-full bg-ink-950/55 px-3.5 py-2 text-xs font-medium text-cream backdrop-blur-md lg:bottom-6 lg:left-6"
          >
            <MapPin className="size-3.5 text-gold-300" />
            Nkolbisson, Yaoundé
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
