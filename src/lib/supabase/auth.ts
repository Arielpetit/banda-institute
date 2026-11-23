import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminMetadata } from "@/lib/admin";

/** Supabase Auth client bound to the request cookies (admin sessions). */
export async function createAuthClient() {
  const store = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Called from a Server Component: the proxy refreshes the session instead.
        }
      },
    },
  });
}

/**
 * Data-layer guard. Call it at the top of every admin page, action and route.
 * Asks the Auth server (getUser) rather than trusting the cookie alone.
 */
export async function requireAdmin() {
  const supabase = await createAuthClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user || !isAdminMetadata(data.user.app_metadata)) redirect("/admin/login");
  return data.user;
}
