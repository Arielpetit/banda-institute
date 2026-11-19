"use client";

import Image from "next/image";
import { LocaleLink } from "@/components/locale-link";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { SplitHeading } from "@/components/reveal";

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  children,
  home,
  breadcrumb,
}: {
  home: string;
  breadcrumb: string;
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="grain relative overflow-hidden bg-ink-900 pt-28 pb-16 text-cream sm:pt-36 lg:pb-24">
      <div
        aria-hidden
        className="absolute -top-40 -right-40 size-[36rem] rounded-full bg-ink-600/40 blur-3xl"
      />
      <div className="container-page relative grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <motion.nav
            aria-label={breadcrumb}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 text-xs text-ink-200"
          >
            <LocaleLink href="/" className="hover:text-gold-300">
              {home}
            </LocaleLink>
            <ChevronRight className="size-3" />
            <span className="text-cream">{eyebrow}</span>
          </motion.nav>
          <SplitHeading
            text={title}
            className="mt-6 text-5xl leading-[1.02] font-medium sm:text-6xl lg:text-7xl"
            delay={0.1}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-100/85"
          >
            {intro}
          </motion.p>
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.9 }}
              className="mt-8"
            >
              {children}
            </motion.div>
          )}
        </div>
        <motion.div
          className="relative aspect-[4/3] overflow-hidden rounded-[2rem] lg:col-span-6"
          initial={{ clipPath: "inset(100% 0 0 0 round 2rem)" }}
          animate={{ clipPath: "inset(0% 0 0 0 round 2rem)" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.25 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <Image src={image} alt={imageAlt} fill priority quality={80} sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-cream/10" />
        </motion.div>
      </div>
    </section>
  );
}
