import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Download } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatCurrency, cn } from '../lib/utils'
import { TRANSACTION_LABELS } from '../lib/types'
import type { TransactionType } from '../lib/types'

const PIE_COLORS = ['#0071E3', '#34C759', '#FF9500', '#AF52DE', '#FF3B30', '#5AC8FA']

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name: string }> }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-apple px-3 py-2 shadow-apple-md text-[13px]">
      <p className="font-semibold text-apple-label">{payload[0].name}</p>
      <p className="text-apple-blue font-bold">LKR {formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function Reports() {
  const { balances, transactions, investors } = useApp()
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo,   setDateTo]   = useState('')

  const filtered = transactions.filter(tx => {
    if (dateFrom && tx.date < dateFrom) return false
    if (dateTo   && tx.date > dateTo)   return false
    return true
  })

  const totalIn   = filtered.filter(t => t.direction === 'in').reduce((s, t) => s + t.amount, 0)
  const totalOut  = filtered.filter(t => t.direction === 'out').reduce((s, t) => s + t.amount, 0)
  const profitOut = filtered.filter(t => t.type === 'profit_return').reduce((s, t) => s + t.amount, 0)
  const capitalR  = filtered.filter(t => t.type === 'capital_return').reduce((s, t) => s + t.amount, 0)

  // Bar chart: invested vs remaining per investor
  const barData = balances
    .filter(b => b.status === 'active' && b.total_invested > 0)
    .map(b => ({ name: b.name.split(' ')[0], invested: b.total_invested, remaining: b.remaining_balance, paid: b.total_paid }))

  // Pie chart: by transaction type
  const typeMap: Partial<Record<TransactionType, number>> = {}
  filtered.filter(t => t.direction === 'out').forEach(t => {
    typeMap[t.type] = (typeMap[t.type] ?? 0) + t.amount
  })
  const pieData = Object.entries(typeMap).map(([type, value]) => ({
    name: TRANSACTION_LABELS[type as TransactionType],
    value,
  }))

  // Per-investor table
  const activeBalances = balances.filter(b => b.status === 'active')

  function exportCSV() {
    const rows = [
      ['Date', 'Investor', 'Type', 'Direction', 'Amount', 'Purpose', 'Notes'],
      ...filtered.map(tx => [
        tx.date,
        investors.find(i => i.id === tx.investor_id)?.name ?? '',
        TRANSACTION_LABELS[tx.type],
        tx.direction,
        tx.amount.toString(),
        tx.purpose ?? '',
        tx.notes ?? '',
      ])
    ]
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'matrices-report.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[32px] font-bold text-apple-label tracking-tight">Reports</h1>
          <p className="text-[15px] text-apple-label-2 mt-1">Financial overview &amp; analysis</p>
        </div>
        <button onClick={exportCSV} className="apple-btn-secondary flex items-center gap-2">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Date filter */}
      <div className="apple-card p-4 mb-6 flex flex-wrap gap-4 items-center">
        <span className="text-[14px] font-medium text-apple-label-2">Filter by date:</span>
        <div className="flex items-center gap-2">
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="apple-input w-40 text-[14px] py-2" />
          <span className="text-apple-label-3">to</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="apple-input w-40 text-[14px] py-2" />
        </div>
        {(dateFrom || dateTo) && (
          <button onClick={() => { setDateFrom(''); setDateTo('') }} className="apple-btn-ghost text-[13px] py-1">Clear</button>
        )}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Capital In',     value: totalIn,   color: 'text-apple-green' },
          { label: 'Total Paid Out', value: totalOut,  color: 'text-apple-orange' },
          { label: 'Profit Paid',    value: profitOut, color: 'text-apple-blue' },
          { label: 'Capital Returned', value: capitalR, color: 'text-apple-purple' },
        ].map(s => (
          <div key={s.label} className="apple-card p-5">
            <div className="text-[12px] font-medium text-apple-label-3 mb-2">{s.label}</div>
            <div className={cn('text-[22px] font-bold leading-none', s.color)}>
              LKR {new Intl.NumberFormat('en-LK', { notation: 'compact', maximumFractionDigits: 1 }).format(s.value)}
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Bar chart */}
        <div className="apple-card p-5 lg:col-span-2">
          <h3 className="text-[15px] font-semibold text-apple-label mb-4">Invested vs Remaining by Investor</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={14} barCategoryGap="30%">
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6E6E73' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#86868B' }} axisLine={false} tickLine={false}
                tickFormatter={v => new Intl.NumberFormat('en-LK', { notation: 'compact', maximumFractionDigits: 1 }).format(v)} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="invested"  fill="#E8F1FB" radius={[4, 4, 0, 0]} name="Invested" />
              <Bar dataKey="remaining" fill="#0071E3" radius={[4, 4, 0, 0]} name="Remaining" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-[12px] text-apple-label-2">
              <div className="w-3 h-3 rounded-sm bg-apple-blue-light" /> Invested
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-apple-label-2">
              <div className="w-3 h-3 rounded-sm bg-apple-blue" /> Remaining
            </div>
          </div>
        </div>

        {/* Pie chart */}
        <div className="apple-card p-5">
          <h3 className="text-[15px] font-semibold text-apple-label mb-4">Payments by Type</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={3}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-apple-label-2">{d.name}</span>
                    </div>
                    <span className="font-semibold text-apple-label">
                      {new Intl.NumberFormat('en-LK', { notation: 'compact', maximumFractionDigits: 1 }).format(d.value)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-apple-label-3 text-[13px]">No data</div>
          )}
        </div>
      </div>

      {/* Investor table */}
      <div className="apple-card overflow-hidden">
        <div className="px-6 pt-5 pb-3">
          <h3 className="text-[17px] font-semibold text-apple-label">Client Balances</h3>
        </div>
        {/* Header */}
        <div className="grid grid-cols-5 gap-4 px-6 py-2.5 bg-apple-surface-2 text-[11px] font-semibold text-apple-label-3 uppercase tracking-wide">
          <div>Investor</div>
          <div className="text-right">Invested</div>
          <div className="text-right">Profit Paid</div>
          <div className="text-right">Capital Returned</div>
          <div className="text-right">Remaining</div>
        </div>
        <div className="divide-y divide-apple-separator">
          {activeBalances.map((b, idx) => (
            <div key={b.id} className={cn('grid grid-cols-5 gap-4 px-6 py-4 items-center', idx % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]')}>
              <div>
                <div className="text-[14px] font-semibold text-apple-label">{b.name}</div>
                {b.return_rate && <div className="text-[12px] text-apple-label-3">{b.return_rate}% rate</div>}
              </div>
              <div className="text-right text-[14px] font-medium text-apple-label">{formatCurrency(b.total_invested)}</div>
              <div className="text-right text-[14px] font-medium text-apple-blue">{formatCurrency(b.total_profit_paid)}</div>
              <div className="text-right text-[14px] font-medium text-apple-orange">{formatCurrency(b.total_capital_returned)}</div>
              <div className="text-right text-[14px] font-bold text-apple-green">{formatCurrency(b.remaining_balance)}</div>
            </div>
          ))}
        </div>
        {/* Totals row */}
        <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-apple-surface-2 border-t border-apple-sep-dark">
          <div className="text-[13px] font-bold text-apple-label">Total</div>
          <div className="text-right text-[13px] font-bold text-apple-label">
            {formatCurrency(activeBalances.reduce((s, b) => s + b.total_invested, 0))}
          </div>
          <div className="text-right text-[13px] font-bold text-apple-blue">
            {formatCurrency(activeBalances.reduce((s, b) => s + b.total_profit_paid, 0))}
          </div>
          <div className="text-right text-[13px] font-bold text-apple-orange">
            {formatCurrency(activeBalances.reduce((s, b) => s + b.total_capital_returned, 0))}
          </div>
          <div className="text-right text-[13px] font-bold text-apple-green">
            {formatCurrency(activeBalances.reduce((s, b) => s + b.remaining_balance, 0))}
          </div>
        </div>
      </div>
    </div>
  )
}
