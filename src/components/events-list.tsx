"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { EventCard } from "@/components/event-card";
import type { Locale } from "@/i18n/config";
import type { SchoolEvent } from "@/lib/content";
import { cn } from "@/lib/cn";

export function EventsList({
  events,
  lang,
  labels,
}: {
  events: SchoolEvent[];
  lang: Locale;
  labels: { all: string; filter: string; addToCalendar: string; googleCalendar: string };
}) {
  const [cat, setCat] = useState<string | null>(null);
  const categories = Array.from(new Set(events.map((e) => e.category)));
  const list = cat ? events.filter((e) => e.category === cat) : events;

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label={labels.filter}>
        {[null, ...categories].map((c) => (
          <button
            key={c ?? "all"}
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={cn(
              "min-h-10 rounded-full border px-5 text-sm font-medium transition-colors",
              cat === c ? "border-primary bg-primary text-on-primary" : "border-line bg-surface text-fg-2 hover:border-ink-300",
            )}
          >
            {c ?? labels.all}
          </button>
        ))}
      </div>
      <motion.div layout className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((e) => (
            <motion.div
              layout
              key={e.date + e.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <EventCard event={e} lang={lang} labels={labels} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
