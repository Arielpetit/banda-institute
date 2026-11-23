"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminMetadata, STATUSES, type Status } from "@/lib/admin";
import { createAuthClient, requireAdmin } from "@/lib/supabase/auth";
import { BUCKET, createServiceClient } from "@/lib/supabase/service";

export type FormState = { error?: string; saved?: boolean };

export async function signIn(_prev: FormState, form: FormData): Promise<FormState> {
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createAuthClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "Wrong email or password." };

  if (!isAdminMetadata(data.user.app_metadata)) {
    // Local scope only: the Supabase project is shared, so never end this user's other sessions.
    await supabase.auth.signOut({ scope: "local" });
    return { error: "This account does not have access to the dashboard." };
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut({ scope: "local" });
  redirect("/admin/login");
}

export async function updateApplication(id: string, _prev: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const status = String(form.get("status") ?? "");
  if (!(STATUSES as readonly string[]).includes(status)) return { error: "Pick a valid status." };
  const notes = String(form.get("internal_notes") ?? "").trim().slice(0, 5000);

  const { error } = await createServiceClient()
    .from("ba_applications")
    .update({ status: status as Status, internal_notes: notes || null })
    .eq("id", id);
  if (error) {
    console.error("Could not update application", error);
    return { error: "Could not save. Try again." };
  }
  revalidatePath("/admin");
  revalidatePath(`/admin/applications/${id}`);
  return { saved: true };
}

export async function deleteApplication(id: string) {
  await requireAdmin();
  const db = createServiceClient();
  const { data } = await db.from("ba_applications").select("documents").eq("id", id).maybeSingle();
  const paths = Object.values((data?.documents ?? {}) as Record<string, string>);
  if (paths.length) await db.storage.from(BUCKET).remove(paths);
  const { error } = await db.from("ba_applications").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin");
  redirect("/admin");
}
