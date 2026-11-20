# B&A Institute — website redesign

Next.js 16 (App Router) · Tailwind CSS v4 · Motion · Lucide icons.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Design

- Fonts: **Source Serif 4** for headings (classic, calm, sharp at large sizes) and **Inter** for body text (very legible on phones, full French accent support). Both load through `next/font`, so no layout shift.
- Motion is kept subtle: short fade-ups on scroll, no intro screen and no scroll-jacking. All animation respects "reduce motion".
- Fully responsive from 360 px phones to wide desktops (checked at 390, 768, 1280 and 1440 px).

## Features

- English / French (`/en`, `/fr`), automatic language detection, switch in the header.
- Light / dark theme with a circular reveal animation (saved per visitor, follows the system by default).
- Online admissions: `/admissions` (process, requirements, dates) and `/admissions/apply` (5-step application with document upload, draft autosave, review, reference number).

## Structure

- `src/i18n/dictionaries/en.ts` and `fr.ts` — all copy in English and French (events, gallery captions, FAQ…). Edit content here; `fr.ts` is type-checked against `en.ts`, so a missing translation fails the build.
- `src/lib/content.ts` — language-independent data: phone numbers, emails, photo URLs.
- `src/app/[lang]/*` — pages: home, about, primary, secondary, events, gallery, contact, served at `/en/...` and `/fr/...`.
- `src/proxy.ts` — sends visitors without a language in the URL to `/en` or `/fr`, using their saved choice (`NEXT_LOCALE` cookie) or their browser language.
- `src/components/` — header, footer, reveal/motion helpers, gallery lightbox, contact form, FAQ.

## Before launch

- School photos are in `public/images/school` (copied from bandainstitute.com and resized). Every photo on the site is a real school photo; there are no stock images.
- Online applications are saved by `src/app/[lang]/admissions/apply/actions.ts` into `./data/applications/<reference>/` (JSON + uploaded documents). This needs a Node host with a writable disk; on Vercel or other serverless hosting, replace the file writes in `submitApplication` with a database or storage bucket. Add email or WhatsApp notifications to the admissions office before launch.
- Have a native French speaker proofread `fr.ts`.
- Confirm: event dates (2026–27 sample calendar), phone numbers, WhatsApp number, email addresses (`ba-institute.edu`), founding year.
- The contact form opens the visitor's email app or WhatsApp with the message prefilled. It does not store messages on a server.
