# Supabase — Phase 2 (BUILD-SPEC.md §44, §8)

Flat-access schema (§2, §44, §45): one shared CMS login, no roles, no approval workflow. Anyone authenticated can create, edit, publish, and delete any content anywhere. `authors` is a byline roster, not a user-account table.

## Local development

```bash
supabase start          # spins up Postgres + Studio + Auth in Docker, applies migrations + seed.sql
supabase status -o env  # prints the local URL/anon key for .env.local
supabase stop           # when done
```

Copy `.env.local.example` to `.env.local` and fill in the local values from `supabase status`.

## Connecting the real project

Once the Supabase project exists (supabase.com dashboard):

```bash
supabase link --project-ref <project-ref>   # find this in the project's Settings → General
supabase db push                            # applies supabase/migrations/*.sql to the real project
```

Do **not** run `supabase db reset` against a linked remote project — it wipes the database. `seed.sql` only ever runs locally (`supabase start` / `supabase db reset`), never against a linked project via `db push`.

Then fill in `.env.local` (and the equivalent Vercel project env vars) from the dashboard's Settings → API page:

| Var | Where it's used | Safe to expose to the browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase/client.ts`, `server.ts`, `middleware.ts` | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same | Yes — RLS governs access, not secrecy of this key |
| `SUPABASE_SERVICE_ROLE_KEY` | Stripe webhook handler only (Phase 12, not yet built) | **No** — bypasses RLS entirely |

**Missing env vars fail safe, not loud.** `lib/supabase/middleware.ts` runs on every request site-wide (via `proxy.ts`) — if it threw on a missing/misconfigured Supabase URL the way a naive implementation would, it takes down every page, not just the ones that use Supabase (confirmed by testing this exact scenario during Phase 2). It now passes the request through unchanged instead. The Supabase-backed routes themselves (`/story/[slug]`, `/shop`, etc.) still fail if credentials are missing — acceptable for now since nothing links to them yet, but worth knowing before they go live.

## Schema

`supabase/migrations/`:
- `..._schema.sql` — tables, enums, indexes. `posts` is the one content type behind most editorial surfaces, discriminated by `category` (what it is) and `placement` (which homepage section it feeds) — see §44 for why both exist.
- `..._rls_policies.sql` — RLS on every table. Anonymous: read published content only. Authenticated: everything, on everything (flat access, no ownership or role checks).

Verified directly against a local instance during Phase 2 (not just asserted): unauthenticated writes rejected, any authenticated user can publish/edit/delete any post regardless of who created it, anon can read published content and is blocked from `orders` entirely (customer PII — written only by the Stripe webhook via the service-role key, once Phase 12 exists).

## Generating types

After any migration change:

```bash
supabase gen types typescript --local > lib/supabase/types.ts
```

Redirect stdout only (`>`, not `2>&1 >`) — the CLI writes status/version-check messages to stdout too, which would otherwise land in the generated file.
