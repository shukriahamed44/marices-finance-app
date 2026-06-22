import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Investor, Transaction, InvestorBalance, TransactionWithInvestor } from '../lib/types'
import { MOCK_INVESTORS, MOCK_TRANSACTIONS } from '../lib/mockData'

interface AppContextValue {
  investors: Investor[]
  transactions: Transaction[]
  balances: InvestorBalance[]
  recentTransactions: TransactionWithInvestor[]
  addTransaction: (tx: Omit<Transaction, 'id' | 'created_at'>) => void
  updateTransaction: (id: string, patch: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  addInvestor: (inv: Omit<Investor, 'id' | 'created_at'>) => void
  updateInvestor: (id: string, patch: Partial<Investor>) => void
  getInvestorById: (id: string) => Investor | undefined
  getBalanceById: (id: string) => InvestorBalance | undefined
  getTransactionsByInvestor: (id: string) => Transaction[]
}

const AppContext = createContext<AppContextValue | null>(null)

function computeBalances(investors: Investor[], transactions: Transaction[]): InvestorBalance[] {
  return investors.map(inv => {
    const txs = transactions.filter(t => t.investor_id === inv.id)
    const total_invested        = txs.filter(t => t.direction === 'in').reduce((s, t) => s + t.amount, 0)
    const total_paid            = txs.filter(t => t.direction === 'out').reduce((s, t) => s + t.amount, 0)
    const total_profit_paid     = txs.filter(t => t.direction === 'out' && t.type === 'profit_return').reduce((s, t) => s + t.amount, 0)
    const total_capital_returned = txs.filter(t => t.direction === 'out' && t.type === 'capital_return').reduce((s, t) => s + t.amount, 0)
    return {
      id: inv.id, name: inv.name, return_rate: inv.return_rate, status: inv.status,
      total_invested, total_paid, remaining_balance: total_invested - total_paid,
      total_profit_paid, total_capital_returned,
    }
  })
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [investors, setInvestors]       = useState<Investor[]>(MOCK_INVESTORS)
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)

  const balances = computeBalances(investors, transactions)

  const recentTransactions: TransactionWithInvestor[] = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 50)
    .map(t => ({ ...t, investor_name: investors.find(i => i.id === t.investor_id)?.name ?? 'Unknown' }))

  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'created_at'>) => {
    const newTx: Transaction = { ...tx, id: crypto.randomUUID(), created_at: new Date().toISOString() }
    setTransactions(prev => [newTx, ...prev])
  }, [])

  const updateTransaction = useCallback((id: string, patch: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t))
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }, [])

  const addInvestor = useCallback((inv: Omit<Investor, 'id' | 'created_at'>) => {
    const newInv: Investor = { ...inv, id: crypto.randomUUID(), created_at: new Date().toISOString() }
    setInvestors(prev => [...prev, newInv])
  }, [])

  const updateInvestor = useCallback((id: string, patch: Partial<Investor>) => {
    setInvestors(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i))
  }, [])

  const getInvestorById      = useCallback((id: string) => investors.find(i => i.id === id), [investors])
  const getBalanceById       = useCallback((id: string) => balances.find(b => b.id === id), [balances])
  const getTransactionsByInvestor = useCallback((id: string) =>
    transactions.filter(t => t.investor_id === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions])

  return (
    <AppContext.Provider value={{
      investors, transactions, balances, recentTransactions,
      addTransaction, updateTransaction, deleteTransaction,
      addInvestor, updateInvestor,
      getInvestorById, getBalanceById, getTransactionsByInvestor,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
