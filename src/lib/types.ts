export type InvestorStatus = 'active' | 'closed' | 'placeholder'

export type TransactionDirection = 'in' | 'out'

export type TransactionType =
  | 'investment_capital'
  | 'additional_capital'
  | 'capital_return'
  | 'profit_return'
  | 'loan'
  | 'adjustment'

export interface Investor {
  id: string
  name: string
  return_rate: number | null
  phone: string | null
  notes: string | null
  status: InvestorStatus
  created_at: string
}

export interface Transaction {
  id: string
  investor_id: string
  date: string
  type: TransactionType
  direction: TransactionDirection
  amount: number
  purpose: string | null
  notes: string | null
  created_at: string
}

export interface InvestorBalance {
  id: string
  name: string
  return_rate: number | null
  status: InvestorStatus
  total_invested: number
  total_paid: number
  remaining_balance: number
  total_profit_paid: number
  total_capital_returned: number
}

export interface TransactionWithInvestor extends Transaction {
  investor_name: string
}

export const TRANSACTION_LABELS: Record<TransactionType, string> = {
  investment_capital: 'Investment Capital',
  additional_capital: 'Additional Capital',
  capital_return: 'Capital Return',
  profit_return: 'Profit Return',
  loan: 'Loan',
  adjustment: 'Adjustment',
}
