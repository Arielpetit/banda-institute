# B&A Institute — website redesign

Next.js 16 (App Router) · Tailwind CSS v4 · Motion · Lucide icons.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Features

- English / French (`/en`, `/fr`), automatic language detection, switch in the header.
- Light / dark theme with a circular reveal animation (saved per visitor, follows the system by default).
- Online admissions: `/admissions` (process, requirements, dates) and `/admissions/apply` (5-step application with document upload, draft autosave, review, reference number).

## Structure

- `src/i18n/dictionaries/en.ts` and `fr.ts` — all copy in English and French (events, gallery captions, FAQ…). Edit content here; `fr.ts` is type-checked against `en.ts`, so a missing translation fails the build.
- `src/lib/content.ts` — language-independent data: phone numbers, emails, photo URLs.
- `src/app/(site)/[lang]/*` — pages: home, about, primary, secondary, events, gallery, contact, served at `/en/...` and `/fr/...`.
- `src/proxy.ts` — sends visitors without a language in the URL to `/en` or `/fr`, using their saved choice (`NEXT_LOCALE` cookie) or their browser language.
- `src/components/` — header, footer, reveal/motion helpers, gallery lightbox, contact form, FAQ.

## Before launch

- School photos are in `public/images/school` (copied from bandainstitute.com and resized). A few generic photos come from Unsplash (free licence); they are listed in `stock` in `src/lib/content.ts`.
- Online applications are saved to Supabase by `src/app/(site)/[lang]/admissions/apply/actions.ts` (row in `ba_applications`, documents in the private `ba-applications` bucket).
- Staff review them at `/admin` (search, filter, status, internal notes, signed document links, CSV export). Access needs a Supabase Auth user flagged `app_metadata.ba_role = "admin"`.

### Admin setup

1. Copy the three Supabase variables into `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`). Never commit it, and never expose the secret key to the browser.
2. Run `supabase/schema.sql` once in the Supabase SQL Editor (creates the table, RLS and the bucket).
3. Create a staff account: `ADMIN_EMAIL=you@school.cm ADMIN_PASSWORD='at-least-10-chars' npm run admin:create`, then sign in at `/admin/login`.

Still to add before launch: email or WhatsApp notification to the admissions office, and a confirmation email to the family.
- Have a native French speaker proofread `fr.ts`.
- Confirm: event dates (2026–27 sample calendar), phone numbers, WhatsApp number, email addresses (`ba-institute.edu`), founding year.
- The contact form opens the visitor's email app or WhatsApp with the message prefilled. It does not store messages on a server.

### Link previews (Open Graph)

Every page has its own title, description, canonical link, language alternates and Open Graph / Twitter tags (`src/lib/seo.ts`). The share image is `public/og/en.jpg` or `public/og/fr.jpg` (1200×630), chosen by language. The address defaults to `https://banda-institute.vercel.app`. When a custom domain goes live, set `NEXT_PUBLIC_SITE_URL` (for example `https://www.bandainstitute.com`) on the host: share links and images are built from it. Social networks cache previews, so re-scrape after changing an image.
