-- Enable RLS on both tables
alter table investors    enable row level security;
alter table transactions enable row level security;

-- Allow any logged-in user full access (admin-only app for now)
create policy "authenticated_all_investors"
  on investors for all
  to authenticated
  using (true)
  with check (true);

create policy "authenticated_all_transactions"
  on transactions for all
  to authenticated
  using (true)
  with check (true);
