import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { GalleryGrid } from "@/components/gallery-grid";
import { loadLocale } from "@/i18n/load";
import { img } from "@/lib/content";

export async function generateMetadata({ params }: PageProps<"/[lang]/gallery">): Promise<Metadata> {
  const { t } = await loadLocale(params);
  return { title: t.gallery.metaTitle, description: t.gallery.metaDescription };
}

export default async function GalleryPage({ params }: PageProps<"/[lang]/gallery">) {
  const { t } = await loadLocale(params);
  const g = t.gallery;
  return (
    <>
      <PageHero
        home={t.ui.home}
        breadcrumb={t.ui.breadcrumb}
        eyebrow={g.hero.eyebrow}
        title={g.hero.title}
        intro={g.hero.intro}
        image={img("m19.JPG")}
        imageAlt={g.hero.alt}
      />
      <section className="py-20 sm:py-28">
        <div className="container-page">
          <GalleryGrid t={{ ...g, all: t.ui.all }} />
        </div>
      </section>
    </>
  );
}
