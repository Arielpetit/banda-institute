import type { Metadata } from "next";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="absolute top-4 right-4">
        <ThemeToggle labels={{ light: "Switch to light mode", dark: "Switch to dark mode" }} />
      </div>
      <div className="w-full max-w-md rounded-[2rem] border border-line bg-surface p-8 card-shadow sm:p-10">
        <Logo tag="Admissions" />
        <h1 className="mt-10 font-display text-3xl font-medium text-fg">Staff sign in</h1>
        <p className="mt-2 text-sm text-muted">Review online applications, update their status and contact families.</p>
        <LoginForm />
      </div>
    </main>
  );
}
