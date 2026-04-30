import { createClient } from "@supabase/supabase-js";

// Server-only admin client — reads env vars at call time, not module load time
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
