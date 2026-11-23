import { STATUS_LABEL, type Status } from "@/lib/admin";
import { cn } from "@/lib/cn";

const tone: Record<Status, string> = {
  new: "bg-gold-100 text-gold-700 dark:bg-gold-500/15 dark:text-gold-300",
  in_review: "bg-sky-100 text-sky-800 dark:bg-sky-400/15 dark:text-sky-300",
  accepted: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300",
  waitlisted: "bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-300",
  declined: "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-300",
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        tone[status] ?? tone.new,
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
