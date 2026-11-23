import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ClipboardCheck, FolderLock, Inbox } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginForm } from "@/components/admin/login-form";
import { img } from "@/lib/content";

export const metadata: Metadata = { title: "Sign in" };

const points = [
  { icon: Inbox, text: "Every online application in one inbox" },
  { icon: ClipboardCheck, text: "Review, decide and keep private notes" },
  { icon: FolderLock, text: "Documents stored securely, staff access only" },
];

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Photo panel */}
      <aside className="relative hidden overflow-hidden bg-ink-950 lg:block">
        <Image
          src={img("h1.jpg")}
          alt=""
          fill
          priority
          quality={80}
          sizes="50vw"
          className="object-cover object-[50%_30%]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/30" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink-950/85 to-transparent" />
        <div className="relative flex h-full flex-col justify-between p-10 xl:p-12">
          <Logo tone="light" tag="Admissions" />

          <div className="max-w-lg">
            <p className="eyebrow text-gold-300">Staff area</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.08] font-medium text-cream xl:text-5xl">
              Welcome every new family with care.
            </h2>
            <ul className="mt-8 space-y-4">
              {points.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-ink-100">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-cream/10 text-gold-300 backdrop-blur">
                    <Icon className="size-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-ink-300">© 2026 B &amp; A Institute Education · Nkolbisson, Yaoundé</p>
        </div>
      </aside>

      {/* Form */}
      <main className="relative flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <span className="lg:invisible">
            <Logo tag="Admissions" />
          </span>
          <ThemeToggle labels={{ light: "Switch to light mode", dark: "Switch to dark mode" }} />
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="font-display text-4xl font-medium text-fg">Sign in</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Access the admissions space of B &amp; A Institute to review applications and contact families.
          </p>
          <LoginForm />
          <Link
            href="/en"
            className="mt-8 inline-flex w-fit items-center gap-2 text-sm text-fg-2 transition-colors hover:text-accent"
          >
            <ArrowLeft className="size-4" /> Back to the website
          </Link>
        </div>
      </main>
    </div>
  );
}
