"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { signIn, type FormState } from "@/app/(admin)/admin/actions";

const field =
  "mt-1.5 block w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-fg outline-none transition-colors placeholder:text-muted focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, {});
  return (
    <form action={action} className="mt-8 space-y-5">
      <label className="block text-sm font-medium text-fg-2">
        Email
        <input name="email" type="email" autoComplete="username" required autoFocus className={field} />
      </label>
      <label className="block text-sm font-medium text-fg-2">
        Password
        <input name="password" type="password" autoComplete="current-password" required className={field} />
      </label>
      {state.error && (
        <p role="alert" className="rounded-xl bg-rose-100 px-4 py-3 text-sm font-medium text-rose-800 dark:bg-rose-400/15 dark:text-rose-300">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
