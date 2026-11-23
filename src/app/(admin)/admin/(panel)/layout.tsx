import Link from "next/link";
import { Suspense } from "react";
import { LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { requireAdmin } from "@/lib/supabase/auth";
import { signOut } from "../actions";

// Everything here reads the session, so it renders per request instead of prerendering.
export const instant = false;

async function UserMenu() {
  const user = await requireAdmin();
  return (
    <div className="flex items-center gap-2">
      <span className="hidden max-w-48 truncate text-sm text-muted sm:block">{user.email}</span>
      <form action={signOut}>
        <button
          type="submit"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold text-fg-2 transition-colors hover:border-primary hover:bg-primary hover:text-on-primary"
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </form>
    </div>
  );
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/admin" aria-label="Admissions dashboard">
            <Logo tag="Admissions" />
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle labels={{ light: "Switch to light mode", dark: "Switch to dark mode" }} />
            <Suspense fallback={<div className="h-11 w-24" />}>
              <UserMenu />
            </Suspense>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <Suspense fallback={<p className="py-24 text-center text-sm text-muted">Loading…</p>}>{children}</Suspense>
      </main>
    </>
  );
}
