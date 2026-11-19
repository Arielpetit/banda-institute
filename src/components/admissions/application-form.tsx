"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  Loader2,
  MessageCircle,
  Pencil,
  Phone,
  Printer,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import { ButtonLink } from "@/components/button-link";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/config";
import {
  ACCEPTED_TYPES,
  DOCUMENTS,
  emptyApplication,
  GENDERS,
  isSecondary,
  LEVELS,
  PATHWAYS,
  RELATIONSHIPS,
  SECTIONS,
  STEP_FIELDS,
  TERMS,
  validate,
  type ApplicationData,
  type DocumentKey,
  type Errors,
  type Section,
} from "@/lib/application";
import { site, tel } from "@/lib/content";
import { cn } from "@/lib/cn";
import { submitApplication } from "@/app/[lang]/admissions/apply/actions";

type T = Dictionary["admissions"]["form"];
type Files = Partial<Record<DocumentKey, File | null>>;
const DRAFT_KEY = "ba-application-draft";

export function ApplicationForm({ t, lang }: { t: T; lang: Locale }) {
  const [data, setData] = useState<ApplicationData>(emptyApplication);
  const [files, setFiles] = useState<Files>({});
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [restored, setRestored] = useState(false);
  const [result, setResult] = useState<{ reference: string } | null>(null);
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();
  const top = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  // Restore an unfinished application (text fields only; files are never stored).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      const draft = raw ? (JSON.parse(raw) as Partial<ApplicationData>) : null;
      if (draft && Object.values(draft).some((v) => typeof v === "string" && v.trim())) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from storage
        setData((d) => ({ ...d, ...draft, consent: "" }));
        setRestored(true);
      }
    } catch {}
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current || result) return;
    try {
      const hasContent = Object.entries(data).some(([k, v]) => k !== "consent" && v.trim());
      if (hasContent) localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...data, consent: "" }));
      else localStorage.removeItem(DRAFT_KEY);
    } catch {}
  }, [data, result]);

  const set = (k: keyof ApplicationData, v: string) => {
    setData((d) => {
      const next = { ...d, [k]: v };
      if (k === "section") next.level = "";
      if ((k === "section" || k === "level") && !isSecondary(next.section, next.level)) next.pathway = "";
      return next;
    });
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const setFile = (k: DocumentKey, f: File | null) => {
    setFiles((fs) => ({ ...fs, [k]: f }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const go = (to: number) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const next = () => {
    const stepErrors = validate(data, files, STEP_FIELDS[step]);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) go(step + 1);
  };

  const submit = () => {
    const all = validate(data, files);
    setErrors(all);
    if (Object.keys(all).length) {
      const firstBad = STEP_FIELDS.findIndex((fields) => fields.some((f) => all[f]));
      if (firstBad >= 0 && firstBad !== step) go(firstBad);
      return;
    }
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => form.set(k, v));
    Object.entries(files).forEach(([k, f]) => f && form.set(k, f));
    form.set("locale", lang);
    setFailed(false);
    startTransition(async () => {
      try {
        const res = await submitApplication(form);
        if (res.ok) {
          setResult({ reference: res.reference });
          try {
            localStorage.removeItem(DRAFT_KEY);
          } catch {}
          top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (res.errors) {
          setErrors(res.errors);
        } else setFailed(true);
      } catch {
        setFailed(true);
      }
    });
  };

  const clearDraft = () => {
    setData(emptyApplication);
    setFiles({});
    setRestored(false);
    setStep(0);
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch {}
  };

  if (result) return <Success t={t} reference={result.reference} data={data} />;

  const total = t.steps.length;
  const err = (k: keyof Errors) => (errors[k] ? t.errors[errors[k]!] : undefined);

  return (
    <div ref={top} className="grid scroll-mt-28 gap-8 lg:grid-cols-12 lg:gap-12">
      {/* Stepper */}
      <aside className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <div className="lg:hidden">
            <p className="text-sm font-semibold text-accent">{t.stepOf.replace("{n}", String(step + 1)).replace("{total}", String(total))}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-tint">
              <motion.div className="h-full rounded-full bg-gold-400" animate={{ width: `${((step + 1) / total) * 100}%` }} />
            </div>
          </div>
          <ol className="hidden space-y-1 lg:block">
            {t.steps.map((s, i) => {
              const done = i < step;
              const current = i === step;
              return (
                <li key={s.title}>
                  <button
                    type="button"
                    disabled={i > step}
                    onClick={() => go(i)}
                    aria-current={current ? "step" : undefined}
                    className={cn(
                      "flex w-full items-start gap-4 rounded-2xl p-3 text-left transition-colors",
                      current ? "bg-surface shadow-sm ring-1 ring-line" : "hover:bg-surface/60 disabled:hover:bg-transparent",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors",
                        done ? "bg-gold-400 text-ink-950" : current ? "bg-primary text-on-primary" : "bg-tint text-muted",
                      )}
                    >
                      {done ? <Check className="size-4" /> : i + 1}
                    </span>
                    <span>
                      <span className={cn("block font-semibold", current || done ? "text-fg" : "text-muted")}>{s.title}</span>
                      <span className="block text-sm text-muted">{s.desc}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 hidden rounded-3xl bg-ink-900 p-6 text-cream lg:block">
            <p className="font-display text-xl">{t.help.title}</p>
            <p className="mt-2 text-sm text-ink-200">{t.help.body}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href={tel(site.phones.administration)} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-cream/10 px-4 text-sm font-semibold hover:bg-cream/20">
                <Phone className="size-4" /> {t.help.call}
              </a>
              <a
                href={`https://wa.me/${site.phones.secondary.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white"
              >
                <MessageCircle className="size-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Step content */}
      <div className="lg:col-span-8">
        {restored && (
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gold-400/40 bg-gold-100 px-5 py-3 text-sm text-ink-900 dark:bg-gold-500/10 dark:text-gold-200">
            <span>{t.draftRestored}</span>
            <button type="button" onClick={clearDraft} className="font-semibold underline underline-offset-4">
              {t.clearDraft}
            </button>
          </div>
        )}

        <div className="relative overflow-hidden rounded-[2rem] border border-line bg-surface p-6 sm:p-10">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div
              key={step}
              custom={dir}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 40 }),
                center: { opacity: 1, x: 0 },
                exit: (d: number) => ({ opacity: 0, x: d * -40 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="eyebrow text-accent">{t.stepOf.replace("{n}", String(step + 1)).replace("{total}", String(total))}</p>
              <h2 className="mt-2 text-3xl text-fg sm:text-4xl">{t.steps[step].title}</h2>
              <p className="mt-2 text-muted">{t.steps[step].desc}</p>

              <div className="mt-8">
                {step === 0 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input label={t.fields.firstName} value={data.firstName} onChange={(v) => set("firstName", v)} error={err("firstName")} autoComplete="given-name" required />
                    <Input label={t.fields.lastName} value={data.lastName} onChange={(v) => set("lastName", v)} error={err("lastName")} autoComplete="family-name" required />
                    <Input label={t.fields.dob} type="date" value={data.dob} onChange={(v) => set("dob", v)} error={err("dob")} required />
                    <Choice
                      label={t.fields.gender}
                      value={data.gender}
                      onChange={(v) => set("gender", v)}
                      options={GENDERS.map((g) => ({ value: g, label: t.options.gender[g] }))}
                      error={err("gender")}
                      required
                    />
                    <Input label={t.fields.nationality} value={data.nationality} onChange={(v) => set("nationality", v)} placeholder={t.placeholders.nationality} />
                    <Input label={t.fields.currentClass} value={data.currentClass} onChange={(v) => set("currentClass", v)} />
                    <Input label={t.fields.currentSchool} value={data.currentSchool} onChange={(v) => set("currentSchool", v)} className="sm:col-span-2" />
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-7">
                    <fieldset>
                      <legend className="mb-3 text-sm font-semibold text-fg">
                        {t.fields.section} <span className="text-gold-500">*</span>
                      </legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {SECTIONS.map((s) => (
                          <label
                            key={s}
                            className={cn(
                              "relative flex cursor-pointer flex-col rounded-2xl border p-5 transition-all",
                              data.section === s ? "border-primary bg-tint ring-2 ring-primary/20" : "border-line hover:border-accent/50",
                            )}
                          >
                            <input type="radio" name="section" value={s} checked={data.section === s} onChange={() => set("section", s)} className="sr-only" />
                            <span className="font-display text-2xl text-fg">{t.options.section[s].title}</span>
                            <span className="mt-1 text-sm text-muted">{t.options.section[s].desc}</span>
                            {data.section === s && (
                              <motion.span layoutId="section-check" className="absolute top-4 right-4 grid size-7 place-items-center rounded-full bg-primary text-on-primary">
                                <Check className="size-4" />
                              </motion.span>
                            )}
                          </label>
                        ))}
                      </div>
                      {err("section") && <ErrorText>{err("section")}</ErrorText>}
                    </fieldset>

                    <AnimatePresence initial={false}>
                      {data.section && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <fieldset>
                            <legend className="mb-3 text-sm font-semibold text-fg">
                              {t.fields.level} <span className="text-gold-500">*</span>
                            </legend>
                            <div className="space-y-4">
                              {([false, true] as const).map((sec) => (
                                <div key={String(sec)}>
                                  <p className="mb-2 text-xs font-semibold tracking-wider text-muted uppercase">{sec ? t.options.secondaryGroup : t.options.primaryGroup}</p>
                                  <div className="flex flex-wrap gap-2">
                                    {LEVELS[data.section as Section]
                                      .filter((l) => l.secondary === sec)
                                      .map((l) => (
                                        <button
                                          key={l.value}
                                          type="button"
                                          onClick={() => set("level", l.value)}
                                          aria-pressed={data.level === l.value}
                                          className={cn(
                                            "min-h-10 rounded-full border px-4 text-sm font-medium transition-colors",
                                            data.level === l.value ? "border-primary bg-primary text-on-primary" : "border-line text-fg-2 hover:border-accent/50",
                                          )}
                                        >
                                          {l.value}
                                        </button>
                                      ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                            {err("level") && <ErrorText>{err("level")}</ErrorText>}
                          </fieldset>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence initial={false}>
                      {isSecondary(data.section, data.level) && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <Choice
                            label={t.fields.pathway}
                            value={data.pathway}
                            onChange={(v) => set("pathway", v)}
                            options={PATHWAYS.map((p) => ({ value: p, label: t.options.pathway[p] }))}
                            error={err("pathway")}
                            required
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Choice
                      label={t.fields.term}
                      value={data.term}
                      onChange={(v) => set("term", v)}
                      options={TERMS.map((p) => ({ value: p, label: t.options.term[p] }))}
                      error={err("term")}
                      required
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Input label={t.fields.guardianName} value={data.guardianName} onChange={(v) => set("guardianName", v)} error={err("guardianName")} autoComplete="name" required />
                    <Select
                      label={t.fields.relationship}
                      value={data.relationship}
                      onChange={(v) => set("relationship", v)}
                      options={RELATIONSHIPS.map((r) => ({ value: r, label: t.options.relationship[r] }))}
                      placeholder={t.placeholders.select}
                      error={err("relationship")}
                      required
                    />
                    <Input label={t.fields.phone} type="tel" value={data.phone} onChange={(v) => set("phone", v)} error={err("phone")} placeholder="+237 6XX XX XX XX" autoComplete="tel" required />
                    <Input label={t.fields.whatsapp} type="tel" value={data.whatsapp} onChange={(v) => set("whatsapp", v)} error={err("whatsapp")} placeholder={t.placeholders.whatsapp} />
                    <Input label={t.fields.email} type="email" value={data.email} onChange={(v) => set("email", v)} error={err("email")} autoComplete="email" required className="sm:col-span-2" />
                    <Input label={t.fields.address} value={data.address} onChange={(v) => set("address", v)} error={err("address")} placeholder={t.placeholders.address} autoComplete="street-address" required className="sm:col-span-2" />
                    <Textarea label={t.fields.notes} value={data.notes} onChange={(v) => set("notes", v)} placeholder={t.placeholders.notes} className="sm:col-span-2" />
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    {DOCUMENTS.map((d) => (
                      <FileDrop
                        key={d.key}
                        label={t.docs[d.key].label}
                        hint={t.docs[d.key].hint}
                        required={d.required}
                        file={files[d.key] ?? null}
                        onFile={(f) => setFile(d.key, f)}
                        error={err(d.key)}
                        t={t}
                      />
                    ))}
                    <p className="text-sm text-muted">{t.docsNote}</p>
                  </div>
                )}

                {step === 4 && (
                  <Review t={t} data={data} files={files} onEdit={go} consentError={err("consent")} setConsent={(v) => set("consent", v ? "yes" : "")} />
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {failed && (
            <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-5 py-3 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
              {t.failed}
            </p>
          )}

          <div className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
            <button
              type="button"
              onClick={() => go(step - 1)}
              disabled={step === 0 || pending}
              className="inline-flex min-h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold text-fg-2 transition-colors hover:bg-tint disabled:invisible"
            >
              <ArrowLeft className="size-4" /> {t.buttons.back}
            </button>
            {step < total - 1 ? (
              <button
                type="button"
                onClick={next}
                className="group inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
              >
                {t.buttons.next}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={pending}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gold-400 px-7 text-sm font-bold text-ink-950 transition-colors hover:bg-gold-300 disabled:opacity-70"
              >
                {pending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                {pending ? t.buttons.submitting : t.buttons.submit}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Fields ---------- */

const fieldCls =
  "w-full rounded-2xl border border-line bg-canvas px-4 py-3.5 text-fg placeholder:text-muted/60 transition focus:border-accent focus:bg-surface focus:outline-none focus:ring-4 focus:ring-accent/15 aria-[invalid=true]:border-red-500";

function Label({ text, required, htmlFor }: { text: string; required?: boolean; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-fg">
      {text} {required && <span className="text-gold-500">*</span>}
    </label>
  );
}

function ErrorText({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <motion.p id={id} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
      {children}
    </motion.p>
  );
}

type FieldProps = { label: string; value: string; onChange: (v: string) => void; error?: string; required?: boolean; className?: string; placeholder?: string };

function Input({ type = "text", autoComplete, ...p }: FieldProps & { type?: string; autoComplete?: string }) {
  const id = useId();
  return (
    <div className={p.className}>
      <Label text={p.label} required={p.required} htmlFor={id} />
      <input
        id={id}
        type={type}
        value={p.value}
        onChange={(e) => p.onChange(e.target.value)}
        placeholder={p.placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!p.error}
        aria-describedby={p.error ? `${id}-e` : undefined}
        className={fieldCls}
      />
      {p.error && <ErrorText id={`${id}-e`}>{p.error}</ErrorText>}
    </div>
  );
}

function Textarea(p: FieldProps) {
  const id = useId();
  return (
    <div className={p.className}>
      <Label text={p.label} htmlFor={id} />
      <textarea id={id} rows={3} value={p.value} onChange={(e) => p.onChange(e.target.value)} placeholder={p.placeholder} className={cn(fieldCls, "resize-none")} />
    </div>
  );
}

function Select({ options, ...p }: FieldProps & { options: { value: string; label: string }[] }) {
  const id = useId();
  return (
    <div className={p.className}>
      <Label text={p.label} required={p.required} htmlFor={id} />
      <select id={id} value={p.value} onChange={(e) => p.onChange(e.target.value)} aria-invalid={!!p.error} className={fieldCls}>
        <option value="" disabled>
          {p.placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {p.error && <ErrorText>{p.error}</ErrorText>}
    </div>
  );
}

function Choice({ options, ...p }: FieldProps & { options: { value: string; label: string }[] }) {
  return (
    <fieldset className={p.className}>
      <legend className="mb-2 block text-sm font-semibold text-fg">
        {p.label} {p.required && <span className="text-gold-500">*</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className={cn(
              "inline-flex min-h-12 cursor-pointer items-center rounded-2xl border px-4 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold-500",
              p.value === o.value ? "border-primary bg-primary text-on-primary" : "border-line bg-canvas text-fg-2 hover:border-accent/50",
            )}
          >
            <input type="radio" className="sr-only" checked={p.value === o.value} onChange={() => p.onChange(o.value)} />
            {o.label}
          </label>
        ))}
      </div>
      {p.error && <ErrorText>{p.error}</ErrorText>}
    </fieldset>
  );
}

function FileDrop({
  label,
  hint,
  required,
  file,
  onFile,
  error,
  t,
}: {
  label: string;
  hint: string;
  required: boolean;
  file: File | null;
  onFile: (f: File | null) => void;
  error?: string;
  t: T;
}) {
  const id = useId();
  const [over, setOver] = useState(false);
  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onFile(f);
        }}
        className={cn(
          "relative flex flex-col gap-4 rounded-2xl border-2 border-dashed p-5 transition-colors sm:flex-row sm:items-center",
          over ? "border-gold-400 bg-gold-100/50 dark:bg-gold-500/10" : error ? "border-red-400" : file ? "border-solid border-line bg-tint" : "border-line",
        )}
      >
        <span className={cn("grid size-12 shrink-0 place-items-center rounded-xl", file ? "bg-gold-400 text-ink-950" : "bg-tint text-accent")}>
          {file ? <FileText className="size-5" /> : <Upload className="size-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-fg">
            {label} {required && <span className="text-gold-500">*</span>}
          </p>
          <p className="truncate text-sm text-muted">{file ? `${file.name} · ${(file.size / 1024 / 1024).toFixed(1)} MB` : hint}</p>
        </div>
        <div className="flex gap-2">
          <label
            htmlFor={id}
            className="inline-flex min-h-10 cursor-pointer items-center rounded-full border border-line bg-surface px-4 text-sm font-semibold text-fg-2 hover:border-accent/50 has-[:focus-visible]:ring-2"
          >
            {file ? t.docsReplace : t.docsChoose}
          </label>
          {file && (
            <button type="button" onClick={() => onFile(null)} aria-label={t.docsRemove} className="grid size-10 place-items-center rounded-full text-muted hover:bg-surface">
              <X className="size-4" />
            </button>
          )}
        </div>
        <input
          id={id}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="sr-only"
          onChange={(e) => {
            onFile(e.target.files?.[0] ?? null);
            e.target.value = "";
          }}
        />
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

/* ---------- Review & success ---------- */

function Review({
  t,
  data,
  files,
  onEdit,
  consentError,
  setConsent,
}: {
  t: T;
  data: ApplicationData;
  files: Files;
  onEdit: (step: number) => void;
  consentError?: string;
  setConsent: (v: boolean) => void;
}) {
  const f = t.fields;
  const groups: { step: number; rows: [string, string][] }[] = [
    {
      step: 0,
      rows: [
        [f.firstName, `${data.firstName} ${data.lastName}`],
        [f.dob, data.dob],
        [f.gender, data.gender ? t.options.gender[data.gender as "female" | "male"] : ""],
        [f.currentSchool, [data.currentSchool, data.currentClass].filter(Boolean).join(" · ")],
      ],
    },
    {
      step: 1,
      rows: [
        [f.section, data.section ? t.options.section[data.section as Section].title : ""],
        [f.level, data.level],
        ...(data.pathway ? ([[f.pathway, t.options.pathway[data.pathway as "general"]]] as [string, string][]) : []),
        [f.term, data.term ? t.options.term[data.term as "2026-09"] : ""],
      ],
    },
    {
      step: 2,
      rows: [
        [f.guardianName, `${data.guardianName}${data.relationship ? ` (${t.options.relationship[data.relationship as "mother"]})` : ""}`],
        [f.phone, [data.phone, data.whatsapp && `WhatsApp ${data.whatsapp}`].filter(Boolean).join(" · ")],
        [f.email, data.email],
        [f.address, data.address],
      ],
    },
    {
      step: 3,
      rows: DOCUMENTS.map((d) => [t.docs[d.key].label, files[d.key]?.name ?? "—"] as [string, string]),
    },
  ];

  return (
    <div className="space-y-4">
      {groups.map((g) => (
        <div key={g.step} className="rounded-2xl border border-line p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-sans text-sm font-bold tracking-wider text-accent uppercase">{t.steps[g.step].title}</h3>
            <button type="button" onClick={() => onEdit(g.step)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-fg-2 hover:text-accent">
              <Pencil className="size-3.5" /> {t.buttons.edit}
            </button>
          </div>
          <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {g.rows.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="text-sm font-medium break-words text-fg">{v || "—"}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
      <label className={cn("flex cursor-pointer gap-3 rounded-2xl border p-5", consentError ? "border-red-400" : "border-line")}>
        <input
          type="checkbox"
          checked={data.consent === "yes"}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-[var(--color-ink-700)]"
        />
        <span className="text-sm text-fg-2">{t.consent}</span>
      </label>
      {consentError && <ErrorText>{consentError}</ErrorText>}
    </div>
  );
}

function Success({ t, reference, data }: { t: T; reference: string; data: ApplicationData }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-line bg-surface p-8 text-center sm:p-14"
    >
      <Burst />
      <motion.span
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.15 }}
        className="relative mx-auto grid size-20 place-items-center rounded-full bg-gold-400 text-ink-950"
      >
        <CheckCircle2 className="size-10" />
      </motion.span>
      <h2 className="relative mt-8 text-4xl text-fg sm:text-5xl">{t.success.title.replace("{name}", data.firstName)}</h2>
      <p className="relative mx-auto mt-4 max-w-lg text-lg text-muted">{t.success.body}</p>
      <div className="relative mx-auto mt-8 inline-flex flex-col items-center rounded-2xl border border-dashed border-gold-400 bg-gold-100/40 px-8 py-4 dark:bg-gold-500/10">
        <span className="text-xs font-semibold tracking-widest text-muted uppercase">{t.success.reference}</span>
        <span className="mt-1 font-mono text-2xl font-bold tracking-wider text-fg">{reference}</span>
      </div>
      <ol className="relative mx-auto mt-10 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
        {t.success.next.map((n, i) => (
          <li key={n} className="rounded-2xl bg-tint p-4 text-sm text-fg-2">
            <span className="font-display text-2xl text-accent">0{i + 1}</span>
            <p className="mt-1">{n}</p>
          </li>
        ))}
      </ol>
      <div className="relative mt-10 flex flex-wrap justify-center gap-3 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line px-6 text-sm font-semibold text-fg-2 hover:bg-tint"
        >
          <Printer className="size-4" /> {t.success.print}
        </button>
        <ButtonLink href="/">{t.success.home}</ButtonLink>
      </div>
    </motion.div>
  );
}

/** A one-shot ring of dots behind the success badge. */
function Burst() {
  const dots = Array.from({ length: 18 });
  return (
    <div aria-hidden className="pointer-events-none absolute top-[4.5rem] left-1/2 sm:top-[6rem]">
      {dots.map((_, i) => {
        const angle = (i / dots.length) * Math.PI * 2;
        const r = 90 + (i % 3) * 30;
        return (
          <motion.span
            key={i}
            className={cn("absolute size-2.5 rounded-full", i % 3 === 0 ? "bg-gold-400" : i % 3 === 1 ? "bg-ink-500" : "bg-gold-200")}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(angle) * r, y: Math.sin(angle) * r, opacity: 0, scale: 0.4 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        );
      })}
    </div>
  );
}
