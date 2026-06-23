import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { Investor, Transaction, InvestorBalance, TransactionWithInvestor } from '../lib/types'
import { MOCK_INVESTORS, MOCK_TRANSACTIONS } from '../lib/mockData'
import { supabase, USE_MOCK } from '../lib/supabase'

interface AppContextValue {
  investors: Investor[]
  transactions: Transaction[]
  balances: InvestorBalance[]
  recentTransactions: TransactionWithInvestor[]
  loading: boolean
  addTransaction: (tx: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>
  updateTransaction: (id: string, patch: Partial<Transaction>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  addInvestor: (inv: Omit<Investor, 'id' | 'created_at'>) => Promise<void>
  updateInvestor: (id: string, patch: Partial<Investor>) => Promise<void>
  getInvestorById: (id: string) => Investor | undefined
  getBalanceById: (id: string) => InvestorBalance | undefined
  getTransactionsByInvestor: (id: string) => Transaction[]
}

const AppContext = createContext<AppContextValue | null>(null)

function computeBalances(investors: Investor[], transactions: Transaction[]): InvestorBalance[] {
  return investors.map(inv => {
    const txs = transactions.filter(t => t.investor_id === inv.id)
    const total_invested         = txs.filter(t => t.direction === 'in').reduce((s, t) => s + t.amount, 0)
    const total_paid             = txs.filter(t => t.direction === 'out').reduce((s, t) => s + t.amount, 0)
    const total_profit_paid      = txs.filter(t => t.direction === 'out' && t.type === 'profit_return').reduce((s, t) => s + t.amount, 0)
    const total_capital_returned = txs.filter(t => t.direction === 'out' && t.type === 'capital_return').reduce((s, t) => s + t.amount, 0)
    return {
      id: inv.id, name: inv.name, return_rate: inv.return_rate, status: inv.status,
      total_invested, total_paid,
      remaining_balance: total_invested - total_paid,
      total_profit_paid, total_capital_returned,
    }
  })
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [investors,    setInvestors]    = useState<Investor[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading,      setLoading]      = useState(true)

  // ── Initial data load ────────────────────────────────────────
  useEffect(() => {
    if (USE_MOCK) {
      setInvestors(MOCK_INVESTORS)
      setTransactions(MOCK_TRANSACTIONS)
      setLoading(false)
      return
    }

    async function load() {
      const [invRes, txRes] = await Promise.all([
        supabase!.from('investors').select('*').order('name'),
        supabase!.from('transactions').select('*').order('date', { ascending: false }),
      ])
      if (invRes.data) setInvestors(invRes.data as Investor[])
      if (txRes.data)  setTransactions(txRes.data as Transaction[])
      setLoading(false)
    }

    load()
  }, [])

  // ── Derived state ────────────────────────────────────────────
  const balances = computeBalances(investors, transactions)

  const recentTransactions: TransactionWithInvestor[] = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 50)
    .map(t => ({ ...t, investor_name: investors.find(i => i.id === t.investor_id)?.name ?? 'Unknown' }))

  // ── Transactions ─────────────────────────────────────────────
  const addTransaction = useCallback(async (tx: Omit<Transaction, 'id' | 'created_at'>) => {
    if (USE_MOCK) {
      const newTx: Transaction = { ...tx, id: crypto.randomUUID(), created_at: new Date().toISOString() }
      setTransactions(prev => [newTx, ...prev])
      return
    }
    const { data, error } = await supabase!.from('transactions').insert(tx).select().single()
    if (!error && data) setTransactions(prev => [data as Transaction, ...prev])
  }, [])

  const updateTransaction = useCallback(async (id: string, patch: Partial<Transaction>) => {
    if (USE_MOCK) {
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t))
      return
    }
    const { data, error } = await supabase!.from('transactions').update(patch).eq('id', id).select().single()
    if (!error && data) setTransactions(prev => prev.map(t => t.id === id ? data as Transaction : t))
  }, [])

  const deleteTransaction = useCallback(async (id: string) => {
    if (USE_MOCK) {
      setTransactions(prev => prev.filter(t => t.id !== id))
      return
    }
    const { error } = await supabase!.from('transactions').delete().eq('id', id)
    if (!error) setTransactions(prev => prev.filter(t => t.id !== id))
  }, [])

  // ── Investors ────────────────────────────────────────────────
  const addInvestor = useCallback(async (inv: Omit<Investor, 'id' | 'created_at'>) => {
    if (USE_MOCK) {
      const newInv: Investor = { ...inv, id: crypto.randomUUID(), created_at: new Date().toISOString() }
      setInvestors(prev => [...prev, newInv])
      return
    }
    const { data, error } = await supabase!.from('investors').insert(inv).select().single()
    if (!error && data) setInvestors(prev => [...prev, data as Investor])
  }, [])

  const updateInvestor = useCallback(async (id: string, patch: Partial<Investor>) => {
    if (USE_MOCK) {
      setInvestors(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i))
      return
    }
    const { data, error } = await supabase!.from('investors').update(patch).eq('id', id).select().single()
    if (!error && data) setInvestors(prev => prev.map(i => i.id === id ? data as Investor : i))
  }, [])

  // ── Lookups ──────────────────────────────────────────────────
  const getInvestorById           = useCallback((id: string) => investors.find(i => i.id === id), [investors])
  const getBalanceById            = useCallback((id: string) => balances.find(b => b.id === id), [balances])
  const getTransactionsByInvestor = useCallback((id: string) =>
    transactions.filter(t => t.investor_id === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [transactions])

  return (
    <AppContext.Provider value={{
      investors, transactions, balances, recentTransactions, loading,
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
