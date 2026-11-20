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
    <section className="relative overflow-hidden bg-ink-900 pt-28 pb-14 text-cream sm:pt-32 lg:pb-20">
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
            className="mt-5 text-4xl leading-[1.08] sm:text-5xl lg:text-6xl"
            delay={0.1}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-100/85"
          >
            {intro}
          </motion.p>
          {children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mt-8"
            >
              {children}
            </motion.div>
          )}
        </div>
        <motion.div
          className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink-800 lg:col-span-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <Image src={image} alt={imageAlt} fill priority quality={80} sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-cream/10" />
        </motion.div>
      </div>
    </section>
  );
}
