// Types and helpers shared by the admin dashboard (server and client safe).

export const STATUSES = ["new", "in_review", "accepted", "waitlisted", "declined"] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<Status, string> = {
  new: "New",
  in_review: "In review",
  accepted: "Accepted",
  waitlisted: "Waitlisted",
  declined: "Declined",
};

export const TERM_LABEL: Record<string, string> = {
  "2026-09": "September 2026",
  "2027-01": "January 2027",
  "2027-04": "April 2027",
};

export type ApplicationRow = {
  id: string;
  reference: string;
  status: Status;
  locale: string | null;
  first_name: string;
  last_name: string;
  dob: string;
  gender: string;
  nationality: string | null;
  current_school: string | null;
  current_class: string | null;
  section: "anglophone" | "francophone";
  level: string;
  pathway: string | null;
  term: string;
  guardian_name: string;
  relationship: string;
  phone: string;
  whatsapp: string | null;
  email: string;
  address: string;
  notes: string | null;
  documents: Record<string, string>;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
};

/** Staff accounts carry app_metadata.ba_role = "admin" (set by scripts/create-admin.mjs). */
export function isAdminMetadata(meta: unknown): boolean {
  return typeof meta === "object" && meta !== null && (meta as { ba_role?: unknown }).ba_role === "admin";
}

const dateTime = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Douala" });
const dateOnly = new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeZone: "UTC" });

export const formatDateTime = (iso: string) => dateTime.format(new Date(iso));
export const formatDate = (iso: string) => dateOnly.format(new Date(iso));

/** Digits only, for wa.me and tel: links. */
export const digits = (s: string) => s.replace(/\D/g, "");
