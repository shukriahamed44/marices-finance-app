import type { Investor, Transaction } from './types'

export const MOCK_INVESTORS: Investor[] = [
  { id: '1', name: 'Karuna Anna',    return_rate: 7,    phone: null, notes: null, status: 'active',      created_at: '2025-05-11T00:00:00Z', deleted_at: null },
  { id: '2', name: 'Lathurshan',     return_rate: null, phone: null, notes: null, status: 'active',      created_at: '2025-11-10T00:00:00Z', deleted_at: null },
  { id: '3', name: 'Budika',         return_rate: 10,   phone: null, notes: null, status: 'closed',      created_at: '2025-06-14T00:00:00Z', deleted_at: null },
  { id: '4', name: 'Dinesh',         return_rate: 7,    phone: null, notes: null, status: 'placeholder', created_at: '2025-01-01T00:00:00Z', deleted_at: null },
  { id: '5', name: 'Dilenth',        return_rate: 7,    phone: null, notes: null, status: 'placeholder', created_at: '2025-01-01T00:00:00Z', deleted_at: null },
  { id: '6', name: 'Rukshan Anna',   return_rate: 7,    phone: null, notes: null, status: 'active',      created_at: '2026-05-10T00:00:00Z', deleted_at: null },
  { id: '7', name: 'Rushanthan',     return_rate: 7,    phone: null, notes: null, status: 'active',      created_at: '2026-05-11T00:00:00Z', deleted_at: null },
  { id: '8', name: 'Shaya',          return_rate: 7,    phone: null, notes: null, status: 'placeholder', created_at: '2025-01-01T00:00:00Z', deleted_at: null },
  { id: '9', name: 'Raihan',         return_rate: 7,    phone: null, notes: null, status: 'placeholder', created_at: '2025-01-01T00:00:00Z', deleted_at: null },
]

export const MOCK_TRANSACTIONS: Transaction[] = [
  // ── Karuna Anna ──────────────────────────────────────────────
  { id: 't1',  investor_id: '1', date: '2026-05-11', type: 'investment_capital', direction: 'in',  amount: 318000,  purpose: 'Business',         notes: null,              created_at: '2026-05-11T00:00:00Z' },
  { id: 't2',  investor_id: '1', date: '2026-05-11', type: 'investment_capital', direction: 'in',  amount: 89000,   purpose: 'Business',         notes: null,              created_at: '2026-05-11T00:00:00Z' },
  { id: 't3',  investor_id: '1', date: '2026-05-12', type: 'investment_capital', direction: 'in',  amount: 42000,   purpose: 'Business',         notes: null,              created_at: '2026-05-12T00:00:00Z' },
  { id: 't4',  investor_id: '1', date: '2026-05-12', type: 'investment_capital', direction: 'in',  amount: 112900,  purpose: 'Business',         notes: null,              created_at: '2026-05-12T00:00:00Z' },
  { id: 't5',  investor_id: '1', date: '2026-05-13', type: 'investment_capital', direction: 'in',  amount: 201500,  purpose: 'Business',         notes: null,              created_at: '2026-05-13T00:00:00Z' },
  { id: 't6',  investor_id: '1', date: '2026-05-13', type: 'investment_capital', direction: 'in',  amount: 20700,   purpose: 'Business',         notes: null,              created_at: '2026-05-13T00:00:00Z' },
  { id: 't7',  investor_id: '1', date: '2025-05-13', type: 'investment_capital', direction: 'in',  amount: 81000,   purpose: 'Business',         notes: null,              created_at: '2025-05-13T00:00:00Z' },
  { id: 't8',  investor_id: '1', date: '2025-05-19', type: 'investment_capital', direction: 'in',  amount: 5500,    purpose: 'Business',         notes: null,              created_at: '2025-05-19T00:00:00Z' },
  { id: 't9',  investor_id: '1', date: '2025-05-19', type: 'investment_capital', direction: 'in',  amount: 111834,  purpose: 'Business',         notes: null,              created_at: '2025-05-19T00:00:00Z' },
  { id: 't10', investor_id: '1', date: '2025-06-02', type: 'investment_capital', direction: 'in',  amount: 1680000, purpose: 'Business',         notes: null,              created_at: '2025-06-02T00:00:00Z' },
  { id: 't11', investor_id: '1', date: '2026-05-05', type: 'capital_return',     direction: 'out', amount: 72000,   purpose: null,               notes: 'Loan',            created_at: '2026-05-05T00:00:00Z' },

  // ── Lathurshan ───────────────────────────────────────────────
  { id: 't12', investor_id: '2', date: '2026-11-10', type: 'investment_capital', direction: 'in',  amount: 500000,  purpose: 'Rental Business',  notes: '25k every month', created_at: '2026-11-10T00:00:00Z' },
  { id: 't13', investor_id: '2', date: '2026-05-07', type: 'investment_capital', direction: 'in',  amount: 1000000, purpose: 'Perumal Photo',    notes: '160k every month return', created_at: '2026-05-07T00:00:00Z' },
  { id: 't14', investor_id: '2', date: '2026-06-12', type: 'investment_capital', direction: 'in',  amount: 500000,  purpose: 'Car Part',         notes: null,              created_at: '2026-06-12T00:00:00Z' },
  { id: 't15', investor_id: '2', date: '2025-12-04', type: 'profit_return',      direction: 'out', amount: 25000,   purpose: null,               notes: 'Rental Business', created_at: '2025-12-04T00:00:00Z' },
  { id: 't16', investor_id: '2', date: '2026-01-03', type: 'profit_return',      direction: 'out', amount: 25000,   purpose: null,               notes: 'Rental Business', created_at: '2026-01-03T00:00:00Z' },
  { id: 't17', investor_id: '2', date: '2026-02-05', type: 'profit_return',      direction: 'out', amount: 25000,   purpose: null,               notes: 'Rental Business', created_at: '2026-02-05T00:00:00Z' },
  { id: 't18', investor_id: '2', date: '2026-03-01', type: 'profit_return',      direction: 'out', amount: 25000,   purpose: null,               notes: 'Rental Business', created_at: '2026-03-01T00:00:00Z' },
  { id: 't19', investor_id: '2', date: '2026-04-05', type: 'profit_return',      direction: 'out', amount: 25000,   purpose: null,               notes: 'Rental Business', created_at: '2026-04-05T00:00:00Z' },
  { id: 't20', investor_id: '2', date: '2026-05-07', type: 'profit_return',      direction: 'out', amount: 25000,   purpose: null,               notes: 'Rental Business', created_at: '2026-05-07T00:00:00Z' },
  { id: 't21', investor_id: '2', date: '2026-06-04', type: 'profit_return',      direction: 'out', amount: 25000,   purpose: null,               notes: 'Rental Business', created_at: '2026-06-04T00:00:00Z' },
  { id: 't22', investor_id: '2', date: '2026-06-10', type: 'capital_return',     direction: 'out', amount: 60000,   purpose: null,               notes: 'Perumal Pic',     created_at: '2026-06-10T00:00:00Z' },

  // ── Budika ───────────────────────────────────────────────────
  { id: 't23', investor_id: '3', date: '2025-06-14', type: 'investment_capital', direction: 'in',  amount: 1000000, purpose: 'Export Business',  notes: '100k every month', created_at: '2025-06-14T00:00:00Z' },
  { id: 't24', investor_id: '3', date: '2025-08-30', type: 'profit_return',      direction: 'out', amount: 100000,  purpose: null,               notes: null,              created_at: '2025-08-30T00:00:00Z' },
  { id: 't25', investor_id: '3', date: '2025-09-29', type: 'profit_return',      direction: 'out', amount: 100000,  purpose: null,               notes: null,              created_at: '2025-09-29T00:00:00Z' },
  { id: 't26', investor_id: '3', date: '2025-10-30', type: 'profit_return',      direction: 'out', amount: 100000,  purpose: null,               notes: null,              created_at: '2025-10-30T00:00:00Z' },
  { id: 't27', investor_id: '3', date: '2026-11-30', type: 'profit_return',      direction: 'out', amount: 100000,  purpose: null,               notes: null,              created_at: '2026-11-30T00:00:00Z' },
  { id: 't28', investor_id: '3', date: '2025-12-28', type: 'profit_return',      direction: 'out', amount: 100000,  purpose: null,               notes: null,              created_at: '2025-12-28T00:00:00Z' },
  { id: 't29', investor_id: '3', date: '2025-01-30', type: 'profit_return',      direction: 'out', amount: 120000,  purpose: null,               notes: null,              created_at: '2025-01-30T00:00:00Z' },
  { id: 't30', investor_id: '3', date: '2026-02-28', type: 'profit_return',      direction: 'out', amount: 100000,  purpose: null,               notes: null,              created_at: '2026-02-28T00:00:00Z' },
  { id: 't31', investor_id: '3', date: '2026-03-28', type: 'profit_return',      direction: 'out', amount: 100000,  purpose: null,               notes: null,              created_at: '2026-03-28T00:00:00Z' },
  { id: 't32', investor_id: '3', date: '2026-04-30', type: 'profit_return',      direction: 'out', amount: 150000,  purpose: null,               notes: null,              created_at: '2026-04-30T00:00:00Z' },
  { id: 't33', investor_id: '3', date: '2026-05-30', type: 'profit_return',      direction: 'out', amount: 130000,  purpose: null,               notes: null,              created_at: '2026-05-30T00:00:00Z' },

  // ── Rukshan Anna ─────────────────────────────────────────────
  { id: 't34', investor_id: '6', date: '2026-05-27', type: 'investment_capital', direction: 'in',  amount: 541000,  purpose: 'Vape',             notes: null,              created_at: '2026-05-27T00:00:00Z' },
  { id: 't35', investor_id: '6', date: '2026-05-27', type: 'investment_capital', direction: 'in',  amount: 410000,  purpose: 'Wheelchair',       notes: '10 Rukshan / 10 Dinesh', created_at: '2026-05-27T00:00:00Z' },
  { id: 't36', investor_id: '6', date: '2026-05-10', type: 'investment_capital', direction: 'in',  amount: 565000,  purpose: 'Fridge',           notes: '14k profit',      created_at: '2026-05-10T00:00:00Z' },
  { id: 't37', investor_id: '6', date: '2026-06-03', type: 'capital_return',     direction: 'out', amount: 420000,  purpose: null,               notes: null,              created_at: '2026-06-03T00:00:00Z' },
  { id: 't38', investor_id: '6', date: '2026-06-13', type: 'capital_return',     direction: 'out', amount: 579000,  purpose: null,               notes: 'Fridge',          created_at: '2026-06-13T00:00:00Z' },
  { id: 't39', investor_id: '6', date: '2026-06-15', type: 'capital_return',     direction: 'out', amount: 260000,  purpose: null,               notes: 'Vape',            created_at: '2026-06-15T00:00:00Z' },

  // ── Rushanthan ───────────────────────────────────────────────
  { id: 't40', investor_id: '7', date: '2026-05-11', type: 'investment_capital', direction: 'in',  amount: 530000,  purpose: 'Business',         notes: "Dilneth Laptop 5/20",       created_at: '2026-05-11T00:00:00Z' },
  { id: 't41', investor_id: '7', date: '2026-05-14', type: 'investment_capital', direction: 'in',  amount: 780000,  purpose: 'Business',         notes: 'Clearance Tank 70k',        created_at: '2026-05-14T00:00:00Z' },
  { id: 't42', investor_id: '7', date: '2026-05-17', type: 'investment_capital', direction: 'in',  amount: 100000,  purpose: 'Business',         notes: 'Dhiva Anna Saree',          created_at: '2026-05-17T00:00:00Z' },
  { id: 't43', investor_id: '7', date: '2026-05-21', type: 'investment_capital', direction: 'in',  amount: 300000,  purpose: 'Phone Auction',    notes: null,              created_at: '2026-05-21T00:00:00Z' },
  { id: 't44', investor_id: '7', date: '2026-05-22', type: 'investment_capital', direction: 'in',  amount: 1000000, purpose: 'Phone Auction',    notes: null,              created_at: '2026-05-22T00:00:00Z' },
  { id: 't45', investor_id: '7', date: '2026-05-23', type: 'investment_capital', direction: 'in',  amount: 700000,  purpose: 'Phone Auction',    notes: null,              created_at: '2026-05-23T00:00:00Z' },
  { id: 't46', investor_id: '7', date: '2026-05-24', type: 'investment_capital', direction: 'in',  amount: 204300,  purpose: 'Business',         notes: 'Indian Currency Naresh',    created_at: '2026-05-24T00:00:00Z' },
  { id: 't47', investor_id: '7', date: '2026-05-25', type: 'investment_capital', direction: 'in',  amount: 250000,  purpose: 'Business',         notes: 'Sajee 17 Pro Max (12k)',    created_at: '2026-05-25T00:00:00Z' },
  { id: 't48', investor_id: '7', date: '2026-05-28', type: 'investment_capital', direction: 'in',  amount: 250000,  purpose: 'Business',         notes: 'Sajee 17 Pro Max (12k)',    created_at: '2026-05-28T00:00:00Z' },
  { id: 't49', investor_id: '7', date: '2026-05-06', type: 'investment_capital', direction: 'in',  amount: 400000,  purpose: 'Business',         notes: 'Lanka Hospital Laptop',     created_at: '2026-05-06T00:00:00Z' },
  { id: 't50', investor_id: '7', date: '2026-05-20', type: 'capital_return',     direction: 'out', amount: 450000,  purpose: null,               notes: 'Dilneth / NDB',   created_at: '2026-05-20T00:00:00Z' },
  { id: 't51', investor_id: '7', date: '2026-05-20', type: 'capital_return',     direction: 'out', amount: 95000,   purpose: null,               notes: 'Dilneth / Com Bank', created_at: '2026-05-20T00:00:00Z' },
  { id: 't52', investor_id: '7', date: '2026-05-20', type: 'capital_return',     direction: 'out', amount: 104000,  purpose: null,               notes: 'Dhiva / Hand',    created_at: '2026-05-20T00:00:00Z' },
  { id: 't53', investor_id: '7', date: '2026-05-24', type: 'capital_return',     direction: 'out', amount: 213300,  purpose: null,               notes: 'India Cash / Hand', created_at: '2026-05-24T00:00:00Z' },
  { id: 't54', investor_id: '7', date: '2025-05-06', type: 'capital_return',     direction: 'out', amount: 108000,  purpose: null,               notes: 'Sujee Phone Cash',  created_at: '2025-05-06T00:00:00Z' },
  { id: 't55', investor_id: '7', date: '2025-05-09', type: 'capital_return',     direction: 'out', amount: 570000,  purpose: null,               notes: 'Mama Business',   created_at: '2025-05-09T00:00:00Z' },
  { id: 't56', investor_id: '7', date: '2025-06-15', type: 'capital_return',     direction: 'out', amount: 408000,  purpose: null,               notes: 'Lanka Hospital Lap', created_at: '2025-06-15T00:00:00Z' },
]
