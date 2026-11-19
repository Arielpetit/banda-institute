"use client";

import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import type { Dictionary } from "@/i18n/get-dictionary";
import { site } from "@/lib/content";
import { cn } from "@/lib/cn";

// WhatsApp number for the office — confirm with the school before launch.
const WHATSAPP = site.phones.secondary.replace(/\D/g, "");

type Errors = Partial<Record<"name" | "email" | "message", string>>;

const field =
  "w-full rounded-2xl border border-line bg-canvas/60 px-4 py-3.5 text-fg placeholder:text-muted/60 transition focus:border-ink-500 focus:bg-surface focus:outline-none focus:ring-4 focus:ring-tint";

export function ContactForm({ t }: { t: Dictionary["contact"]["form"] }) {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<"email" | "whatsapp" | null>(null);

  function compose(form: HTMLFormElement) {
    const data = new FormData(form);
    const v = (k: string) => String(data.get(k) ?? "").trim();
    const next: Errors = {};
    if (!v("name")) next.name = t.errName;
    if (!/^\S+@\S+\.\S+$/.test(v("email"))) next.email = t.errEmail;
    if (v("message").length < 10) next.message = t.errMessage;
    setErrors(next);
    if (Object.keys(next).length) return null;
    const subject = v("subject");
    const to = site.emails[t.subjects.find((s) => s.label === subject)?.to ?? "general"];
    const body = `${v("message")}\n\n— ${v("name")}\n${v("email")}${v("phone") ? `\n${v("phone")}` : ""}`;
    return { to, subject, body };
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex min-h-[28rem] flex-col items-center justify-center text-center"
          >
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}>
              <CheckCircle2 className="size-16 text-accent" />
            </motion.span>
            <h3 className="mt-6 text-3xl text-fg">{t.doneTitle}</h3>
            <p className="mt-3 max-w-sm text-muted">
              {sent === "email" ? t.doneEmail : t.doneWhatsapp}
            </p>
            <button onClick={() => setSent(null)} className="mt-8 text-sm font-semibold text-accent underline underline-offset-4">
              {t.again}
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            exit={{ opacity: 0, y: -10 }}
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const m = compose(e.currentTarget);
              if (!m) return;
              window.location.href = `mailto:${m.to}?subject=${encodeURIComponent(m.subject)}&body=${encodeURIComponent(m.body)}`;
              setSent("email");
            }}
            className="grid gap-5 sm:grid-cols-2"
          >
            <Field label={t.name} error={errors.name} className="sm:col-span-2">
              <input name="name" autoComplete="name" className={field} placeholder={t.namePh} aria-invalid={!!errors.name} />
            </Field>
            <Field label={t.email} error={errors.email}>
              <input name="email" type="email" autoComplete="email" className={field} placeholder="you@example.com" aria-invalid={!!errors.email} />
            </Field>
            <Field label={t.phone}>
              <input name="phone" type="tel" autoComplete="tel" className={field} placeholder="+237 …" />
            </Field>
            <Field label={t.subject} className="sm:col-span-2">
              <select name="subject" className={field} defaultValue={t.subjects[0].label}>
                {t.subjects.map((s) => (
                  <option key={s.label}>{s.label}</option>
                ))}
              </select>
            </Field>
            <Field label={t.message} error={errors.message} className="sm:col-span-2">
              <textarea name="message" rows={5} className={cn(field, "resize-none")} placeholder={t.messagePh} aria-invalid={!!errors.message} />
            </Field>
            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
              <button
                type="submit"
                className="inline-flex min-h-13 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-semibold text-on-primary transition-colors hover:bg-primary-hover"
              >
                <Mail className="size-4" /> {t.sendEmail}
              </button>
              <button
                type="button"
                onClick={(e) => {
                  const m = compose(e.currentTarget.form!);
                  if (!m) return;
                  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`${m.subject}\n\n${m.body}`)}`, "_blank", "noopener");
                  setSent("whatsapp");
                }}
                className="inline-flex min-h-13 flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-semibold text-white transition-opacity hover:opacity-90"
              >
                <MessageCircle className="size-4" /> {t.sendWhatsapp}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-sm font-semibold text-fg">{label}</span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 block text-sm text-red-700"
            role="alert"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}
