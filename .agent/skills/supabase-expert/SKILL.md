---
name: supabase-expert
description: Specialized knowledge for Supabase application development. Use when working with RLS, Edge Functions, Database Webhooks, or Supabase Auth.
---

# Supabase Expert Skill

## When to use this skill

- User asks about "Supabase", "Postgres", or "back-end"
- Setting up Row Level Security (RLS) policies
- deploying Edge Functions
- Configuring Database Webhooks
- Debugging authentication or permission issues

## Workflow

1. **Schema & Types**: Ensure Database types are generated and synced.
2. **Security First**: Enable RLS on all tables immediately.
3. **Functions**: Use Edge Functions for business logic, not just generic APIs.
4. **Realtime**: Configure realtime subscriptions carefully.

## Instructions

### 1. Row Level Security (RLS)

- **Enable RLS**: `ALTER TABLE "table_name" ENABLE ROW LEVEL SECURITY;`
- **Policies**: Create specific policies for SELECT, INSERT, UPDATE, DELETE.
  - *Example*: `CREATE POLICY "Users can see their own data" ON "users" FOR SELECT USING (auth.uid() = id);`
- **Helper Functions**: Use `auth.uid()` and custom claims securely.
- **Service Role**: Use `supabaseAdmin` (service_role key) ONLY in secure server-side contexts options (Edge Functions / Next.js API routes), never in client.

### 2. Edge Functions

- **Development**: Run `supabase functions serve` to test locally.
- **Secrets**: Store secrets in `.env.local` and set them via CLI: `supabase secrets set --env-file .env`.
- **CORS**: Handle OPTIONS requests explicitly in generic functions.
- **Database Access**: Use the direct Postgres connection (via Deno-Postgres or Supabase client) for performance.

### 3. Database Webhooks

- **Trigger**: Use `pg_net` to trigger HTTP requests on table changes.
- **Security**: Validate the pre-shared secret in the webhook receiver.
- **Idempotency**: Ensure the receiving endpoint can handle duplicate events.

### 4. Client Integration

- **Singleton**: Use a singleton pattern for the Supabase client to avoid multiple instances.
- **SSR**: Use `ssr` package for Next.js to handle cookies automatically.

## Resources

- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions Quickstart](https://supabase.com/docs/guides/functions)
