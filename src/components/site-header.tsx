"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Languages, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/button-link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LOCALE_COOKIE, localizeHref, switchLocalePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site, tel } from "@/lib/content";
import { cn } from "@/lib/cn";

type Props = {
  lang: Locale;
  ui: Dictionary["ui"];
  nav: Dictionary["nav"];
  contactLabel: string;
  location: string;
};

export function SiteHeader({ lang, ui, nav, contactLabel, location }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const other: Locale = lang === "en" ? "fr" : "en";

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 400 && y > prev && !open);
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const href = (path: string) => localizeHref(path, lang);
  const isActive = (path: string) => {
    const full = href(path);
    return path === "/" ? pathname === full : pathname.startsWith(full);
  };
  const rememberLocale = () => {
    document.cookie = `${LOCALE_COOKIE}=${other}; path=/; max-age=31536000; samesite=lax`;
    setOpen(false);
  };
  const switchHref = switchLocalePath(pathname, other);
  const navItems = [...nav, { href: "/contact", label: contactLabel }];
  const items = [{ href: "/", label: ui.home }, ...navItems];

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4"
        animate={{ y: hidden ? "-120%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={cn(
            "mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 rounded-full border px-2 pl-3.5 transition-all duration-500 sm:pl-5",
            scrolled || open
              ? "border-line bg-canvas shadow-[0_8px_30px_-12px_rgb(var(--shadow)/0.25)]"
              : "border-line/60 bg-canvas",
          )}
        >
          <Link href={href("/")} aria-label={ui.homeAria} onClick={() => setOpen(false)}>
            <Logo tag={ui.logoTag} />
          </Link>

          <nav aria-label={ui.mainNav} className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={href(item.href)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "relative block rounded-full px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                      isActive(item.href) ? "text-on-primary" : "text-fg hover:text-accent",
                    )}
                  >
                    {isActive(item.href) && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href={switchHref}
              hrefLang={other}
              lang={other}
              onClick={rememberLocale}
              aria-label={ui.switchAria}
              title={ui.switchTo}
              className="group relative hidden h-11 items-center gap-1.5 sm:flex overflow-hidden rounded-full border border-line px-2.5 text-xs sm:px-3 font-bold tracking-wider text-fg-2 transition-colors hover:border-primary hover:bg-primary hover:text-on-primary"
            >
              <Languages className="hidden size-4 transition-transform duration-500 group-hover:rotate-[20deg] sm:block" />
              <span aria-hidden className="flex items-center gap-1">
                <span>{lang.toUpperCase()}</span>
                <span className="opacity-40">/</span>
                <span className="opacity-50 transition-opacity group-hover:opacity-100">{ui.switchShort}</span>
              </span>
            </Link>
            <ThemeToggle labels={{ light: ui.themeLight, dark: ui.themeDark }} />
            <a
              href={tel(site.phones.administration)}
              className="hidden size-11 place-items-center rounded-full text-fg-2 transition-colors hover:bg-tint md:grid xl:hidden 2xl:grid"
              aria-label={`${ui.call} ${site.phones.administration}`}
            >
              <Phone className="size-4" />
            </a>
            <span className="hidden sm:block">
              <ButtonLink href="/admissions" icon={false}>
                {ui.visit}
              </ButtonLink>
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? ui.closeMenu : ui.openMenu}
              className="grid size-12 place-items-center rounded-full bg-primary text-on-primary xl:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "x" : "m"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {open ? <X className="size-5" /> : <Menu className="size-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink-900 px-6 pt-28 pb-10 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.ul
              className="flex flex-col"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } } }}
            >
              {items.map((item) => (
                <motion.li
                  key={item.href}
                  className="border-b border-cream/10"
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                >
                  <Link
                    href={href(item.href)}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-baseline gap-4 py-3.5 font-display text-3xl sm:text-4xl",
                      isActive(item.href) ? "text-gold-300" : "text-cream",
                    )}
                  >
                                        {item.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div
              className="mt-auto space-y-2 pt-10 text-sm text-ink-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.15 } }}
            >
              <div className="mb-6 inline-flex rounded-full bg-cream/10 p-1">
                {(["en", "fr"] as const).map((l) => (
                  <Link
                    key={l}
                    href={switchLocalePath(pathname, l)}
                    hrefLang={l}
                    onClick={l === lang ? () => setOpen(false) : rememberLocale}
                    aria-current={l === lang ? "true" : undefined}
                    className={cn(
                      "rounded-full px-5 py-2.5 text-sm font-semibold",
                      l === lang ? "bg-gold-400 text-ink-950" : "text-cream",
                    )}
                  >
                    {l === "en" ? "English" : "Français"}
                  </Link>
                ))}
              </div>
              <p>{location}</p>
              <a className="block text-cream" href={tel(site.phones.administration)}>
                {site.phones.administration}
              </a>
              <a className="block text-cream" href={`mailto:${site.emails.general}`}>
                {site.emails.general}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
