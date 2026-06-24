import { useState } from 'react'
import { format } from 'date-fns'
import { Plus, TrendingUp, TrendingDown, Wallet, Users, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'
import StatCard from '../components/StatCard'
import TransactionModal from '../components/TransactionModal'
import { formatCurrency, formatDate, getAvatarColor, getInitials, cn } from '../lib/utils'
import { TRANSACTION_LABELS } from '../lib/types'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { balances, recentTransactions } = useApp()
  const [txModalOpen, setTxModalOpen]   = useState(false)
  const navigate = useNavigate()

  const activeBalances = balances.filter(b => b.status === 'active')
  const totalAUM       = activeBalances.reduce((s, b) => s + b.remaining_balance, 0)
  const totalInvested  = activeBalances.reduce((s, b) => s + b.total_invested, 0)
  const totalPaid      = activeBalances.reduce((s, b) => s + b.total_paid, 0)
  const activeCount    = activeBalances.length

  const today = format(new Date(), 'EEEE, d MMMM yyyy')

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-6 md:mb-8">
        <div>
          <p className="text-[13px] font-medium text-apple-label-3 uppercase tracking-wide">{today}</p>
          <h1 className="text-[26px] md:text-[32px] font-bold text-apple-label tracking-tight leading-tight mt-1">Dashboard</h1>
        </div>
        <button onClick={() => setTxModalOpen(true)} className="apple-btn-primary flex items-center gap-2 shrink-0">
          <Plus size={16} strokeWidth={2.5} />
          <span className="hidden sm:inline">New Transaction</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <StatCard
          label="Total AUM"
          value={`LKR ${new Intl.NumberFormat('en-LK', { notation: 'compact', maximumFractionDigits: 2 }).format(totalAUM)}`}
          sub="Remaining balance"
          accent="blue"
          icon={<Wallet size={16} />}
        />
        <StatCard
          label="Active Investors"
          value={String(activeCount)}
          sub="Active accounts"
          accent="purple"
          icon={<Users size={16} />}
        />
        <StatCard
          label="Total Invested"
          value={`LKR ${new Intl.NumberFormat('en-LK', { notation: 'compact', maximumFractionDigits: 2 }).format(totalInvested)}`}
          sub="Capital received"
          accent="green"
          icon={<TrendingUp size={16} />}
        />
        <StatCard
          label="Total Paid Out"
          value={`LKR ${new Intl.NumberFormat('en-LK', { notation: 'compact', maximumFractionDigits: 2 }).format(totalPaid)}`}
          sub="Returns + Capital"
          accent="orange"
          icon={<TrendingDown size={16} />}
        />
      </div>

      {/* Investor quick-view */}
      <div className="apple-card mb-8 overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-[17px] font-semibold text-apple-label">Investor Overview</h2>
          <button onClick={() => navigate('/clients')} className="apple-btn-ghost text-[14px]">View All</button>
        </div>
        <div className="divide-y divide-apple-separator">
          {activeBalances.map((b) => {
            const pct = b.total_invested > 0 ? (b.total_paid / b.total_invested) * 100 : 0
            return (
              <button
                key={b.id}
                onClick={() => navigate(`/clients/${b.id}`)}
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-apple-surface-2 text-left transition-colors"
              >
                {/* Avatar */}
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0', getAvatarColor(b.name))}>
                  {getInitials(b.name)}
                </div>
                {/* Name + bar */}
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold text-apple-label">{b.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-apple-surface-3 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-apple-blue rounded-full transition-all"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <span className="text-[12px] text-apple-label-3 shrink-0">{pct.toFixed(0)}% returned</span>
                  </div>
                </div>
                {/* Balance */}
                <div className="text-right shrink-0">
                  <div className="text-[15px] font-bold text-apple-label">LKR {formatCurrency(b.remaining_balance)}</div>
                  <div className="text-[12px] text-apple-label-3">remaining</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="apple-card overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-[17px] font-semibold text-apple-label">Recent Transactions</h2>
          <button onClick={() => setTxModalOpen(true)} className="apple-btn-ghost text-[14px]">
            <Plus size={14} className="inline mr-1" />Add
          </button>
        </div>
        <div className="divide-y divide-apple-separator">
          {recentTransactions.slice(0, 15).map((tx) => {
            const isIn = tx.direction === 'in'
            return (
              <div key={tx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-apple-surface-2 transition-colors">
                {/* Icon pill */}
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                  isIn ? 'bg-apple-green-light' : 'bg-apple-orange-light'
                )}>
                  {isIn
                    ? <ArrowUpRight size={18} className="text-apple-green" strokeWidth={2.5} />
                    : <ArrowDownLeft size={18} className="text-apple-orange" strokeWidth={2.5} />
                  }
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold text-apple-label truncate">{tx.investor_name}</div>
                  <div className="text-[13px] text-apple-label-2 truncate">
                    {tx.purpose
                      ? `${tx.purpose} · ${TRANSACTION_LABELS[tx.type]}`
                      : TRANSACTION_LABELS[tx.type]}
                  </div>
                </div>

                {/* Amount + date */}
                <div className="text-right shrink-0">
                  <div className={cn('text-[15px] font-bold', isIn ? 'text-apple-green' : 'text-apple-label')}>
                    {isIn ? '+' : '-'} LKR {formatCurrency(tx.amount)}
                  </div>
                  <div className="text-[12px] text-apple-label-3">{formatDate(tx.date)}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <TransactionModal open={txModalOpen} onClose={() => setTxModalOpen(false)} />
    </div>
  )
}
