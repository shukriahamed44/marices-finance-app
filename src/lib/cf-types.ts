// ─── Client Finances (freelancer tracker) types ──────────────
// Standalone addition — does NOT touch the existing investor Finances domain.

export interface CFClient {
  id: string
  user_id: string
  name: string
  created_at: string
}

export interface CFJob {
  id: string
  user_id: string
  client_id: string
  title: string
  total_amount: number
  created_at: string
}

export type CFDirection = 'in' | 'out'

export interface CFDebt {
  id: string
  user_id: string
  name: string
  amount: number
  note: string
  settled: boolean
  created_at: string
}

export interface CFTransaction {
  id: string
  user_id: string
  client_id: string | null
  job_id: string | null
  direction: CFDirection
  amount: number
  note: string
  created_at: string
}

// ─── Derived shapes ──────────────────────────────────────────
export interface CFClientStats {
  billed: number       // sum of job totals
  paid: number         // sum of "in" transactions for the client
  outstanding: number  // max(billed - paid, 0)
}

export interface CFJobStats {
  paid: number
  outstanding: number
  isPaid: boolean
}

export interface CFTransactionWithClient extends CFTransaction {
  client_name: string | null
  job_title: string | null
}

// ─── Investments ─────────────────────────────────────────────
export type CFInvestmentStatus = 'active' | 'gained' | 'lost' | 'partial'
export type CFInvestmentSector =
  | 'Crypto' | 'Equity' | 'Commodity' | 'Forex'
  | 'Index' | 'Private Deal' | 'Real Estate' | 'Other'

export interface CFInvestment {
  id: string
  user_id: string
  entity: string
  brief: string
  sector: CFInvestmentSector
  amount_invested: number
  expected_return: number | null
  target_date: string | null
  status: CFInvestmentStatus
  actual_return: number | null
  notes: string
  invested_at: string
  created_at: string
}
