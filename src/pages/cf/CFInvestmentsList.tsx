import { useState, useMemo } from 'react'
import { Plus, TrendingUp, X, Trash2, Pencil, ChevronDown, ArrowUpRight, ArrowDownRight, Minus, Target, Calendar } from 'lucide-react'
import { useCF } from '../../context/CFContext'
import { formatCurrency, formatDate } from '../../lib/utils'
import {
  cfTile, cfHero, cfInput, cfInputRing, cfLabel, cfPrimaryBtn,
  CF_GREEN, CF_RED, CF_BLUE, CF_AMBER,
} from '../../components/cf/cfStyles'
import type { CFInvestment, CFInvestmentSector, CFInvestmentStatus } from '../../lib/cf-types'

const SECTORS: CFInvestmentSector[] = [
  'Crypto', 'Equity', 'Commodity', 'Forex', 'Index', 'Private Deal', 'Real Estate', 'Other',
]

const STATUS_CONFIG: Record<CFInvestmentStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  active:  { label: 'Active',   color: CF_BLUE,  bg: 'rgba(10,132,255,0.15)',  icon: Target },
  gained:  { label: 'Gained',   color: CF_GREEN, bg: 'rgba(52,199,89,0.15)',   icon: ArrowUpRight },
  lost:    { label: 'Lost',     color: CF_RED,   bg: 'rgba(255,69,58,0.15)',   icon: ArrowDownRight },
  partial: { label: 'Partial',  color: CF_AMBER, bg: 'rgba(255,159,10,0.15)', icon: Minus },
}

const SECTOR_COLORS: Record<CFInvestmentSector, string> = {
  'Crypto':       'rgba(10,132,255,0.18)',
  'Equity':       'rgba(52,199,89,0.18)',
  'Commodity':    'rgba(255,159,10,0.18)',
  'Forex':        'rgba(94,92,230,0.18)',
  'Index':        'rgba(0,200,160,0.18)',
  'Private Deal': 'rgba(255,55,95,0.18)',
  'Real Estate':  'rgba(100,210,255,0.18)',
  'Other':        'rgba(255,255,255,0.08)',
}

type FilterTab = 'all' | CFInvestmentStatus

const FILTERS: { id: FilterTab; label: string }[] = [
  { id: 'all',     label: 'All'     },
  { id: 'active',  label: 'Active'  },
  { id: 'gained',  label: 'Gained'  },
  { id: 'partial', label: 'Partial' },
  { id: 'lost',    label: 'Lost'    },
]

const BLANK = (): Omit<CFInvestment, 'id' | 'user_id' | 'created_at'> => ({
  entity: '', brief: '', sector: 'Other',
  amount_invested: 0, expected_return: null, target_date: null,
  status: 'active', actual_return: null, notes: '',
  invested_at: new Date().toISOString().split('T')[0],
})

export default function CFInvestmentsList() {
  const { investments, addInvestment, updateInvestment, deleteInvestment, loading, loadError } = useCF()

  const [filter, setFilter]   = useState<FilterTab>('all')
  const [editing, setEditing] = useState<CFInvestment | 'new' | null>(null)
  const [form, setForm]       = useState(BLANK())
  const [error, setError]     = useState('')
  const [saving, setSaving]   = useState(false)

  function openNew() { setForm(BLANK()); setError(''); setEditing('new') }
  function openEdit(inv: CFInvestment) {
    setForm({
      entity: inv.entity, brief: inv.brief, sector: inv.sector,
      amount_invested: inv.amount_invested, expected_return: inv.expected_return,
      target_date: inv.target_date, status: inv.status,
      actual_return: inv.actual_return, notes: inv.notes,
      invested_at: inv.invested_at,
    })
    setError(''); setEditing(inv)
  }
  function close() { setEditing(null) }

  function patch<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.entity.trim()) return setError('Enter an entity name.')
    const amt = Number(form.amount_invested)
    if (!amt || amt <= 0) return setError('Enter a valid invested amount.')
    setError(''); setSaving(true)
    const payload = {
      ...form,
      entity: form.entity.trim(),
      brief: form.brief.trim(),
      notes: form.notes.trim(),
      amount_invested: amt,
      expected_return: form.expected_return ? Number(form.expected_return) : null,
      actual_return: form.actual_return != null ? Number(form.actual_return) : null,
    }
    let err: string | null = null
    if (editing === 'new') {
      err = await addInvestment(payload)
    } else if (editing) {
      await updateInvestment(editing.id, payload)
    }
    setSaving(false)
    if (err) {
      setError(err.includes('cf_investments') ? 'Run supabase/cf_investments_schema.sql in Supabase first.' : err)
      return
    }
    close()
  }

  // ── Derived stats ──────────────────────────────────────────
  const totalDeployed = useMemo(() => investments.reduce((s, i) => s + Number(i.amount_invested), 0), [investments])
  const totalReturned = useMemo(() =>
    investments.filter(i => i.status === 'gained' || i.status === 'partial')
      .reduce((s, i) => s + Number(i.actual_return ?? 0), 0), [investments])
  const activeCount   = useMemo(() => investments.filter(i => i.status === 'active').length, [investments])
  const portfolioROI  = totalDeployed > 0 ? ((totalReturned - totalDeployed) / totalDeployed) * 100 : null

  const filtered = useMemo(() =>
    filter === 'all' ? investments : investments.filter(i => i.status === filter),
    [investments, filter])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-[1200px] mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[26px] md:text-[32px] font-bold text-white tracking-tight">Investments</h1>
          <p className="text-[13px] text-white/40 mt-0.5">Short-term targeted positions.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-[14px] font-semibold text-white transition-all active:scale-[0.97]" style={cfPrimaryBtn}>
          <Plus size={16} strokeWidth={2.5} />
          <span className="hidden sm:inline">Add Investment</span>
        </button>
      </div>

      {loadError && (
        <div className="mb-4 px-4 py-3 rounded-[14px] text-[13px] text-red-300" style={{ background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.25)' }}>
          Couldn't load data: {loadError}
          <div className="text-red-300/70 text-[12px] mt-1">If it mentions <code>cf_investments</code>, run <code>supabase/cf_investments_schema.sql</code> in Supabase SQL Editor.</div>
        </div>
      )}

      {/* Hero stats */}
      <div className="relative overflow-hidden p-6 mb-4" style={cfHero}>
        <div className="absolute top-[-20%] right-[-5%] w-[45%] h-[80%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,200,160,0.28) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCell label="Total Deployed" value={`LKR ${formatCurrency(totalDeployed)}`} color="rgba(255,255,255,0.85)" />
          <StatCell label="Returned" value={`LKR ${formatCurrency(totalReturned)}`} color={totalReturned > 0 ? CF_GREEN : 'rgba(255,255,255,0.85)'} />
          <StatCell label="Active Positions" value={String(activeCount)} color={CF_BLUE} />
          <StatCell
            label="Portfolio ROI"
            value={portfolioROI != null ? `${portfolioROI >= 0 ? '+' : ''}${portfolioROI.toFixed(1)}%` : '—'}
            color={portfolioROI == null ? 'rgba(255,255,255,0.4)' : portfolioROI >= 0 ? CF_GREEN : CF_RED}
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className="px-3.5 py-1.5 rounded-[10px] text-[13px] font-medium transition-all"
            style={filter === f.id
              ? { background: 'linear-gradient(135deg, rgba(0,200,160,0.85), rgba(0,113,227,0.85))', color: '#fff' }
              : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {investments.length === 0 ? (
        <div className="py-20 flex flex-col items-center text-center" style={cfTile}>
          <div className="w-14 h-14 rounded-[16px] flex items-center justify-center mb-4"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <TrendingUp size={26} className="text-white/40" />
          </div>
          <div className="text-white/60 text-[15px] font-medium">No investments yet</div>
          <div className="text-white/30 text-[13px] mt-1 mb-5">Log your first position.</div>
          <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 rounded-[14px] text-[14px] font-semibold text-white" style={cfPrimaryBtn}>
            <Plus size={16} strokeWidth={2.5} /> Add Investment
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 flex flex-col items-center text-center rounded-[20px]" style={cfTile}>
          <div className="text-white/40 text-[14px]">No {filter} positions.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(inv => (
            <InvestmentCard
              key={inv.id}
              inv={inv}
              onEdit={() => openEdit(inv)}
              onDelete={() => { if (confirm(`Delete investment in ${inv.entity}?`)) deleteInvestment(inv.id) }}
            />
          ))}
        </div>
      )}

      {/* Add / Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:px-4" onClick={close}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" />
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full md:max-w-[480px] rounded-t-[28px] md:rounded-[28px] p-6 max-h-[92vh] overflow-y-auto"
            style={{ background: 'linear-gradient(145deg, rgba(28,28,34,0.97) 0%, rgba(18,18,22,0.97) 100%)', backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 -8px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-white">{editing === 'new' ? 'New Investment' : 'Edit Investment'}</h2>
              <button onClick={close} className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">

              {/* Entity */}
              <div>
                <label className={`block ${cfLabel} mb-1.5`}>Entity / Organisation</label>
                <input type="text" value={form.entity} onChange={e => patch('entity', e.target.value)}
                  placeholder="e.g. Bitcoin, Acme Corp, Gold Fund"
                  className={`w-full px-4 py-3 text-[15px] placeholder-white/20 ${cfInputRing}`} style={cfInput} autoFocus />
              </div>

              {/* Brief */}
              <div>
                <label className={`block ${cfLabel} mb-1.5`}>Brief <span className="text-white/25 normal-case tracking-normal">(optional)</span></label>
                <input type="text" value={form.brief} onChange={e => patch('brief', e.target.value)}
                  placeholder="Short description of the deal or position"
                  className={`w-full px-4 py-3 text-[15px] placeholder-white/20 ${cfInputRing}`} style={cfInput} />
              </div>

              {/* Sector + Invested At row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block ${cfLabel} mb-1.5`}>Sector</label>
                  <div className="relative">
                    <select value={form.sector} onChange={e => patch('sector', e.target.value as CFInvestmentSector)}
                      className={`w-full px-4 py-3 text-[15px] appearance-none pr-9 ${cfInputRing}`} style={cfInput}>
                      {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className={`block ${cfLabel} mb-1.5`}>Invested On</label>
                  <input type="date" value={form.invested_at} onChange={e => patch('invested_at', e.target.value)}
                    className={`w-full px-4 py-3 text-[15px] ${cfInputRing}`} style={{ ...cfInput, colorScheme: 'dark' }} />
                </div>
              </div>

              {/* Amount invested */}
              <div>
                <label className={`block ${cfLabel} mb-1.5`}>Amount Invested</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-[14px] font-medium">LKR</span>
                  <input type="number" inputMode="decimal" step="0.01" min="0"
                    value={form.amount_invested || ''} onChange={e => patch('amount_invested', Number(e.target.value))}
                    placeholder="0"
                    className={`w-full pl-14 pr-4 py-3 text-[15px] placeholder-white/20 ${cfInputRing}`} style={cfInput} />
                </div>
              </div>

              {/* Expected return + Target date row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block ${cfLabel} mb-1.5`}>Expected Return <span className="text-white/25 normal-case tracking-normal">(optional)</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-[13px] font-medium">LKR</span>
                    <input type="number" inputMode="decimal" step="0.01" min="0"
                      value={form.expected_return ?? ''} onChange={e => patch('expected_return', e.target.value ? Number(e.target.value) : null)}
                      placeholder="0"
                      className={`w-full pl-12 pr-4 py-3 text-[15px] placeholder-white/20 ${cfInputRing}`} style={cfInput} />
                  </div>
                </div>
                <div>
                  <label className={`block ${cfLabel} mb-1.5`}>Target Date <span className="text-white/25 normal-case tracking-normal">(optional)</span></label>
                  <input type="date" value={form.target_date ?? ''} onChange={e => patch('target_date', e.target.value || null)}
                    className={`w-full px-4 py-3 text-[15px] ${cfInputRing}`} style={{ ...cfInput, colorScheme: 'dark' }} />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className={`block ${cfLabel} mb-2`}>Status</label>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(STATUS_CONFIG) as CFInvestmentStatus[]).map(s => {
                    const cfg = STATUS_CONFIG[s]
                    const Icon = cfg.icon
                    const active = form.status === s
                    return (
                      <button key={s} type="button" onClick={() => patch('status', s)}
                        className="flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-[12px] text-[12px] font-semibold transition-all"
                        style={active
                          ? { background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}55` }
                          : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <Icon size={14} strokeWidth={2.2} />
                        {cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Actual return — show when not active */}
              {form.status !== 'active' && (
                <div>
                  <label className={`block ${cfLabel} mb-1.5`}>Actual Return</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-[14px] font-medium">LKR</span>
                    <input type="number" inputMode="decimal" step="0.01" min="0"
                      value={form.actual_return ?? ''} onChange={e => patch('actual_return', e.target.value ? Number(e.target.value) : null)}
                      placeholder="0"
                      className={`w-full pl-14 pr-4 py-3 text-[15px] placeholder-white/20 ${cfInputRing}`} style={cfInput} />
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className={`block ${cfLabel} mb-1.5`}>Notes <span className="text-white/25 normal-case tracking-normal">(optional)</span></label>
                <input type="text" value={form.notes} onChange={e => patch('notes', e.target.value)}
                  placeholder="e.g. Exit at 2x, stop-loss at -15%"
                  className={`w-full px-4 py-3 text-[15px] placeholder-white/20 ${cfInputRing}`} style={cfInput} />
              </div>

              {error && (
                <div className="px-4 py-3 rounded-[12px] text-[13px] text-red-300" style={{ background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.2)' }}>{error}</div>
              )}

              <button type="submit" disabled={saving}
                className="w-full py-3.5 rounded-[14px] text-[16px] font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-40" style={cfPrimaryBtn}>
                {saving ? 'Saving…' : editing === 'new' ? 'Add Investment' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Sub-components ──────────────────────────────────────────

function StatCell({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div className={cfLabel}>{label}</div>
      <div className="text-[20px] md:text-[24px] font-black tracking-tight leading-tight mt-1.5" style={{ color }}>{value}</div>
    </div>
  )
}

function InvestmentCard({ inv, onEdit, onDelete }: {
  inv: CFInvestment
  onEdit: () => void
  onDelete: () => void
}) {
  const cfg = STATUS_CONFIG[inv.status]
  const StatusIcon = cfg.icon

  const roi = inv.actual_return != null && inv.amount_invested > 0
    ? ((Number(inv.actual_return) - Number(inv.amount_invested)) / Number(inv.amount_invested)) * 100
    : null

  const expectedRoi = inv.expected_return != null && inv.amount_invested > 0
    ? ((Number(inv.expected_return) - Number(inv.amount_invested)) / Number(inv.amount_invested)) * 100
    : null

  return (
    <div className="group relative overflow-hidden p-5 transition-all hover:scale-[1.01]" style={{ ...cfTile, cursor: 'default' }}>
      {/* Top row: entity + status badge + actions */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[17px] font-bold text-white truncate">{inv.entity}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
              style={{ background: cfg.bg, color: cfg.color }}>
              <StatusIcon size={10} strokeWidth={2.5} />
              {cfg.label}
            </span>
          </div>
          {/* Sector chip */}
          <span className="inline-block mt-1 px-2 py-0.5 rounded-[6px] text-[11px] font-medium text-white/50"
            style={{ background: SECTOR_COLORS[inv.sector] ?? 'rgba(255,255,255,0.08)' }}>
            {inv.sector}
          </span>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} title="Edit"
            className="w-7 h-7 flex items-center justify-center rounded-full text-white/25 hover:text-white/70 hover:bg-white/10 transition-all">
            <Pencil size={13} />
          </button>
          <button onClick={onDelete} title="Delete"
            className="w-7 h-7 flex items-center justify-center rounded-full text-white/15 hover:text-[#FF453A] hover:bg-white/10 transition-all">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Brief */}
      {inv.brief && (
        <p className="text-[13px] text-white/45 mb-4 leading-relaxed">{inv.brief}</p>
      )}

      {/* Amounts row */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="rounded-[12px] px-3.5 py-2.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="text-[11px] text-white/35 uppercase tracking-wider font-semibold mb-1">Invested</div>
          <div className="text-[16px] font-bold text-white">LKR {formatCurrency(Number(inv.amount_invested))}</div>
        </div>

        {inv.status !== 'active' && inv.actual_return != null ? (
          <div className="rounded-[12px] px-3.5 py-2.5" style={{ background: roi != null && roi >= 0 ? 'rgba(52,199,89,0.1)' : 'rgba(255,69,58,0.1)' }}>
            <div className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: roi != null && roi >= 0 ? CF_GREEN : CF_RED, opacity: 0.7 }}>Actual Return</div>
            <div className="text-[16px] font-bold" style={{ color: roi != null && roi >= 0 ? CF_GREEN : CF_RED }}>
              LKR {formatCurrency(Number(inv.actual_return))}
            </div>
          </div>
        ) : inv.expected_return != null ? (
          <div className="rounded-[12px] px-3.5 py-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.08)' }}>
            <div className="text-[11px] text-white/25 uppercase tracking-wider font-semibold mb-1">Expected</div>
            <div className="text-[16px] font-semibold text-white/35">LKR {formatCurrency(Number(inv.expected_return))}</div>
          </div>
        ) : null}
      </div>

      {/* ROI + meta row */}
      <div className="flex items-center gap-3 flex-wrap">
        {roi != null && (
          <div className="flex items-center gap-1 text-[13px] font-bold" style={{ color: roi >= 0 ? CF_GREEN : CF_RED }}>
            {roi >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {roi >= 0 ? '+' : ''}{roi.toFixed(1)}% ROI
          </div>
        )}
        {roi == null && expectedRoi != null && (
          <div className="flex items-center gap-1 text-[13px] font-medium text-white/30">
            <TrendingUp size={13} />
            +{expectedRoi.toFixed(1)}% expected
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto text-[12px] text-white/25">
          {inv.target_date && (
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {formatDate(inv.target_date)}
            </span>
          )}
          {!inv.target_date && (
            <span>{formatDate(inv.invested_at)}</span>
          )}
        </div>
      </div>

      {/* Notes */}
      {inv.notes && (
        <div className="mt-3 pt-3 border-t border-white/[0.06] text-[12px] text-white/30 italic">{inv.notes}</div>
      )}
    </div>
  )
}
