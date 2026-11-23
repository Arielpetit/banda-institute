import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Server-side client with the secret key. It bypasses RLS, so use it only in
 * server code, and only after the caller is checked (admin) or validated
 * (public application form). Never import this from a client component.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export const BUCKET = "ba-applications";
