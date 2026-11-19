import { lang } from "next/root-params";
import { ButtonLink } from "@/components/button-link";
import { defaultLocale, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function NotFound() {
  const current = await lang();
  const t = (await getDictionary(current && hasLocale(current) ? current : defaultLocale)).notFound;
  return (
    <section className="grid min-h-[80dvh] place-items-center px-4 pt-28 text-center">
      <div>
        <p className="font-display text-[8rem] leading-none text-ink-100 italic sm:text-[12rem]">404</p>
        <h1 className="-mt-6 text-4xl text-fg sm:text-5xl">{t.title}</h1>
        <p className="mt-4 text-muted">{t.body}</p>
        <ButtonLink href="/" className="mt-8" variant="plum">
          {t.cta}
        </ButtonLink>
      </div>
    </section>
  );
}
