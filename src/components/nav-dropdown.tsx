"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { NavLink } from "@/i18n/nav";
import { img } from "@/lib/content";
import { cn } from "@/lib/cn";

const thumbs: Record<string, string> = {
  "/primary": img("m8.jpg"),
  "/secondary": img("b4.jpg"),
};

/** Nav group: opens on hover, click or keyboard; closes on leave, Escape or outside click. */
export function NavDropdown({
  label,
  items,
  active,
  href,
}: {
  label: string;
  items: (NavLink & { desc: string })[];
  active: boolean;
  href: (path: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const id = useId();

  const show = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        root.current?.querySelector("button")?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <li
      ref={root}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
          active ? "text-on-primary" : "text-fg hover:text-accent",
        )}
      >
        {active && (
          <motion.span
            layoutId="nav-pill"
            className="absolute inset-0 rounded-full bg-primary"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
        )}
        <span className="relative">{label}</span>
        <ChevronDown className={cn("relative size-3.5 transition-transform duration-300", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={id}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-1/2 z-10 w-[25rem] -translate-x-1/2 pt-3"
          >
            <ul className="rounded-3xl border border-line bg-surface p-2 shadow-[0_24px_60px_-20px_rgb(var(--shadow)/0.35)]">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={href(item.href)}
                    onClick={() => setOpen(false)}
                    className="group flex items-center gap-4 rounded-2xl p-2.5 transition-colors hover:bg-tint focus-visible:bg-tint"
                  >
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-tint">
                      {thumbs[item.href] && (
                        <Image src={thumbs[item.href]} alt="" fill sizes="56px" quality={70} className="object-cover object-[50%_30%]" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-fg">{item.label}</span>
                      <span className="block truncate text-xs text-muted">{item.desc}</span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 -translate-x-1 text-accent opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
