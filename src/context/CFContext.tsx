import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import type {
  CFClient, CFJob, CFTransaction, CFDirection,
  CFClientStats, CFJobStats, CFTransactionWithClient,
} from '../lib/cf-types'

interface CFContextValue {
  clients: CFClient[]
  jobs: CFJob[]
  transactions: CFTransaction[]
  loading: boolean

  totalBalance: number
  totalIn: number
  totalOut: number
  recentTransactions: CFTransactionWithClient[]

  addClient: (name: string) => Promise<void>
  deleteClient: (id: string) => Promise<void>
  addJob: (clientId: string, title: string, totalAmount: number) => Promise<void>
  deleteJob: (id: string) => Promise<void>
  addTransaction: (tx: {
    direction: CFDirection
    amount: number
    note: string
    client_id?: string | null
    job_id?: string | null
  }) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>

  getClientById: (id: string) => CFClient | undefined
  getJobsByClient: (clientId: string) => CFJob[]
  getClientStats: (clientId: string) => CFClientStats
  getJobStats: (jobId: string) => CFJobStats
}

const CFContext = createContext<CFContextValue | null>(null)

export function CFProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [clients,      setClients]      = useState<CFClient[]>([])
  const [jobs,         setJobs]         = useState<CFJob[]>([])
  const [transactions, setTransactions] = useState<CFTransaction[]>([])
  const [loading,      setLoading]      = useState(true)

  // ── Load all data for the signed-in user (RLS scopes it too) ──
  useEffect(() => {
    if (!user) { setLoading(false); return }
    let active = true
    async function load() {
      setLoading(true)
      const [cRes, jRes, tRes] = await Promise.all([
        supabase.from('cf_clients').select('*').order('created_at', { ascending: true }),
        supabase.from('cf_jobs').select('*').order('created_at', { ascending: false }),
        supabase.from('cf_transactions').select('*').order('created_at', { ascending: false }),
      ])
      if (!active) return
      if (cRes.data) setClients(cRes.data as CFClient[])
      if (jRes.data) setJobs(jRes.data as CFJob[])
      if (tRes.data) setTransactions(tRes.data as CFTransaction[])
      setLoading(false)
    }
    load()
    return () => { active = false }
  }, [user])

  // ── Derived ─────────────────────────────────────────────────
  const totalIn  = useMemo(() => transactions.filter(t => t.direction === 'in').reduce((s, t) => s + Number(t.amount), 0), [transactions])
  const totalOut = useMemo(() => transactions.filter(t => t.direction === 'out').reduce((s, t) => s + Number(t.amount), 0), [transactions])
  const totalBalance = totalIn - totalOut

  const recentTransactions: CFTransactionWithClient[] = useMemo(() =>
    [...transactions]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(t => ({
        ...t,
        client_name: t.client_id ? (clients.find(c => c.id === t.client_id)?.name ?? null) : null,
        job_title:   t.job_id ? (jobs.find(j => j.id === t.job_id)?.title ?? null) : null,
      })),
    [transactions, clients, jobs])

  // ── Clients ─────────────────────────────────────────────────
  const addClient = useCallback(async (name: string) => {
    if (!user) return
    const { data, error } = await supabase
      .from('cf_clients').insert({ name, user_id: user.id }).select().single()
    if (!error && data) setClients(prev => [...prev, data as CFClient])
  }, [user])

  const deleteClient = useCallback(async (id: string) => {
    const { error } = await supabase.from('cf_clients').delete().eq('id', id)
    if (!error) {
      setClients(prev => prev.filter(c => c.id !== id))
      setJobs(prev => prev.filter(j => j.client_id !== id))
      setTransactions(prev => prev.filter(t => t.client_id !== id))
    }
  }, [])

  // ── Jobs ────────────────────────────────────────────────────
  const addJob = useCallback(async (clientId: string, title: string, totalAmount: number) => {
    if (!user) return
    const { data, error } = await supabase
      .from('cf_jobs')
      .insert({ client_id: clientId, title, total_amount: totalAmount, user_id: user.id })
      .select().single()
    if (!error && data) setJobs(prev => [data as CFJob, ...prev])
  }, [user])

  const deleteJob = useCallback(async (id: string) => {
    const { error } = await supabase.from('cf_jobs').delete().eq('id', id)
    if (!error) {
      setJobs(prev => prev.filter(j => j.id !== id))
      setTransactions(prev => prev.map(t => t.job_id === id ? { ...t, job_id: null } : t))
    }
  }, [])

  // ── Transactions ────────────────────────────────────────────
  const addTransaction = useCallback(async (tx: {
    direction: CFDirection
    amount: number
    note: string
    client_id?: string | null
    job_id?: string | null
  }) => {
    if (!user) return
    const row = {
      user_id: user.id,
      direction: tx.direction,
      amount: tx.amount,
      note: tx.note ?? '',
      client_id: tx.client_id ?? null,
      job_id: tx.job_id ?? null,
    }
    const { data, error } = await supabase.from('cf_transactions').insert(row).select().single()
    if (!error && data) setTransactions(prev => [data as CFTransaction, ...prev])
  }, [user])

  const deleteTransaction = useCallback(async (id: string) => {
    const { error } = await supabase.from('cf_transactions').delete().eq('id', id)
    if (!error) setTransactions(prev => prev.filter(t => t.id !== id))
  }, [])

  // ── Lookups ─────────────────────────────────────────────────
  const getClientById  = useCallback((id: string) => clients.find(c => c.id === id), [clients])
  const getJobsByClient = useCallback((clientId: string) => jobs.filter(j => j.client_id === clientId), [jobs])

  const getClientStats = useCallback((clientId: string): CFClientStats => {
    const billed = jobs.filter(j => j.client_id === clientId).reduce((s, j) => s + Number(j.total_amount), 0)
    const paid = transactions
      .filter(t => t.client_id === clientId && t.direction === 'in')
      .reduce((s, t) => s + Number(t.amount), 0)
    return { billed, paid, outstanding: Math.max(billed - paid, 0) }
  }, [jobs, transactions])

  const getJobStats = useCallback((jobId: string): CFJobStats => {
    const job = jobs.find(j => j.id === jobId)
    const total = job ? Number(job.total_amount) : 0
    const paid = transactions
      .filter(t => t.job_id === jobId && t.direction === 'in')
      .reduce((s, t) => s + Number(t.amount), 0)
    const outstanding = Math.max(total - paid, 0)
    return { paid, outstanding, isPaid: total > 0 && outstanding <= 0 }
  }, [jobs, transactions])

  return (
    <CFContext.Provider value={{
      clients, jobs, transactions, loading,
      totalBalance, totalIn, totalOut, recentTransactions,
      addClient, deleteClient, addJob, deleteJob, addTransaction, deleteTransaction,
      getClientById, getJobsByClient, getClientStats, getJobStats,
    }}>
      {children}
    </CFContext.Provider>
  )
}

export function useCF() {
  const ctx = useContext(CFContext)
  if (!ctx) throw new Error('useCF must be used within CFProvider')
  return ctx
}
