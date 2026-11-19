import type { SchoolEvent } from "@/lib/content";

import type { Locale } from "@/i18n/config";

const intl = { en: "en-GB", fr: "fr-FR" } as const;

export function splitDate(iso: string, lang: Locale) {
  const d = new Date(`${iso}T12:00:00Z`);
  const fmt = (o: Intl.DateTimeFormatOptions) => d.toLocaleDateString(intl[lang], { ...o, timeZone: "UTC" });
  const weekday = fmt({ weekday: "long" });
  return {
    day: String(d.getUTCDate()).padStart(2, "0"),
    month: fmt({ month: "short" }).replace(".", ""),
    year: d.getUTCFullYear(),
    weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
  };
}

/** "09:00" -> "09:00" (en) or "09h00" (fr). */
export const formatTime = (time: string, lang: Locale) => (lang === "fr" ? time.replace(":", "h") : time);

const stamp = (date: string, time: string) => `${date.replace(/-/g, "")}T${time.replace(":", "")}00`;

/** An .ics file as a data URI, in Africa/Douala time. */
export function icsHref(e: SchoolEvent) {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//B&A Institute//Events//EN",
    "BEGIN:VEVENT",
    `UID:${e.date}-${e.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}@ba-institute`,
    `DTSTAMP:${stamp(e.date, "00:00")}Z`,
    `DTSTART;TZID=Africa/Douala:${stamp(e.date, e.start)}`,
    `DTEND;TZID=Africa/Douala:${stamp(e.date, e.end)}`,
    `SUMMARY:${e.title}`,
    `LOCATION:${e.place}\\, B&A Institute\\, Nkolbisson\\, Yaoundé`,
    `DESCRIPTION:${e.body.replace(/,/g, "\\,")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

export function googleCalendarHref(e: SchoolEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${stamp(e.date, e.start)}/${stamp(e.date, e.end)}`,
    ctz: "Africa/Douala",
    details: e.body,
    location: `${e.place}, B&A Institute, Nkolbisson, Yaoundé`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
