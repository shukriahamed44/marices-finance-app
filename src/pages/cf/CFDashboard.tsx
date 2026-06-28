import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, Wallet, TrendingUp, TrendingDown, Trash2, Receipt } from 'lucide-react'
import { useCF } from '../../context/CFContext'
import { formatCurrency, formatDate } from '../../lib/utils'
import CFAddMoneyModal from '../../components/cf/CFAddMoneyModal'
import { cfTile, cfHero, cfLabel, CF_GREEN, CF_RED } from '../../components/cf/cfStyles'
import type { CFDirection } from '../../lib/cf-types'

export default function CFDashboard() {
  const { totalBalance, totalIn, totalOut, recentTransactions, clients, deleteTransaction, loading } = useCF()
  const [modal, setModal] = useState<CFDirection | null>(null)

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[26px] md:text-[32px] font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-[13px] text-white/40 mt-0.5">Your money across every client, in one place.</p>
      </div>

      {/* Balance hero */}
      <div className="relative overflow-hidden p-6 md:p-8 mb-4" style={cfHero}>
        <div className="absolute top-[-20%] right-[-5%] w-[50%] h-[80%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,200,160,0.25) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="relative">
          <div className="flex items-center gap-2">
            <Wallet size={15} className="text-white/50" />
            <span className={cfLabel}>Total balance held</span>
          </div>
          <div className="text-[40px] md:text-[56px] font-black text-white tracking-[-2px] leading-none mt-3">
            <span className="text-white/40 text-[24px] md:text-[32px] font-bold mr-2">LKR</span>
            {formatCurrency(totalBalance)}
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={() => setModal('in')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-[14px] font-semibold text-white transition-all duration-200 active:scale-[0.97]"
              style={{ background: `linear-gradient(135deg, ${CF_GREEN}, ${CF_GREEN}cc)`, boxShadow: `0 8px 24px ${CF_GREEN}44, inset 0 1px 0 rgba(255,255,255,0.2)`, border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <ArrowDownLeft size={16} strokeWidth={2.5} /> Money In
            </button>
            <button
              onClick={() => setModal('out')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl text-[14px] font-semibold text-white transition-all duration-200 active:scale-[0.97]"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)' }}
            >
              <ArrowUpRight size={16} strokeWidth={2.5} /> Money Out
            </button>
          </div>
        </div>
      </div>

      {/* In / Out / Clients stat row */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-4">
        <div className="p-4 md:p-5" style={cfTile}>
          <div className="flex items-center justify-between">
            <span className={cfLabel}>Total In</span>
            <TrendingUp size={16} style={{ color: CF_GREEN }} />
          </div>
          <div className="text-[18px] md:text-[26px] font-bold text-white mt-2 leading-none truncate">{formatCurrency(totalIn)}</div>
          <div className="text-white/35 text-[11px] mt-1">LKR received</div>
        </div>
        <div className="p-4 md:p-5" style={cfTile}>
          <div className="flex items-center justify-between">
            <span className={cfLabel}>Total Out</span>
            <TrendingDown size={16} style={{ color: CF_RED }} />
          </div>
          <div className="text-[18px] md:text-[26px] font-bold text-white mt-2 leading-none truncate">{formatCurrency(totalOut)}</div>
          <div className="text-white/35 text-[11px] mt-1">LKR spent</div>
        </div>
        <div className="p-4 md:p-5" style={cfTile}>
          <div className="flex items-center justify-between">
            <span className={cfLabel}>Clients</span>
          </div>
          <div className="text-[18px] md:text-[26px] font-bold text-white mt-2 leading-none">{clients.length}</div>
          <div className="text-white/35 text-[11px] mt-1">Active</div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="p-4 md:p-6" style={cfTile}>
        <div className="flex items-center gap-2 mb-4">
          <Receipt size={16} className="text-white/50" />
          <h2 className="text-[16px] font-semibold text-white">Recent transactions</h2>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-white/30 text-[14px]">No transactions yet.</div>
            <div className="text-white/20 text-[12px] mt-1">Use Money In / Money Out above to get started.</div>
          </div>
        ) : (
          <div className="space-y-1">
            {recentTransactions.slice(0, 30).map(t => {
              const isIn = t.direction === 'in'
              const accent = isIn ? CF_GREEN : CF_RED
              return (
                <div key={t.id} className="group flex items-center gap-3 px-3 py-3 rounded-[14px] hover:bg-white/[0.04] transition-colors">
                  <div className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0"
                    style={{ background: `${accent}1f`, border: `1px solid ${accent}33` }}>
                    {isIn ? <ArrowDownLeft size={16} style={{ color: accent }} /> : <ArrowUpRight size={16} style={{ color: accent }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-white truncate">
                      {t.note || (isIn ? 'Payment in' : 'Money out')}
                    </div>
                    <div className="text-[12px] text-white/35 truncate">
                      {[t.client_name, t.job_title].filter(Boolean).join(' · ') || (isIn ? 'Unassigned' : 'Expense')}
                      {' · '}{formatDate(t.created_at)}
                    </div>
                  </div>
                  <div className="text-[14px] font-semibold shrink-0" style={{ color: accent }}>
                    {isIn ? '+' : '−'}{formatCurrency(Number(t.amount))}
                  </div>
                  <button
                    onClick={() => { if (confirm('Delete this transaction?')) deleteTransaction(t.id) }}
                    className="w-7 h-7 flex items-center justify-center rounded-full text-white/20 hover:text-[#FF453A] hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {modal && <CFAddMoneyModal direction={modal} onClose={() => setModal(null)} />}
    </div>
  )
}
