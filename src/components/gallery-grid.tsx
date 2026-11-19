"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/cn";

export function GalleryGrid({ t }: { t: Dictionary["gallery"] & { all: string } }) {
  const gallery = t.items;
  const [tag, setTag] = useState<string | null>(null);
  const [index, setIndex] = useState<number | null>(null);
  const items = tag ? gallery.filter((g) => g.tag === tag) : gallery;

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, close, step]);

  const current = index !== null ? items[index] : null;

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label={t.filterAria}>
        {[null, ...t.tags].map((tg) => (
          <button
            key={tg ?? "all"}
            onClick={() => setTag(tg)}
            aria-pressed={tag === tg}
            className={cn(
              "relative min-h-10 rounded-full px-5 text-sm font-medium transition-colors",
              tag === tg ? "text-on-primary" : "bg-surface text-fg-2 ring-1 ring-line hover:ring-ink-300",
            )}
          >
            {tag === tg && <motion.span layoutId="gallery-pill" className="absolute inset-0 rounded-full bg-primary" />}
            <span className="relative">{tg ?? t.all}</span>
          </button>
        ))}
      </div>

      <motion.ul layout className="mt-10 columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4">
        <AnimatePresence mode="popLayout">
          {items.map((g, i) => (
            <motion.li
              layout
              key={g.src + g.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.03, 0.3) }}
              className="mb-3 break-inside-avoid sm:mb-4"
            >
              <button
                onClick={() => setIndex(i)}
                className="group relative block w-full overflow-hidden rounded-2xl text-left"
                aria-label={`${t.open}: ${g.title}`}
              >
                <Image
                  src={g.src}
                  alt={g.title}
                  width={800}
                  height={i % 3 === 0 ? 1000 : 600}
                  quality={70}
                  sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                  className={cn(
                    "w-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105",
                    i % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]",
                  )}
                />
                <span className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-950/80 via-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span>
                    <span className="block font-display text-lg text-cream">{g.title}</span>
                    <span className="text-xs text-gold-300">{g.tag}</span>
                  </span>
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={current.title}
            className="fixed inset-0 z-[60] flex flex-col bg-ink-950/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <div className="flex items-center justify-between p-4 text-cream sm:p-6">
              <p className="text-sm">
                <span className="font-display text-lg">{current.title}</span>
                <span className="ml-3 text-ink-300 tabular-nums">
                  {(index ?? 0) + 1} / {items.length}
                </span>
              </p>
              <button onClick={close} aria-label={t.close} className="grid size-11 place-items-center rounded-full bg-cream/10 hover:bg-cream/20" autoFocus>
                <X className="size-5" />
              </button>
            </div>
            <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.src}
                  className="absolute inset-4 sm:inset-x-20"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -80) step(1);
                    if (info.offset.x > 80) step(-1);
                  }}
                >
                  <Image src={current.src} alt={current.title} fill quality={80} sizes="100vw" className="pointer-events-none object-contain" />
                </motion.div>
              </AnimatePresence>
              <button onClick={() => step(-1)} aria-label={t.prev} className="absolute top-1/2 left-3 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-cream/10 text-cream hover:bg-cream/20 sm:grid">
                <ChevronLeft className="size-5" />
              </button>
              <button onClick={() => step(1)} aria-label={t.next} className="absolute top-1/2 right-3 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-cream/10 text-cream hover:bg-cream/20 sm:grid">
                <ChevronRight className="size-5" />
              </button>
            </div>
            <p className="p-4 text-center text-xs text-ink-300 sm:hidden">{t.swipe}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
