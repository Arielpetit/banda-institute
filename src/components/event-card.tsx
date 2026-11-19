import Image from "next/image";
import { CalendarPlus, Clock, MapPin } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { SchoolEvent } from "@/lib/content";
import { formatTime, googleCalendarHref, icsHref, splitDate } from "@/lib/dates";

export function EventCard({
  event,
  lang,
  labels,
  compact = false,
}: {
  event: SchoolEvent;
  lang: Locale;
  labels: { addToCalendar: string; googleCalendar: string };
  compact?: boolean;
}) {
  const d = splitDate(event.date, lang);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(66,29,75,0.4)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={event.image}
          alt=""
          fill
          quality={70}
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex flex-col items-center rounded-2xl bg-canvas px-3.5 py-2 text-center shadow-lg">
          <span className="font-display text-2xl leading-none text-fg">{d.day}</span>
          <span className="eyebrow mt-1 text-[0.6rem] text-accent">
            {d.month} {String(d.year).slice(2)}
          </span>
        </div>
        <span className="absolute top-4 right-4 rounded-full bg-ink-900/80 px-3 py-1 text-xs font-medium text-cream backdrop-blur">
          {event.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl text-fg">{event.title}</h3>
        {!compact && <p className="mt-2 text-sm leading-relaxed text-muted">{event.body}</p>}
        <ul className="mt-4 space-y-1.5 text-sm text-fg-2">
          <li className="flex items-center gap-2">
            <Clock className="size-4 shrink-0 text-gold-500" />
            {d.weekday}, {formatTime(event.start, lang)} – {formatTime(event.end, lang)}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-gold-500" />
            {event.place}
          </li>
        </ul>
        {!compact && (
          <div className="mt-auto flex flex-wrap gap-2 pt-6">
            <a
              href={icsHref(event)}
              download={`${event.title}.ics`}
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-tint px-4 text-xs font-semibold text-fg-2 transition-colors hover:bg-primary hover:text-on-primary"
            >
              <CalendarPlus className="size-4" /> {labels.addToCalendar}
            </a>
            <a
              href={googleCalendarHref(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center rounded-full px-4 text-xs font-semibold text-accent underline-offset-4 hover:underline"
            >
              {labels.googleCalendar}
            </a>
          </div>
        )}
      </div>
    </article>
  );
}
