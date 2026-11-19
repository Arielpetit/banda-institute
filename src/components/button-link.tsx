import { LocaleLink } from "@/components/locale-link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type Variant = "gold" | "plum" | "outline" | "outline-light" | "ghost";

const styles: Record<Variant, string> = {
  gold: "bg-gold-400 text-ink-950 hover:bg-gold-300",
  plum: "bg-primary text-on-primary hover:bg-primary-hover",
  outline: "border border-line text-fg hover:border-primary hover:bg-primary hover:text-on-primary",
  "outline-light": "border border-cream/30 text-cream hover:bg-cream hover:text-ink-900",
  ghost: "text-fg-2 hover:text-accent px-0!",
};

export function ButtonLink({
  href,
  children,
  variant = "gold",
  className,
  icon = true,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  icon?: boolean;
}) {
  const external = !href.startsWith("/");
  const cls = cn(
    "group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors duration-300",
    styles[variant],
    className,
  );
  const inner = (
    <>
      <span>{children}</span>
      {icon && (
        <span className="relative grid size-5 place-items-center overflow-hidden">
          <ArrowUpRight className="size-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-5 group-hover:translate-x-5" />
          <ArrowUpRight className="absolute size-4 -translate-x-5 translate-y-5 transition-transform duration-500 ease-out-expo group-hover:translate-x-0 group-hover:translate-y-0" />
        </span>
      )}
    </>
  );
  return external ? (
    <a href={href} className={cls}>
      {inner}
    </a>
  ) : (
    <LocaleLink href={href} className={cls}>
      {inner}
    </LocaleLink>
  );
}
