import { formatDateTime, STATUS_LABEL, TERM_LABEL } from "@/lib/admin";
import { listAllApplications, parseFilters } from "@/lib/admin-queries";
import { requireAdmin } from "@/lib/supabase/auth";

const COLUMNS = [
  "Reference",
  "Received",
  "Status",
  "First name",
  "Last name",
  "Date of birth",
  "Gender",
  "Nationality",
  "Current school",
  "Current class",
  "Section",
  "Class applied for",
  "Pathway",
  "Entry term",
  "Guardian",
  "Relationship",
  "Phone",
  "WhatsApp",
  "Email",
  "Address",
  "Family message",
  "Internal notes",
];

/** Quotes a cell, and defuses spreadsheet formulas (=, +, -, @) typed by applicants. */
function cell(value: string | null | undefined) {
  let s = value ?? "";
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  await requireAdmin();
  const filters = parseFilters(Object.fromEntries(new URL(request.url).searchParams));
  const rows = await listAllApplications(filters);

  const lines = [COLUMNS.map(cell).join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.reference,
        formatDateTime(r.created_at),
        STATUS_LABEL[r.status] ?? r.status,
        r.first_name,
        r.last_name,
        r.dob,
        r.gender,
        r.nationality,
        r.current_school,
        r.current_class,
        r.section,
        r.level,
        r.pathway,
        TERM_LABEL[r.term] ?? r.term,
        r.guardian_name,
        r.relationship,
        r.phone,
        r.whatsapp,
        r.email,
        r.address,
        r.notes,
        r.internal_notes,
      ]
        .map(cell)
        .join(","),
    );
  }

  const stamp = new Date().toISOString().slice(0, 10);
  // BOM so Excel reads the accents (é, è, ç) correctly.
  return new Response(`﻿${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ba-applications-${stamp}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
