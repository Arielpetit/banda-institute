"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { DOCUMENTS, emptyApplication, validate, type ApplicationData, type DocumentKey, type Errors } from "@/lib/application";

export type SubmitResult = { ok: true; reference: string } | { ok: false; errors?: Errors; failed?: boolean };

// Applications are written to ./data/applications on the server.
// This works on any Node host with a writable disk; for serverless hosting,
// replace the file writes below with a database or storage bucket.
const STORE = path.join(process.cwd(), "data", "applications");

const EXT: Record<string, string> = { "application/pdf": "pdf", "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

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

  const reference = `BA-2627-${randomBytes(3).toString("hex").toUpperCase()}`;
  try {
    const dir = path.join(STORE, reference);
    await mkdir(dir, { recursive: true });
    const stored: Record<string, string> = {};
    for (const [key, file] of Object.entries(files)) {
      const name = `${key}.${EXT[file.type] ?? "bin"}`;
      await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
      stored[key] = name;
    }
    const record = { reference, submittedAt: new Date().toISOString(), locale: form.get("locale"), ...data, documents: stored };
    await writeFile(path.join(dir, "application.json"), JSON.stringify(record, null, 2));
    return { ok: true, reference };
  } catch (err) {
    console.error("Could not save application", err);
    return { ok: false, failed: true };
  }
}
