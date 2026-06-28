-- ============================================================
-- Client Finances (freelancer tracker) — schema + RLS
-- Run this in Supabase → SQL Editor.
-- Standalone: does not touch the existing investors/transactions.
-- Every row is scoped to the authenticated user (auth.uid()).
-- ============================================================

-- ── Clients ────────────────────────────────────────────────
create table if not exists public.cf_clients (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now()
);

-- ── Jobs (one client has many jobs) ────────────────────────
create table if not exists public.cf_jobs (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users(id) on delete cascade,
  client_id    uuid not null references public.cf_clients(id) on delete cascade,
  title        text not null,
  total_amount numeric not null default 0,
  created_at   timestamptz not null default now()
);

-- ── Transactions (money in / out) ──────────────────────────
create table if not exists public.cf_transactions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  client_id  uuid references public.cf_clients(id) on delete set null,
  job_id     uuid references public.cf_jobs(id) on delete set null,
  direction  text not null check (direction in ('in', 'out')),
  amount     numeric not null check (amount >= 0),
  note       text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists cf_jobs_client_idx        on public.cf_jobs(client_id);
create index if not exists cf_transactions_client_idx on public.cf_transactions(client_id);
create index if not exists cf_transactions_job_idx    on public.cf_transactions(job_id);

-- ── Row Level Security ─────────────────────────────────────
alter table public.cf_clients      enable row level security;
alter table public.cf_jobs         enable row level security;
alter table public.cf_transactions enable row level security;

-- Each user can only see / mutate their own rows.
do $$
declare t text;
begin
  foreach t in array array['cf_clients', 'cf_jobs', 'cf_transactions'] loop
    execute format('drop policy if exists "%s_owner" on public.%I;', t, t);
    execute format(
      'create policy "%s_owner" on public.%I
         for all
         using (auth.uid() = user_id)
         with check (auth.uid() = user_id);', t, t);
  end loop;
end $$;
