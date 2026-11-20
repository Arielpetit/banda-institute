import Image from "next/image";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/reveal";
import type { Dictionary } from "@/i18n/get-dictionary";
import { img } from "@/lib/content";

export function Proprietor({ t: proprietor }: { t: Dictionary["proprietor"] }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-12">
        <Reveal className="relative mx-auto w-full max-w-sm lg:col-span-4">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] rounded-tl-[8rem]">
            <Image src={img("H8.JPG")} alt={proprietor.name} fill quality={80} sizes="(min-width:1024px) 30vw, 80vw" className="object-cover object-top" />
          </div>
          <div className="absolute -right-4 -bottom-4 -z-10 size-full rounded-[2rem] rounded-tl-[8rem] bg-gold-300" />
        </Reveal>
        <Reveal className="lg:col-span-8 lg:pl-10" delay={0.15}>
          <Quote className="size-12 fill-tint text-tint" />
          <blockquote className="mt-4 font-display text-2xl leading-snug text-fg sm:text-3xl lg:text-4xl">
            {proprietor.quote}
          </blockquote>
          <div className="mt-8 flex items-center gap-4">
            <span className="h-px w-12 bg-gold-500" />
            <div>
              <p className="font-semibold text-fg">{proprietor.name}</p>
              <p className="text-sm text-muted">{proprietor.role}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
