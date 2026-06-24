import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, ChevronRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import InvestorModal from '../components/InvestorModal'
import { formatCurrency, getAvatarColor, getInitials, cn } from '../lib/utils'

export default function Clients() {
  const { balances } = useApp()
  const navigate = useNavigate()
  const [search, setSearch]           = useState('')
  const [filter, setFilter]           = useState<'all' | 'active' | 'closed'>('all')
  const [modalOpen, setModalOpen]     = useState(false)

  const filtered = balances.filter(b => {
    if (b.status === 'placeholder') return false
    if (filter === 'active' && b.status !== 'active') return false
    if (filter === 'closed' && b.status !== 'closed') return false
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-6 md:mb-8">
        <div>
          <h1 className="text-[26px] md:text-[32px] font-bold text-apple-label tracking-tight">Clients</h1>
          <p className="text-[15px] text-apple-label-2 mt-1">{balances.filter(b => b.status === 'active').length} active investors</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="apple-btn-primary flex items-center gap-2 shrink-0">
          <Plus size={16} strokeWidth={2.5} />
          <span className="hidden sm:inline">New Client</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-apple-label-3" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients…"
            className="apple-input pl-10"
          />
        </div>
        <div className="bg-apple-surface-2 rounded-apple p-1 flex gap-0.5">
          {(['all', 'active', 'closed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 rounded-[8px] text-[13px] font-medium capitalize transition-all',
                filter === f ? 'bg-white text-apple-label shadow-apple' : 'text-apple-label-2 hover:text-apple-label'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Client list */}
      <div className="apple-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-apple-label-3">
            <div className="text-[40px] mb-3">👤</div>
            <p className="text-[15px] font-medium">No clients found</p>
            <p className="text-[13px] mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="divide-y divide-apple-separator">
            {filtered.map((b) => {
              const rateLabel = b.return_rate ? `${b.return_rate}% rate` : 'No rate set'
              const statusColor = b.status === 'active' ? 'text-apple-green' : 'text-apple-label-3'

              return (
                <button
                  key={b.id}
                  onClick={() => navigate(`/clients/${b.id}`)}
                  className="w-full flex items-center gap-4 px-6 py-5 hover:bg-apple-surface-2 text-left transition-colors group"
                >
                  {/* Avatar */}
                  <div className={cn('w-12 h-12 rounded-full flex items-center justify-center text-white text-[14px] font-bold shrink-0', getAvatarColor(b.name))}>
                    {getInitials(b.name)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[16px] font-semibold text-apple-label">{b.name}</span>
                      <span className={cn('text-[12px] font-medium capitalize', statusColor)}>
                        {b.status === 'active' ? '● Active' : '○ Closed'}
                      </span>
                    </div>
                    <div className="text-[13px] text-apple-label-2 mt-0.5">{rateLabel}</div>
                  </div>

                  {/* Balances */}
                  <div className="hidden sm:flex gap-8 mr-4">
                    <div className="text-right">
                      <div className="text-[12px] text-apple-label-3">Invested</div>
                      <div className="text-[14px] font-semibold text-apple-label">LKR {formatCurrency(b.total_invested)}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[12px] text-apple-label-3">Remaining</div>
                      <div className="text-[14px] font-bold text-apple-blue">LKR {formatCurrency(b.remaining_balance)}</div>
                    </div>
                  </div>

                  <ChevronRight size={16} className="text-apple-label-3 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              )
            })}
          </div>
        )}
      </div>

      <InvestorModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
