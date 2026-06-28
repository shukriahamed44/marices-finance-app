import { useState } from 'react'
import { Plus, HandCoins, X, Trash2, Check, RotateCcw, Pencil } from 'lucide-react'
import { useCF } from '../../context/CFContext'
import { formatCurrency, formatDate } from '../../lib/utils'
import { cfTile, cfHero, cfInput, cfInputRing, cfLabel, cfPrimaryBtn, CF_AMBER } from '../../components/cf/cfStyles'
import type { CFDebt } from '../../lib/cf-types'

export default function CFDebtsList() {
  const { debts, totalOwed, addDebt, updateDebt, deleteDebt, loading, loadError } = useCF()
  const [editing, setEditing] = useState<CFDebt | 'new' | null>(null)
  const [name, setName]   = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote]   = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function openNew() { setEditing('new'); setName(''); setAmount(''); setNote(''); setError('') }
  function openEdit(d: CFDebt) { setEditing(d); setName(d.name); setAmount(String(d.amount)); setNote(d.note); setError('') }
  function close() { setEditing(null) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const value = parseFloat(amount)
    if (!name.trim()) return setError('Enter a name.')
    if (!value || value < 0) return setError('Enter a valid amount.')
    setError(''); setSaving(true)
    let err: string | null = null
    if (editing === 'new') {
      err = await addDebt(name.trim(), value, note.trim())
    } else if (editing) {
      await updateDebt(editing.id, { name: name.trim(), amount: value, note: note.trim() })
    }
    setSaving(false)
    if (err) { setError(err.includes('cf_debts') ? 'Run supabase/cf_debt_schema.sql in Supabase first.' : err); return }
    close()
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
      </div>
    )
  }

  const open = debts.filter(d => !d.settled)
  const settled = debts.filter(d => d.settled)

  return (
    <div className="p-4 md:p-8 max-w-[1100px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[26px] md:text-[32px] font-bold text-white tracking-tight">Debts</h1>
          <p className="text-[13px] text-white/40 mt-0.5">Who owes you, and how much.</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-[14px] font-semibold text-white transition-all active:scale-[0.97]" style={cfPrimaryBtn}>
          <Plus size={16} strokeWidth={2.5} /> <span className="hidden sm:inline">Add Debt</span>
        </button>
      </div>

      {loadError && (
        <div className="mb-4 px-4 py-3 rounded-[14px] text-[13px] text-red-300" style={{ background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.25)' }}>
          Couldn't load data: {loadError}
          <div className="text-red-300/70 text-[12px] mt-1">If it mentions <code>cf_debts</code>, run <code>supabase/cf_debt_schema.sql</code> in Supabase SQL Editor.</div>
        </div>
      )}

      {/* Total owed hero */}
      <div className="relative overflow-hidden p-6 mb-4" style={cfHero}>
        <div className="absolute top-[-20%] right-[-5%] w-[50%] h-[80%] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,159,10,0.22) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div className="relative">
          <div className="flex items-center gap-2">
            <HandCoins size={15} className="text-white/50" />
            <span className={cfLabel}>Total owed to you</span>
          </div>
          <div className="text-[34px] md:text-[44px] font-black tracking-[-1px] leading-none mt-3" style={{ color: CF_AMBER }}>
            <span className="text-white/40 text-[22px] md:text-[28px] font-bold mr-2">LKR</span>
            {formatCurrency(totalOwed)}
          </div>
        </div>
      </div>

      {debts.length === 0 ? (
        <div className="py-20 flex flex-col items-center text-center" style={cfTile}>
          <div className="w-14 h-14 rounded-[16px] flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <HandCoins size={26} className="text-white/40" />
          </div>
          <div className="text-white/60 text-[15px] font-medium">No debts tracked</div>
          <div className="text-white/30 text-[13px] mt-1 mb-5">Add a debt, or mark a Money Out as a debt.</div>
          <button onClick={openNew} className="flex items-center gap-2 px-5 py-2.5 rounded-[14px] text-[14px] font-semibold text-white" style={cfPrimaryBtn}>
            <Plus size={16} strokeWidth={2.5} /> Add Debt
          </button>
        </div>
      ) : (
        <>
          {/* Outstanding */}
          {open.length > 0 && (
            <div className="overflow-hidden mb-4" style={cfTile}>
              {open.map((d, i) => (
                <DebtRow key={d.id} d={d} i={i}
                  onSettle={() => updateDebt(d.id, { settled: true })}
                  onEdit={() => openEdit(d)}
                  onDelete={() => { if (confirm(`Delete debt from ${d.name}?`)) deleteDebt(d.id) }} />
              ))}
            </div>
          )}

          {/* Settled */}
          {settled.length > 0 && (
            <>
              <div className={`${cfLabel} mb-2 mt-6`}>Settled</div>
              <div className="overflow-hidden" style={cfTile}>
                {settled.map((d, i) => (
                  <DebtRow key={d.id} d={d} i={i} settledStyle
                    onSettle={() => updateDebt(d.id, { settled: false })}
                    onEdit={() => openEdit(d)}
                    onDelete={() => { if (confirm(`Delete debt from ${d.name}?`)) deleteDebt(d.id) }} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Add / edit modal */}
      {editing && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:px-4" onClick={close}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" />
          <div onClick={e => e.stopPropagation()} className="relative w-full md:max-w-[400px] rounded-t-[28px] md:rounded-[28px] p-6"
            style={{ background: 'linear-gradient(145deg, rgba(28,28,34,0.95) 0%, rgba(18,18,22,0.95) 100%)', backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', border: '1px solid rgba(255,255,255,0.14)', boxShadow: '0 -8px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-white">{editing === 'new' ? 'New Debt' : 'Edit Debt'}</h2>
              <button onClick={close} className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className={`block ${cfLabel} mb-1.5`}>Who owes you</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John" className={`w-full px-4 py-3 text-[15px] placeholder-white/20 ${cfInputRing}`} style={cfInput} autoFocus />
              </div>
              <div>
                <label className={`block ${cfLabel} mb-1.5`}>Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-[14px] font-medium">LKR</span>
                  <input type="number" inputMode="decimal" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" className={`w-full pl-14 pr-4 py-3 text-[15px] placeholder-white/20 ${cfInputRing}`} style={cfInput} />
                </div>
              </div>
              <div>
                <label className={`block ${cfLabel} mb-1.5`}>Note <span className="text-white/25 normal-case tracking-normal">(optional)</span></label>
                <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Cash loan" className={`w-full px-4 py-3 text-[15px] placeholder-white/20 ${cfInputRing}`} style={cfInput} />
              </div>
              {error && (
                <div className="px-4 py-3 rounded-[12px] text-[13px] text-red-300" style={{ background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.2)' }}>{error}</div>
              )}
              <button type="submit" disabled={saving} className="w-full py-3.5 rounded-[14px] text-[16px] font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-40" style={cfPrimaryBtn}>
                {saving ? 'Saving…' : editing === 'new' ? 'Add Debt' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function DebtRow({ d, i, settledStyle, onSettle, onEdit, onDelete }: {
  d: CFDebt; i: number; settledStyle?: boolean
  onSettle: () => void; onEdit: () => void; onDelete: () => void
}) {
  return (
    <div className={`group flex items-center gap-3 px-4 md:px-5 py-3.5 hover:bg-white/[0.04] transition-colors ${i !== 0 ? 'border-t border-white/[0.06]' : ''}`}>
      <div className="flex-1 min-w-0">
        <div className={`text-[15px] font-semibold truncate ${settledStyle ? 'text-white/40 line-through' : 'text-white'}`}>{d.name}</div>
        <div className="text-[12px] text-white/35 truncate">{d.note ? `${d.note} · ` : ''}{formatDate(d.created_at)}</div>
      </div>
      <div className={`text-[15px] font-semibold shrink-0 ${settledStyle ? 'text-white/40' : ''}`} style={settledStyle ? undefined : { color: CF_AMBER }}>
        LKR {formatCurrency(Number(d.amount))}
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <button onClick={onSettle} title={settledStyle ? 'Mark unsettled' : 'Mark settled'}
          className={`w-7 h-7 flex items-center justify-center rounded-full transition-all ${settledStyle ? 'text-white/30 hover:text-white/70 hover:bg-white/10' : 'text-white/25 hover:text-[#34C759] hover:bg-white/10'}`}>
          {settledStyle ? <RotateCcw size={14} /> : <Check size={15} />}
        </button>
        <button onClick={onEdit} title="Edit" className="w-7 h-7 flex items-center justify-center rounded-full text-white/20 hover:text-white/70 hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100">
          <Pencil size={13} />
        </button>
        <button onClick={onDelete} title="Delete" className="w-7 h-7 flex items-center justify-center rounded-full text-white/15 hover:text-[#FF453A] hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
