import Link from "next/link";
import { ChevronLeft, ChevronRight, Download, Inbox, Search } from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDateTime, STATUSES, STATUS_LABEL, TERM_LABEL } from "@/lib/admin";
import { filtersToQuery, getStats, listApplications, PAGE_SIZE, parseFilters } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/supabase/auth";

const field =
  "block w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-fg outline-none transition-colors placeholder:text-muted focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30";

export default async function DashboardPage({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  const filters = parseFilters(await searchParams);
  const [stats, { rows, total }] = await Promise.all([getStats(), listApplications(filters)]);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const filtered = !!(filters.status || filters.section || filters.q);

  const cards = [
    { label: "All applications", value: stats.total, hint: `${stats.lastWeek} in the last 7 days` },
    { label: "New", value: stats.counts.new, hint: "Waiting for a first look" },
    { label: "In review", value: stats.counts.in_review, hint: "Being processed" },
    { label: "Accepted", value: stats.counts.accepted, hint: `${stats.counts.waitlisted} waitlisted` },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-accent">Admissions 2026–27</p>
          <h1 className="mt-2 font-display text-4xl font-medium text-fg">Applications</h1>
        </div>
        <a
          href={`/admin/export${filtersToQuery(filters)}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-semibold text-fg-2 transition-colors hover:border-primary hover:bg-primary hover:text-on-primary"
        >
          <Download className="size-4" />
          Export CSV
        </a>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-line bg-surface p-5">
            <dt className="text-sm font-medium text-muted">{c.label}</dt>
            <dd className="mt-2 font-display text-4xl leading-none text-fg">{c.value}</dd>
            <p className="mt-2 text-xs text-muted">{c.hint}</p>
          </div>
        ))}
      </dl>

      <form method="get" className="mt-8 grid gap-3 sm:grid-cols-[1fr_11rem_11rem_auto]" role="search">
        <label className="relative block">
          <span className="sr-only">Search</span>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
          <input
            name="q"
            type="search"
            defaultValue={filters.q}
            placeholder="Search name, reference, email, phone…"
            className={`${field} pl-11`}
          />
        </label>
        <label>
          <span className="sr-only">Status</span>
          <select name="status" defaultValue={filters.status} className={field}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Section</span>
          <select name="section" defaultValue={filters.section} className={field}>
            <option value="">Both sections</option>
            <option value="anglophone">Anglophone</option>
            <option value="francophone">Francophone</option>
          </select>
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            className="min-h-11 flex-1 rounded-full bg-primary px-6 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
          >
            Filter
          </button>
          {filtered && (
            <Link
              href="/admin"
              className="grid min-h-11 place-items-center rounded-full border border-line px-4 text-sm font-semibold text-fg-2 hover:bg-tint"
            >
              Reset
            </Link>
          )}
        </div>
      </form>

      <section aria-label="Applications" className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
        {rows.length === 0 ? (
          <div className="grid place-items-center gap-3 px-6 py-20 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-tint text-accent">
              <Inbox className="size-6" />
            </span>
            <p className="font-display text-xl text-fg">{filtered ? "No application matches these filters" : "No applications yet"}</p>
            <p className="max-w-sm text-sm text-muted">
              {filtered ? "Try another search or reset the filters." : "New submissions from the online form appear here."}
            </p>
          </div>
        ) : (
          <>
            <div
              aria-hidden
              className="hidden grid-cols-[1.6fr_1.2fr_1.3fr_8.5rem_9.5rem] gap-4 border-b border-line bg-subtle px-5 py-3 text-xs font-semibold tracking-wide text-muted uppercase lg:grid"
            >
              <span>Learner</span>
              <span>Class</span>
              <span>Guardian</span>
              <span>Status</span>
              <span>Received</span>
            </div>
            <ul className="divide-y divide-line">
              {rows.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/admin/applications/${r.id}`}
                    className="grid gap-x-4 gap-y-1 px-5 py-4 transition-colors hover:bg-tint/60 focus-visible:bg-tint/60 lg:grid-cols-[1.6fr_1.2fr_1.3fr_8.5rem_9.5rem] lg:items-center"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-fg">
                        {r.first_name} {r.last_name}
                      </span>
                      <span className="block font-mono text-xs text-muted">{r.reference}</span>
                    </span>
                    <span className="min-w-0 text-sm text-fg-2">
                      <span className="block truncate">{r.level}</span>
                      <span className="block truncate text-xs text-muted">
                        {r.section === "anglophone" ? "Anglophone" : "Francophone"} · {TERM_LABEL[r.term] ?? r.term}
                      </span>
                    </span>
                    <span className="min-w-0 text-sm text-fg-2">
                      <span className="block truncate">{r.guardian_name}</span>
                      <span className="block truncate text-xs text-muted">{r.phone}</span>
                    </span>
                    <span className="mt-1 lg:mt-0">
                      <StatusBadge status={r.status} />
                    </span>
                    <span className="text-xs text-muted">{formatDateTime(r.created_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {pages > 1 && (
        <nav aria-label="Pagination" className="mt-5 flex items-center justify-between gap-3 text-sm">
          <p className="text-muted">
            Page {filters.page} of {pages} · {total} results
          </p>
          <div className="flex gap-2">
            {filters.page > 1 && (
              <Link
                href={`/admin${filtersToQuery(filters, { page: String(filters.page - 1) })}`}
                className="inline-flex min-h-11 items-center gap-1 rounded-full border border-line px-4 font-semibold text-fg-2 hover:bg-tint"
              >
                <ChevronLeft className="size-4" /> Previous
              </Link>
            )}
            {filters.page < pages && (
              <Link
                href={`/admin${filtersToQuery(filters, { page: String(filters.page + 1) })}`}
                className="inline-flex min-h-11 items-center gap-1 rounded-full border border-line px-4 font-semibold text-fg-2 hover:bg-tint"
              >
                Next <ChevronRight className="size-4" />
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
