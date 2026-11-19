import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p className={cn("eyebrow flex items-center gap-3", align === "center" && "justify-center", tone === "dark" ? "text-accent" : "text-gold-300")}>
        <span className="h-px w-8 bg-current" />
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-4 text-4xl leading-[1.05] font-medium sm:text-5xl",
          tone === "dark" ? "text-fg" : "text-cream",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p className={cn("mt-5 text-lg leading-relaxed", tone === "dark" ? "text-muted" : "text-ink-100/80")}>{intro}</p>
      )}
    </Reveal>
  );
}
