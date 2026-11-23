"use server";

import { randomBytes } from "node:crypto";
import { DOCUMENTS, emptyApplication, validate, type ApplicationData, type DocumentKey, type Errors } from "@/lib/application";
import { BUCKET, createServiceClient } from "@/lib/supabase/service";

export type SubmitResult = { ok: true; reference: string } | { ok: false; errors?: Errors; failed?: boolean };

const EXT: Record<string, string> = { "application/pdf": "pdf", "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/** Empty string -> null, so optional columns stay clean in the database. */
const orNull = (v: string) => (v ? v : null);

export async function submitApplication(form: FormData): Promise<SubmitResult> {
  const data = { ...emptyApplication };
  for (const key of Object.keys(emptyApplication) as (keyof ApplicationData)[]) {
    const v = form.get(key);
    data[key] = typeof v === "string" ? v.trim().slice(0, 2000) : "";
  }
  const files: Partial<Record<DocumentKey, File>> = {};
  for (const { key } of DOCUMENTS) {
    const f = form.get(key);
    if (f instanceof File && f.size > 0) files[key] = f;
  }

  const errors = validate(data, files);
  if (Object.keys(errors).length) return { ok: false, errors };

  const localeField = form.get("locale");
  const locale = localeField === "fr" ? "fr" : "en";
  const reference = `BA-2627-${randomBytes(3).toString("hex").toUpperCase()}`;
  const uploaded: string[] = [];

  try {
    const db = createServiceClient();

    const documents: Record<string, string> = {};
    for (const [key, file] of Object.entries(files)) {
      const filePath = `${reference}/${key}.${EXT[file.type] ?? "bin"}`;
      const { error } = await db.storage.from(BUCKET).upload(filePath, file, { contentType: file.type, upsert: false });
      if (error) throw error;
      uploaded.push(filePath);
      documents[key] = filePath;
    }

    const { error } = await db.from("ba_applications").insert({
      reference,
      locale,
      first_name: data.firstName,
      last_name: data.lastName,
      dob: data.dob,
      gender: data.gender,
      nationality: orNull(data.nationality),
      current_school: orNull(data.currentSchool),
      current_class: orNull(data.currentClass),
      section: data.section,
      level: data.level,
      pathway: orNull(data.pathway),
      term: data.term,
      guardian_name: data.guardianName,
      relationship: data.relationship,
      phone: data.phone,
      whatsapp: orNull(data.whatsapp),
      email: data.email,
      address: data.address,
      notes: orNull(data.notes),
      documents,
    });
    if (error) throw error;

    return { ok: true, reference };
  } catch (err) {
    console.error("Could not save application", err);
    // Do not leave orphan files behind when the row was not written.
    if (uploaded.length) {
      try {
        await createServiceClient().storage.from(BUCKET).remove(uploaded);
      } catch {}
    }
    return { ok: false, failed: true };
  }
}
