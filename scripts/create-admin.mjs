// Creates (or promotes) a staff account for the admin dashboard.
//
//   ADMIN_EMAIL=you@school.cm ADMIN_PASSWORD='a-long-password' npm run admin:create
//
// The account gets app_metadata.ba_role = "admin". Only that flag opens /admin,
// so other users of a shared Supabase project cannot sign in to the dashboard.
// If the email already exists, the role is added and the password is left
// unchanged unless ADMIN_PASSWORD is set.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY. Fill .env.local first.");
  process.exit(1);
}
if (!email) {
  console.error("Set ADMIN_EMAIL (and ADMIN_PASSWORD for a new account).");
  process.exit(1);
}
if (password !== undefined && password.length < 10) {
  console.error("ADMIN_PASSWORD must be at least 10 characters.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

async function findUser() {
  for (let page = 1; page < 50; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === email);
    if (hit) return hit;
    if (data.users.length < 200) return null;
  }
  return null;
}

const existing = await findUser();

if (existing) {
  const { error } = await supabase.auth.admin.updateUserById(existing.id, {
    app_metadata: { ...existing.app_metadata, ba_role: "admin" },
    ...(password ? { password } : {}),
  });
  if (error) throw error;
  console.log(`Existing account ${email} can now sign in to /admin${password ? " (password updated)" : ""}.`);
} else {
  if (!password) {
    console.error("This email has no account yet. Set ADMIN_PASSWORD to create it.");
    process.exit(1);
  }
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { ba_role: "admin" },
  });
  if (error) throw error;
  console.log(`Created admin account ${email}. Sign in at /admin/login.`);
}
