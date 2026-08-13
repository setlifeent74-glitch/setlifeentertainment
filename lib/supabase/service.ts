import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Service-role client — bypasses RLS entirely. Only for trusted, narrow,
 * server-only writes where requiring a table-level GRANT for anon would
 * force broader access than the operation needs (§37: saving newsletter
 * preferences needs an UPDATE ... WHERE id = $1, which Postgres requires
 * SELECT privilege to evaluate even with UPDATE granted — granting anon
 * SELECT here would let it enumerate every subscriber's email).
 *
 * Only ever import this from a "use server" action or Route Handler —
 * never from a Server Component that could get statically optimized into
 * a shared bundle, and never from a Client Component. There's no build-time
 * guard for that here (the `server-only` package would add one), so this
 * is enforced by review, the same way SUPABASE_SERVICE_ROLE_KEY itself
 * (unprefixed, never NEXT_PUBLIC_) already is.
 */
export function createServiceClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
