import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 48" aria-hidden className={cn("h-10 w-auto", className)}>
      <path d="M2 47V20C2 10 10 2 20 2s18 8 18 18v27z" className="fill-plum-800" />
      <path d="M7 47V21c0-7.2 5.8-13 13-13s13 5.8 13 13v26" fill="none" className="stroke-gold-400" strokeWidth="1.5" />
      <text
        x="20"
        y="36"
        textAnchor="middle"
        className="fill-gold-300"
        style={{ fontFamily: "var(--font-display)", fontSize: 24, fontStyle: "italic", fontWeight: 500 }}
      >
        &amp;
      </text>
    </svg>
  );
}

export function Logo({ tone = "dark", tag, className }: { tone?: "dark" | "light"; tag: string; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5 whitespace-nowrap", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-xl font-semibold tracking-tight", tone === "dark" ? "text-fg" : "text-cream")}>
          B<span className="italic text-gold-500">&amp;</span>A Institute
        </span>
        <span
          className={cn(
            "mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em]",
            tone === "dark" ? "text-muted" : "text-ink-300",
          )}
        >
          {tag}
        </span>
      </span>
    </span>
  );
}
