"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { SplitHeading } from "@/components/reveal";
import type { Dictionary } from "@/i18n/get-dictionary";
import { img } from "@/lib/content";
import { cn } from "@/lib/cn";

const columns = [
  ["m1.jpg", "b4.jpg", "m8.jpg", "b13.jpg", "m10.jpg"],
  ["b9.jpg", "m17.jpg", "b18.jpg", "m15.jpg", "b6.jpg"],
  ["m3.jpg", "b19.jpg", "f4.jpg", "b10.jpg", "m14.jpg"],
];

function PhotoColumn({ files, direction, className }: { files: string[]; direction: "up" | "down"; className?: string }) {
  const doubled = [...files, ...files];
  return (
    <div className={cn("relative h-full overflow-hidden", className)}>
      <div
        className={cn(
          "flex flex-col gap-3 sm:gap-4",
          direction === "up" ? "animate-scroll-up" : "animate-scroll-down",
          "hover:[animation-play-state:paused]",
        )}
      >
        {doubled.map((f, i) => (
          <div
            key={i}
            aria-hidden={i >= files.length}
            className={cn(
              "relative w-full shrink-0 overflow-hidden rounded-2xl bg-tint sm:rounded-3xl",
              i % 3 === 1 ? "aspect-[4/5]" : "aspect-[4/3]",
            )}
          >
            <Image src={img(f)} alt="" fill quality={70} sizes="(min-width:1024px) 16vw, 33vw" className="object-cover" priority={i < 2} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero({ t }: { t: Dictionary["home"]["hero"] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <section ref={ref} className="relative overflow-hidden pt-24 lg:min-h-[100svh] lg:pt-0">
      <div aria-hidden className="absolute top-20 -left-40 size-[34rem] rounded-full bg-gold-200/50 blur-3xl dark:bg-gold-500/10" />
      <div aria-hidden className="absolute -right-40 -bottom-20 size-[34rem] rounded-full bg-ink-200/60 blur-3xl dark:bg-ink-600/20" />

      <div className="container-page relative grid items-center gap-12 lg:min-h-[100svh] lg:grid-cols-12 lg:gap-8">
        <motion.div style={{ y: yText, opacity: fade }} className="pt-8 lg:col-span-6 lg:pt-24">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-4 py-2 text-accent backdrop-blur"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold-500 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-gold-500" />
            </span>
            {t.badge}
          </motion.p>

          <SplitHeading
            text={t.title}
            className="mt-7 text-[clamp(2.75rem,7vw,6rem)] leading-[0.95] font-medium text-fg"
            delay={0.15}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9 }}
            className="mt-7 max-w-lg text-lg leading-relaxed text-muted"
          >
            {t.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.9 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <ButtonLink href="/admissions/apply">{t.apply}</ButtonLink>
            <ButtonLink href="/primary" variant="outline">
              {t.primary}
            </ButtonLink>
            <span className="hidden sm:contents">
              <ButtonLink href="/secondary" variant="outline">
                {t.secondary}
              </ButtonLink>
            </span>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 1 }}
            className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-line pt-6"
          >
            {t.facts.map(([a, b]) => (
              <div key={a}>
                <dt className="font-display text-lg leading-tight text-fg sm:text-xl">{a}</dt>
                <dd className="mt-1 text-xs text-muted sm:text-sm">{b}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        <motion.div
          style={{ scale }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mask-fade-y relative -mx-4 grid h-[30rem] grid-cols-3 gap-3 sm:mx-0 sm:h-[38rem] sm:gap-4 lg:col-span-6 lg:h-[100svh]"
        >
          <PhotoColumn files={columns[0]} direction="up" />
          <PhotoColumn files={columns[1]} direction="down" className="-mt-16" />
          <PhotoColumn files={columns[2]} direction="up" className="mt-10" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 18 }}
            className="absolute bottom-[14%] left-4 rounded-2xl border border-line bg-surface/90 p-4 shadow-2xl shadow-black/10 backdrop-blur sm:left-0"
          >
            <p className="font-display text-3xl text-fg">800+</p>
            <p className="text-xs font-medium text-muted">{t.learners}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, rotate: -40 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 1.3, duration: 1 }}
            className="absolute top-[16%] right-4 size-28 sm:right-0 sm:size-32"
            aria-hidden
          >
            <svg viewBox="0 0 120 120" className="size-full animate-[spin_24s_linear_infinite] drop-shadow-xl motion-reduce:animate-none">
              <circle cx="60" cy="60" r="58" className="fill-gold-400" />
              <defs>
                <path id="hero-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
              </defs>
              <text className="fill-ink-950 text-[11px] font-bold tracking-[0.2em] uppercase">
                <textPath href="#hero-circle">English · Français · Excellence ·</textPath>
              </text>
              <text x="60" y="70" textAnchor="middle" className="fill-ink-900" style={{ fontFamily: "var(--font-display)", fontSize: 30, fontStyle: "italic" }}>
                &amp;
              </text>
            </svg>
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        href="#why"
        style={{ opacity: fade }}
        aria-label={t.scroll}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-semibold tracking-widest text-muted uppercase lg:flex"
      >
        {t.scroll}
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <ArrowDown className="size-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}
