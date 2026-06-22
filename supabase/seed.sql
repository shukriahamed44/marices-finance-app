-- ============================================================
-- Matrices Finance — Seed Data (from Excel)
-- ============================================================

-- Investors
insert into investors (id, name, return_rate, status) values
  ('00000001-0000-0000-0000-000000000001', 'Karuna Anna',   7,    'active'),
  ('00000001-0000-0000-0000-000000000002', 'Lathurshan',    null, 'active'),
  ('00000001-0000-0000-0000-000000000003', 'Budika',        10,   'closed'),
  ('00000001-0000-0000-0000-000000000004', 'Dinesh',        7,    'placeholder'),
  ('00000001-0000-0000-0000-000000000005', 'Dilenth',       7,    'placeholder'),
  ('00000001-0000-0000-0000-000000000006', 'Rukshan Anna',  7,    'active'),
  ('00000001-0000-0000-0000-000000000007', 'Rushanthan',    7,    'active'),
  ('00000001-0000-0000-0000-000000000008', 'Shaya',         7,    'placeholder'),
  ('00000001-0000-0000-0000-000000000009', 'Raihan',        7,    'placeholder');

-- Karuna Anna transactions
insert into transactions (investor_id, date, type, direction, amount, purpose, notes) values
  ('00000001-0000-0000-0000-000000000001', '2026-05-11', 'investment_capital', 'in',  318000,  'Business', null),
  ('00000001-0000-0000-0000-000000000001', '2026-05-11', 'investment_capital', 'in',  89000,   'Business', null),
  ('00000001-0000-0000-0000-000000000001', '2026-05-12', 'investment_capital', 'in',  42000,   'Business', null),
  ('00000001-0000-0000-0000-000000000001', '2026-05-12', 'investment_capital', 'in',  112900,  'Business', null),
  ('00000001-0000-0000-0000-000000000001', '2026-05-13', 'investment_capital', 'in',  201500,  'Business', null),
  ('00000001-0000-0000-0000-000000000001', '2026-05-13', 'investment_capital', 'in',  20700,   'Business', null),
  ('00000001-0000-0000-0000-000000000001', '2025-05-13', 'investment_capital', 'in',  81000,   'Business', null),
  ('00000001-0000-0000-0000-000000000001', '2025-05-19', 'investment_capital', 'in',  5500,    'Business', null),
  ('00000001-0000-0000-0000-000000000001', '2025-05-19', 'investment_capital', 'in',  111834,  'Business', null),
  ('00000001-0000-0000-0000-000000000001', '2025-06-02', 'investment_capital', 'in',  1680000, 'Business', null),
  ('00000001-0000-0000-0000-000000000001', '2026-05-05', 'capital_return',     'out', 72000,   null,       'Loan');

-- Lathurshan transactions
insert into transactions (investor_id, date, type, direction, amount, purpose, notes) values
  ('00000001-0000-0000-0000-000000000002', '2026-11-10', 'investment_capital', 'in',  500000,  'Rental Business', '25k every month'),
  ('00000001-0000-0000-0000-000000000002', '2026-05-07', 'investment_capital', 'in',  1000000, 'Perumal Photo',   '160k every month return'),
  ('00000001-0000-0000-0000-000000000002', '2026-06-12', 'investment_capital', 'in',  500000,  'Car Part',        null),
  ('00000001-0000-0000-0000-000000000002', '2025-12-04', 'profit_return',      'out', 25000,   null,              'Rental Business'),
  ('00000001-0000-0000-0000-000000000002', '2026-01-03', 'profit_return',      'out', 25000,   null,              'Rental Business'),
  ('00000001-0000-0000-0000-000000000002', '2026-02-05', 'profit_return',      'out', 25000,   null,              'Rental Business'),
  ('00000001-0000-0000-0000-000000000002', '2026-03-01', 'profit_return',      'out', 25000,   null,              'Rental Business'),
  ('00000001-0000-0000-0000-000000000002', '2026-04-05', 'profit_return',      'out', 25000,   null,              'Rental Business'),
  ('00000001-0000-0000-0000-000000000002', '2026-05-07', 'profit_return',      'out', 25000,   null,              'Rental Business'),
  ('00000001-0000-0000-0000-000000000002', '2026-06-04', 'profit_return',      'out', 25000,   null,              'Rental Business'),
  ('00000001-0000-0000-0000-000000000002', '2026-06-10', 'capital_return',     'out', 60000,   null,              'Perumal Pic');

-- Budika transactions
insert into transactions (investor_id, date, type, direction, amount, purpose, notes) values
  ('00000001-0000-0000-0000-000000000003', '2025-06-14', 'investment_capital', 'in',  1000000, 'Export Business', '100k every month'),
  ('00000001-0000-0000-0000-000000000003', '2025-08-30', 'profit_return',      'out', 100000,  null, null),
  ('00000001-0000-0000-0000-000000000003', '2025-09-29', 'profit_return',      'out', 100000,  null, null),
  ('00000001-0000-0000-0000-000000000003', '2025-10-30', 'profit_return',      'out', 100000,  null, null),
  ('00000001-0000-0000-0000-000000000003', '2026-11-30', 'profit_return',      'out', 100000,  null, null),
  ('00000001-0000-0000-0000-000000000003', '2025-12-28', 'profit_return',      'out', 100000,  null, null),
  ('00000001-0000-0000-0000-000000000003', '2026-02-28', 'profit_return',      'out', 100000,  null, null),
  ('00000001-0000-0000-0000-000000000003', '2026-03-28', 'profit_return',      'out', 100000,  null, null),
  ('00000001-0000-0000-0000-000000000003', '2026-04-30', 'profit_return',      'out', 150000,  null, null),
  ('00000001-0000-0000-0000-000000000003', '2026-05-30', 'profit_return',      'out', 130000,  null, null);

-- Rukshan Anna transactions
insert into transactions (investor_id, date, type, direction, amount, purpose, notes) values
  ('00000001-0000-0000-0000-000000000006', '2026-05-27', 'investment_capital', 'in',  541000, 'Vape',        null),
  ('00000001-0000-0000-0000-000000000006', '2026-05-27', 'investment_capital', 'in',  410000, 'Wheelchair',  '10 Rukshan / 10 Dinesh'),
  ('00000001-0000-0000-0000-000000000006', '2026-05-10', 'investment_capital', 'in',  565000, 'Fridge',      '14k profit'),
  ('00000001-0000-0000-0000-000000000006', '2026-06-03', 'capital_return',     'out', 420000, null,          null),
  ('00000001-0000-0000-0000-000000000006', '2026-06-13', 'capital_return',     'out', 579000, null,          'Fridge'),
  ('00000001-0000-0000-0000-000000000006', '2026-06-15', 'capital_return',     'out', 260000, null,          'Vape');

-- Rushanthan transactions
insert into transactions (investor_id, date, type, direction, amount, purpose, notes) values
  ('00000001-0000-0000-0000-000000000007', '2026-05-11', 'investment_capital', 'in',  530000,  'Business', 'Dilneth Laptop 5/20'),
  ('00000001-0000-0000-0000-000000000007', '2026-05-14', 'investment_capital', 'in',  780000,  'Business', 'Clearance Tank 70k'),
  ('00000001-0000-0000-0000-000000000007', '2026-05-17', 'investment_capital', 'in',  100000,  'Business', 'Dhiva Anna Saree'),
  ('00000001-0000-0000-0000-000000000007', '2026-05-21', 'investment_capital', 'in',  300000,  'Phone Auction', null),
  ('00000001-0000-0000-0000-000000000007', '2026-05-22', 'investment_capital', 'in',  1000000, 'Phone Auction', null),
  ('00000001-0000-0000-0000-000000000007', '2026-05-23', 'investment_capital', 'in',  700000,  'Phone Auction', null),
  ('00000001-0000-0000-0000-000000000007', '2026-05-24', 'investment_capital', 'in',  204300,  'Business', 'Indian Currency Naresh'),
  ('00000001-0000-0000-0000-000000000007', '2026-05-25', 'investment_capital', 'in',  250000,  'Business', 'Sajee 17 Pro Max 12k'),
  ('00000001-0000-0000-0000-000000000007', '2026-05-28', 'investment_capital', 'in',  250000,  'Business', 'Sajee 17 Pro Max 12k'),
  ('00000001-0000-0000-0000-000000000007', '2026-05-06', 'investment_capital', 'in',  400000,  'Business', 'Lanka Hospital Laptop'),
  ('00000001-0000-0000-0000-000000000007', '2026-05-20', 'capital_return',     'out', 450000,  null, 'Dilneth / NDB'),
  ('00000001-0000-0000-0000-000000000007', '2026-05-20', 'capital_return',     'out', 95000,   null, 'Dilneth / Com Bank'),
  ('00000001-0000-0000-0000-000000000007', '2026-05-20', 'capital_return',     'out', 104000,  null, 'Dhiva / Hand'),
  ('00000001-0000-0000-0000-000000000007', '2026-05-24', 'capital_return',     'out', 213300,  null, 'India Cash / Hand'),
  ('00000001-0000-0000-0000-000000000007', '2025-05-06', 'capital_return',     'out', 108000,  null, 'Sujee Phone Cash'),
  ('00000001-0000-0000-0000-000000000007', '2025-05-09', 'capital_return',     'out', 570000,  null, 'Mama Business'),
  ('00000001-0000-0000-0000-000000000007', '2025-06-15', 'capital_return',     'out', 408000,  null, 'Lanka Hospital Lap');
