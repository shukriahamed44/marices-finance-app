-- ============================================================
-- Matrices Finance — Supabase Schema
-- ============================================================

create extension if not exists "uuid-ossp";

-- Investors
create table if not exists investors (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  return_rate numeric(5,2),
  phone       text,
  notes       text,
  status      text not null default 'active' check (status in ('active','closed','placeholder')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Transactions
create table if not exists transactions (
  id          uuid primary key default uuid_generate_v4(),
  investor_id uuid not null references investors(id) on delete restrict,
  date        date not null,
  type        text not null check (type in (
    'investment_capital','additional_capital',
    'capital_return','profit_return','loan','adjustment'
  )),
  direction   text not null check (direction in ('in','out')),
  amount      numeric(15,2) not null check (amount > 0),
  purpose     text,
  notes       text,
  created_at  timestamptz not null default now(),
  created_by  uuid,
  updated_at  timestamptz not null default now()
);

create index if not exists transactions_investor_id_idx on transactions(investor_id);
create index if not exists transactions_date_idx        on transactions(date desc);

-- Live balance view
create or replace view investor_balances as
select
  i.id,
  i.name,
  i.return_rate,
  i.status,
  i.phone,
  i.notes,
  coalesce(sum(case when t.direction='in'  then t.amount else 0 end),0)                            as total_invested,
  coalesce(sum(case when t.direction='out' then t.amount else 0 end),0)                            as total_paid,
  coalesce(sum(case when t.direction='in'  then t.amount else 0 end),0)
  - coalesce(sum(case when t.direction='out' then t.amount else 0 end),0)                          as remaining_balance,
  coalesce(sum(case when t.direction='out' and t.type='profit_return'   then t.amount else 0 end),0) as total_profit_paid,
  coalesce(sum(case when t.direction='out' and t.type='capital_return'  then t.amount else 0 end),0) as total_capital_returned
from investors i
left join transactions t on t.investor_id = i.id
group by i.id, i.name, i.return_rate, i.status, i.phone, i.notes;

-- updated_at trigger
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger investors_updated_at    before update on investors    for each row execute function update_updated_at();
create trigger transactions_updated_at before update on transactions for each row execute function update_updated_at();

-- Row Level Security (enable when auth is added)
-- alter table investors    enable row level security;
-- alter table transactions enable row level security;
