import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Plus, Edit2, ArrowUpRight, ArrowDownLeft, Pencil } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import TransactionModal from '../components/TransactionModal'
import InvestorModal from '../components/InvestorModal'
import EditTransactionModal from '../components/EditTransactionModal'
import { formatCurrency, formatDate, getAvatarColor, getInitials, cn } from '../lib/utils'
import { TRANSACTION_LABELS } from '../lib/types'
import type { Transaction } from '../lib/types'

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getInvestorById, getBalanceById, getTransactionsByInvestor, updateTransaction, deleteTransaction } = useApp()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const [txOpen, setTxOpen]         = useState(false)
  const [editOpen, setEditOpen]     = useState(false)
  const [editTx, setEditTx]         = useState<Transaction | null>(null)

  const investor = getInvestorById(id ?? '')
  const balance  = getBalanceById(id ?? '')
  const txs      = getTransactionsByInvestor(id ?? '')

  if (!investor || !balance) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full text-apple-label-2">
        <p className="text-[18px] font-semibold">Investor not found</p>
        <button onClick={() => navigate('/clients')} className="apple-btn-ghost mt-4">← Back to Clients</button>
      </div>
    )
  }

  const chronological = [...txs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  let running = 0
  const withRunning = chronological.map(tx => {
    running += tx.direction === 'in' ? tx.amount : -tx.amount
    return { ...tx, running }
  })
  const displayTxs = [...withRunning].reverse()

  const expectedProfit = balance.return_rate && balance.total_invested
    ? (balance.total_invested * balance.return_rate) / 100
    : null

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <button onClick={() => navigate('/clients')} className="flex items-center gap-1 text-apple-blue text-[14px] font-medium mb-4 md:mb-6 hover:opacity-70">
        <ChevronLeft size={17} /> Clients
      </button>

      {/* Profile header */}
      <div className="apple-card p-4 md:p-6 mb-4 md:mb-6">
        <div className="flex items-start gap-4">
          <div className={cn('w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white text-[18px] md:text-[20px] font-bold shrink-0', getAvatarColor(investor.name))}>
            {getInitials(investor.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-[20px] md:text-[24px] font-bold text-apple-label tracking-tight">{investor.name}</h1>
                  <span className={cn('apple-badge', investor.status === 'active' ? 'bg-apple-green-light text-apple-green' : 'bg-apple-surface-3 text-apple-label-3')}>
                    {investor.status}
                  </span>
                  {investor.return_rate && (
                    <span className="apple-badge bg-apple-blue-light text-apple-blue">{investor.return_rate}% Return Rate</span>
                  )}
                </div>
                {investor.phone && <p className="text-[14px] text-apple-label-2 mt-1">{investor.phone}</p>}
                {investor.notes && <p className="text-[13px] text-apple-label-3 mt-1">{investor.notes}</p>}
              </div>
              {/* Buttons — top-right on all sizes */}
              <div className="flex gap-2 shrink-0">
                {isAdmin && (
                  <button onClick={() => setEditOpen(true)} className="apple-btn-secondary flex items-center gap-1.5 text-[13px] md:text-[14px]">
                    <Edit2 size={13} />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                )}
                <button onClick={() => setTxOpen(true)} className="apple-btn-primary flex items-center gap-1.5 text-[13px] md:text-[14px]">
                  <Plus size={13} strokeWidth={2.5} />
                  <span className="hidden sm:inline">Transaction</span>
                  <span className="sm:hidden">Add</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="apple-card p-4">
          <div className="text-[12px] font-medium text-apple-label-3 mb-1">Total Invested</div>
          <div className="text-[20px] font-bold text-apple-label">LKR {formatCurrency(balance.total_invested)}</div>
        </div>
        <div className="apple-card p-4">
          <div className="text-[12px] font-medium text-apple-label-3 mb-1">Remaining</div>
          <div className="text-[20px] font-bold text-apple-blue">LKR {formatCurrency(balance.remaining_balance)}</div>
        </div>
        <div className="apple-card p-4">
          <div className="text-[12px] font-medium text-apple-label-3 mb-1">Total Paid</div>
          <div className="text-[20px] font-bold text-apple-orange">LKR {formatCurrency(balance.total_paid)}</div>
        </div>
        <div className="apple-card p-4">
          <div className="text-[12px] font-medium text-apple-label-3 mb-1">{expectedProfit ? 'Expected Profit' : 'Profit Paid'}</div>
          <div className="text-[20px] font-bold text-apple-green">LKR {formatCurrency(expectedProfit ?? balance.total_profit_paid)}</div>
        </div>
      </div>

      {/* Ledger */}
      <div className="apple-card overflow-hidden">
        <div className="flex items-center justify-between px-4 md:px-6 pt-5 pb-3">
          <h2 className="text-[17px] font-semibold text-apple-label">Transaction Ledger</h2>
          <button onClick={() => setTxOpen(true)} className="apple-btn-ghost text-[14px]">
            <Plus size={14} className="inline mr-1" />Add
          </button>
        </div>

        {/* Table header — desktop only */}
        <div className={cn('hidden sm:grid gap-4 px-6 py-2 bg-apple-surface-2', isAdmin ? 'grid-cols-[auto_1fr_auto_auto_auto]' : 'grid-cols-[auto_1fr_auto_auto]')}>
          <div className="text-[11px] font-semibold text-apple-label-3 uppercase tracking-wide w-24">Date</div>
          <div className="text-[11px] font-semibold text-apple-label-3 uppercase tracking-wide">Description</div>
          <div className="text-[11px] font-semibold text-apple-label-3 uppercase tracking-wide text-right w-32">Amount</div>
          <div className="text-[11px] font-semibold text-apple-label-3 uppercase tracking-wide text-right w-36">Balance</div>
          {isAdmin && <div className="w-8" />}
        </div>

        {displayTxs.length === 0 ? (
          <div className="py-16 text-center text-apple-label-3 text-[14px]">No transactions yet</div>
        ) : (
          <div className="divide-y divide-apple-separator">
            {displayTxs.map((tx: Transaction & { running: number }, idx) => {
              const isIn = tx.direction === 'in'
              return (
                <div key={tx.id}>
                  {/* ── Desktop row ── */}
                  <div className={cn(
                    'hidden sm:grid gap-4 items-center px-6 py-4 group',
                    isAdmin ? 'grid-cols-[auto_1fr_auto_auto_auto]' : 'grid-cols-[auto_1fr_auto_auto]',
                    idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]',
                    isAdmin && 'hover:bg-blue-50/40'
                  )}>
                    <div className="w-24">
                      <div className="text-[13px] font-medium text-apple-label">{formatDate(tx.date)}</div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-6 h-6 rounded-full flex items-center justify-center shrink-0', isIn ? 'bg-apple-green-light' : 'bg-apple-orange-light')}>
                          {isIn
                            ? <ArrowUpRight size={12} className="text-apple-green" strokeWidth={2.5} />
                            : <ArrowDownLeft size={12} className="text-apple-orange" strokeWidth={2.5} />
                          }
                        </div>
                        <span className="text-[14px] font-medium text-apple-label truncate">{TRANSACTION_LABELS[tx.type]}</span>
                      </div>
                      {(tx.purpose || tx.notes) && (
                        <div className="text-[12px] text-apple-label-3 ml-8 mt-0.5 truncate">
                          {[tx.purpose, tx.notes].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </div>
                    <div className="w-32 text-right">
                      <span className={cn('text-[14px] font-bold', isIn ? 'text-apple-green' : 'text-apple-red')}>
                        {isIn ? '+' : '-'} {formatCurrency(tx.amount)}
                      </span>
                    </div>
                    <div className="w-36 text-right">
                      <span className="text-[14px] font-semibold text-apple-label">{formatCurrency(tx.running)}</span>
                    </div>
                    {isAdmin && (
                      <div className="w-8 flex justify-center">
                        <button
                          onClick={() => setEditTx(tx)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-apple-label-3 hover:bg-apple-surface-3 hover:text-apple-blue opacity-0 group-hover:opacity-100 transition-all"
                          title="Edit transaction"
                        >
                          <Pencil size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* ── Mobile card ── */}
                  <div className={cn(
                    'sm:hidden px-4 py-3.5',
                    idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'
                  )}>
                    <div className="flex items-start gap-3">
                      {/* Direction icon */}
                      <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5', isIn ? 'bg-apple-green-light' : 'bg-apple-orange-light')}>
                        {isIn
                          ? <ArrowUpRight size={16} className="text-apple-green" strokeWidth={2.5} />
                          : <ArrowDownLeft size={16} className="text-apple-orange" strokeWidth={2.5} />
                        }
                      </div>
                      {/* Middle content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[14px] font-semibold text-apple-label truncate">{TRANSACTION_LABELS[tx.type]}</span>
                          <span className={cn('text-[14px] font-bold shrink-0', isIn ? 'text-apple-green' : 'text-apple-red')}>
                            {isIn ? '+' : '-'}{formatCurrency(tx.amount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 mt-0.5">
                          <span className="text-[12px] text-apple-label-3 truncate">
                            {formatDate(tx.date)}{(tx.purpose || tx.notes) ? ` · ${[tx.purpose, tx.notes].filter(Boolean).join(' · ')}` : ''}
                          </span>
                          <span className="text-[12px] text-apple-label-2 font-medium shrink-0">Bal: {formatCurrency(tx.running)}</span>
                        </div>
                      </div>
                      {/* Edit button — always visible on mobile */}
                      {isAdmin && (
                        <button
                          onClick={() => setEditTx(tx)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-apple-label-3 hover:bg-apple-surface-3 hover:text-apple-blue transition-colors shrink-0"
                        >
                          <Pencil size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Totals footer */}
        <div className="bg-apple-surface-2 border-t border-apple-sep-dark px-4 md:px-6 py-4">
          {/* Desktop totals */}
          <div className={cn('hidden sm:grid gap-4', isAdmin ? 'grid-cols-[auto_1fr_auto_auto_auto]' : 'grid-cols-[auto_1fr_auto_auto]')}>
            <div className="w-24" />
            <div className="text-[13px] font-semibold text-apple-label-2">Totals</div>
            <div className="w-32 text-right">
              <div className="text-[13px] text-apple-green font-bold">+{formatCurrency(balance.total_invested)}</div>
              <div className="text-[13px] text-apple-red font-bold">-{formatCurrency(balance.total_paid)}</div>
            </div>
            <div className="w-36 text-right">
              <div className="text-[14px] font-bold text-apple-blue">{formatCurrency(balance.remaining_balance)}</div>
            </div>
            {isAdmin && <div className="w-8" />}
          </div>
          {/* Mobile totals */}
          <div className="sm:hidden flex items-center justify-between">
            <div>
              <div className="text-[11px] font-medium text-apple-label-3 uppercase tracking-wide mb-1">Totals</div>
              <div className="text-[12px] text-apple-green font-bold">+{formatCurrency(balance.total_invested)} in</div>
              <div className="text-[12px] text-apple-red font-bold">-{formatCurrency(balance.total_paid)} out</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-medium text-apple-label-3 uppercase tracking-wide mb-1">Balance</div>
              <div className="text-[18px] font-bold text-apple-blue">{formatCurrency(balance.remaining_balance)}</div>
            </div>
          </div>
        </div>
      </div>

      <TransactionModal open={txOpen} onClose={() => setTxOpen(false)} defaultInvestorId={id} />
      <InvestorModal open={editOpen} onClose={() => setEditOpen(false)} investor={investor} />
      <EditTransactionModal
        open={!!editTx}
        transaction={editTx}
        onClose={() => setEditTx(null)}
        onSave={updateTransaction}
        onDelete={deleteTransaction}
      />
    </div>
  )
}
