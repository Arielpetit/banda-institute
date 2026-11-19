"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function IntroLoader({ tagline }: { tagline: string }) {
  const [phase, setPhase] = useState<"draw" | "leave" | "done">("draw");

  useEffect(() => {
    if (document.documentElement.dataset.intro !== "1") return;
    try {
      sessionStorage.setItem("intro", "1");
    } catch {}
    const leave = setTimeout(() => setPhase("leave"), 1500);
    const done = setTimeout(() => {
      setPhase("done");
      delete document.documentElement.dataset.intro;
    }, 2400);
    return () => {
      clearTimeout(leave);
      clearTimeout(done);
    };
  }, []);

  if (phase === "done") return null;

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[200] hidden place-items-center bg-ink-950 text-cream [html[data-intro='1']_&]:grid"
      animate={phase === "leave" ? { clipPath: "inset(0 0 100% 0)" } : { clipPath: "inset(0 0 0% 0)" }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex flex-col items-center">
        <svg viewBox="0 0 40 48" className="h-24 w-auto">
          <motion.path
            d="M2 47V20C2 10 10 2 20 2s18 8 18 18v27z"
            fill="none"
            stroke="var(--color-gold-300)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
          />
          <motion.text
            x="20"
            y="36"
            textAnchor="middle"
            fill="var(--color-gold-300)"
            style={{ fontFamily: "var(--font-display)", fontSize: 24, fontStyle: "italic" }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            &amp;
          </motion.text>
        </svg>
        <div className="mt-6 overflow-hidden">
          <motion.p
            className="font-display text-3xl"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            B<span className="text-gold-300 italic">&amp;</span>A Institute
          </motion.p>
        </div>
        <motion.p
          className="eyebrow mt-3 text-ink-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {tagline}
        </motion.p>
        <div className="mt-8 h-px w-40 overflow-hidden bg-cream/10">
          <motion.div
            className="h-full origin-left bg-gold-400"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
}
