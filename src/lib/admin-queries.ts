import "server-only";
import { STATUSES, type ApplicationRow, type Status } from "@/lib/admin";
import { createServiceClient } from "@/lib/supabase/service";

export const PAGE_SIZE = 25;

export type Filters = { status: Status | ""; section: "anglophone" | "francophone" | ""; q: string; page: number };

type Raw = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export function parseFilters(raw: Raw): Filters {
  const status = first(raw.status);
  const section = first(raw.section);
  const page = Number.parseInt(first(raw.page), 10);
  return {
    status: (STATUSES as readonly string[]).includes(status) ? (status as Status) : "",
    section: section === "anglophone" || section === "francophone" ? section : "",
    // Characters that would change the meaning of a PostgREST or() filter are dropped.
    q: first(raw.q).replace(/[,()%*\\]/g, " ").trim().slice(0, 80),
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export const filtersToQuery = (f: Partial<Filters>, extra: Record<string, string> = {}) => {
  const p = new URLSearchParams();
  if (f.status) p.set("status", f.status);
  if (f.section) p.set("section", f.section);
  if (f.q) p.set("q", f.q);
  for (const [k, v] of Object.entries(extra)) p.set(k, v);
  const s = p.toString();
  return s ? `?${s}` : "";
};

export const LIST_COLUMNS =
  "id,reference,status,first_name,last_name,section,level,term,guardian_name,phone,email,created_at" as const;
export type ListRow = Pick<
  ApplicationRow,
  | "id"
  | "reference"
  | "status"
  | "first_name"
  | "last_name"
  | "section"
  | "level"
  | "term"
  | "guardian_name"
  | "phone"
  | "email"
  | "created_at"
>;

function base(columns: string, f: Filters, count: boolean) {
  const db = createServiceClient();
  let query = db
    .from("ba_applications")
    .select(columns, count ? { count: "exact" } : undefined)
    .order("created_at", { ascending: false });
  if (f.status) query = query.eq("status", f.status);
  if (f.section) query = query.eq("section", f.section);
  if (f.q) {
    const like = `%${f.q}%`;
    query = query.or(
      ["reference", "first_name", "last_name", "guardian_name", "email", "phone"].map((c) => `${c}.ilike.${like}`).join(","),
    );
  }
  return query;
}

export async function listApplications(f: Filters) {
  const from = (f.page - 1) * PAGE_SIZE;
  const { data, count, error } = await base(LIST_COLUMNS, f, true).range(from, from + PAGE_SIZE - 1);
  if (error) throw error;
  return { rows: (data ?? []) as unknown as ListRow[], total: count ?? 0 };
}

/** Every row that matches the filters, for the CSV export (capped at 5000). */
export async function listAllApplications(f: Filters) {
  const { data, error } = await base("*", f, false).limit(5000);
  if (error) throw error;
  return (data ?? []) as unknown as ApplicationRow[];
}

export async function getStats() {
  const db = createServiceClient();
  const { data, error } = await db.from("ba_applications").select("status,created_at").limit(10000);
  if (error) throw error;
  const rows = data ?? [];
  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<Status, number>;
  const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
  let lastWeek = 0;
  for (const r of rows) {
    if (r.status in counts) counts[r.status as Status]++;
    if (new Date(r.created_at).getTime() >= weekAgo) lastWeek++;
  }
  return { total: rows.length, counts, lastWeek };
}

export async function getApplication(id: string) {
  // Reject anything that is not a uuid before it reaches the query.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
  const { data, error } = await createServiceClient().from("ba_applications").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as ApplicationRow | null) ?? null;
}
