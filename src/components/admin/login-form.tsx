"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn, type FormState } from "@/app/(admin)/admin/actions";

const field =
  "block w-full rounded-lg border border-line bg-surface px-3.5 py-3 text-base text-fg outline-none transition-colors placeholder:text-muted/70 focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, {});
  const [show, setShow] = useState(false);
  return (
    <form action={action} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="text-sm font-medium text-fg-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          placeholder="you@school.cm"
          className={`${field} mt-1.5`}
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-fg-2">
          Password
        </label>
        <div className="relative mt-1.5">
          <input
            id="password"
            name="password"
            type={show ? "text" : "password"}
            autoComplete="current-password"
            required
            className={`${field} pr-12 [&::-ms-reveal]:hidden`}
          />
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            className="absolute top-1/2 right-1 grid size-10 -translate-y-1/2 place-items-center rounded-md text-muted transition-colors hover:text-fg"
          >
            {show ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
          </button>
        </div>
      </div>
      {state.error && (
        <p role="alert" className="rounded-lg bg-rose-100 px-4 py-3 text-sm font-medium text-rose-800 dark:bg-rose-400/15 dark:text-rose-300">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
