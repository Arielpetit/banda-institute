"use client";

import { useActionState, useTransition } from "react";
import { Check, Loader2, Trash2 } from "lucide-react";
import { deleteApplication, updateApplication, type FormState } from "@/app/(admin)/admin/actions";
import { STATUSES, STATUS_LABEL, type Status } from "@/lib/admin";

const field =
  "mt-1.5 block w-full rounded-xl border border-line bg-canvas px-4 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-muted focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30";

export function StatusForm({ id, status, notes }: { id: string; status: Status; notes: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateApplication.bind(null, id), {});
  return (
    <form action={action} className="space-y-4">
      <label className="block text-sm font-medium text-fg-2">
        Status
        <select name="status" defaultValue={status} className={field}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-medium text-fg-2">
        Internal notes
        <textarea
          name="internal_notes"
          defaultValue={notes}
          rows={5}
          maxLength={5000}
          placeholder="Only staff see this. Call log, documents to chase, decision reason…"
          className={`${field} resize-y`}
        />
      </label>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          Save changes
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {state.saved && !pending && (
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-300">
              <Check className="size-4" /> Saved
            </span>
          )}
          {state.error && !pending && <span className="font-medium text-rose-700 dark:text-rose-300">{state.error}</span>}
        </p>
      </div>
    </form>
  );
}

export function DeleteButton({ id, name }: { id: string; name: string }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(`Delete the application of ${name} and its documents? This cannot be undone.`)) {
          start(() => deleteApplication(id));
        }
      }}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-rose-300 px-5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50 disabled:opacity-60 dark:border-rose-400/40 dark:text-rose-300 dark:hover:bg-rose-400/10"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      Delete application
    </button>
  );
}
