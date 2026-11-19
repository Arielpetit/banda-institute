"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/cn";

export function PathwayTabs({ t }: { t: Dictionary["secondary"] }) {
  const pathways = t.pathways;
  const [active, setActive] = useState(0);
  const p = pathways[active];

  return (
    <div className="mt-12">
      <div role="tablist" aria-label={t.pathwaysAria} className="inline-flex w-full max-w-md rounded-full bg-tint p-1.5 sm:w-auto">
        {pathways.map((t, i) => (
          <button
            key={t.key}
            role="tab"
            id={`tab-${t.key}`}
            aria-selected={active === i}
            aria-controls={`panel-${t.key}`}
            onClick={() => setActive(i)}
            className={cn(
              "relative min-h-11 flex-1 rounded-full px-5 text-sm font-semibold transition-colors sm:flex-none sm:px-7",
              active === i ? "text-on-primary" : "text-fg-2 hover:text-accent",
            )}
          >
            {active === i && (
              <motion.span layoutId="pathway-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
            )}
            <span className="relative">{t.title}</span>
          </button>
        ))}
      </div>

      <div className="relative mt-8 min-h-[34rem] sm:min-h-[28rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={p.key}
            id={`panel-${p.key}`}
            role="tabpanel"
            aria-labelledby={`tab-${p.key}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid overflow-hidden rounded-[2rem] border border-line bg-surface lg:grid-cols-2"
          >
            <div className="relative aspect-[16/10] lg:aspect-auto">
              <motion.div className="absolute inset-0" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
                <Image src={p.image} alt={p.heading} fill quality={80} sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
              </motion.div>
            </div>
            <div className="p-7 sm:p-10 lg:p-14">
              <p className="eyebrow text-accent">
                {t.pathwayLabel} 0{active + 1}
              </p>
              <h3 className="mt-3 text-4xl text-fg sm:text-5xl">{p.heading}</h3>
              <p className="mt-4 text-lg text-muted">{p.summary}</p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {p.subjects.map((s, i) => (
                  <motion.li
                    key={s}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.06 }}
                    className="flex items-center gap-3 rounded-2xl bg-canvas px-4 py-3 text-sm font-medium text-fg"
                  >
                    <Check className="size-4 text-gold-500" />
                    {s}
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
