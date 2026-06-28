-- ============================================================
-- Client Finances — DEBTS (run AFTER cf_schema.sql)
-- A debt is a simple entry: who owes you + how much.
-- No per-person ledger — just name + amount.
-- Run this in Supabase → SQL Editor.
-- ============================================================

create table if not exists public.cf_debts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name       text not null,
  amount     numeric not null default 0 check (amount >= 0),
  note       text not null default '',
  settled    boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.cf_debts enable row level security;

drop policy if exists "cf_debts_owner" on public.cf_debts;
create policy "cf_debts_owner" on public.cf_debts
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
