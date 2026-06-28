import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Users, ChevronRight, X } from 'lucide-react'
import { useCF } from '../../context/CFContext'
import { formatCurrency } from '../../lib/utils'
import { getInitials, getAvatarColor } from '../../lib/utils'
import { cfTile, cfInput, cfInputRing, cfLabel, cfPrimaryBtn, CF_GREEN, CF_AMBER } from '../../components/cf/cfStyles'

export default function CFClientsList() {
  const navigate = useNavigate()
  const { clients, getClientStats, addClient, loading, loadError } = useCF()
  const [adding, setAdding]   = useState(false)
  const [name, setName]       = useState('')
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setError(''); setSaving(true)
    const err = await addClient(name.trim())
    setSaving(false)
    if (err) { setError(err); return }
    setName('')
    setAdding(false)
  }

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[26px] md:text-[32px] font-bold text-white tracking-tight">Clients</h1>
          <p className="text-[13px] text-white/40 mt-0.5">Track jobs and outstanding payments per client.</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[14px] text-[14px] font-semibold text-white transition-all active:scale-[0.97]"
          style={cfPrimaryBtn}
        >
          <Plus size={16} strokeWidth={2.5} /> <span className="hidden sm:inline">Add Client</span>
        </button>
      </div>

      {loadError && (
        <div className="mb-4 px-4 py-3 rounded-[14px] text-[13px] text-red-300" style={{ background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.25)' }}>
          Couldn't load your data: {loadError}
          <div className="text-red-300/70 text-[12px] mt-1">If this mentions a missing table, run the relevant SQL in <code>supabase/</code> (<code>cf_schema.sql</code> for clients/jobs, <code>cf_debt_schema.sql</code> for debts) in your Supabase SQL Editor.</div>
        </div>
      )}

      {clients.length === 0 ? (
        <div className="py-20 flex flex-col items-center text-center" style={cfTile}>
          <div className="w-14 h-14 rounded-[16px] flex items-center justify-center mb-4"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Users size={26} className="text-white/40" />
          </div>
          <div className="text-white/60 text-[15px] font-medium">No clients yet</div>
          <div className="text-white/30 text-[13px] mt-1 mb-5">Add your first client to start tracking jobs.</div>
          <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-[14px] text-[14px] font-semibold text-white" style={cfPrimaryBtn}>
            <Plus size={16} strokeWidth={2.5} /> Add Client
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {clients.map(c => {
            const s = getClientStats(c.id)
            const settled = s.outstanding <= 0
            return (
              <button
                key={c.id}
                onClick={() => navigate(`/cf/clients/${c.id}`)}
                className="text-left p-5 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] group"
                style={cfTile}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-[13px] flex items-center justify-center text-white text-[14px] font-bold shrink-0 ${getAvatarColor(c.name)}`}>
                    {getInitials(c.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[16px] font-semibold text-white truncate">{c.name}</div>
                    <div className="text-[12px] text-white/40">Billed: LKR {formatCurrency(s.billed)}</div>
                  </div>
                  <ChevronRight size={18} className="text-white/25 group-hover:text-white/50 transition-colors shrink-0" />
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <div className="flex-1 px-3 py-2.5 rounded-[12px]" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className={cfLabel}>Paid</div>
                    <div className="text-[15px] font-semibold mt-0.5" style={{ color: CF_GREEN }}>{formatCurrency(s.paid)}</div>
                  </div>
                  <div className="flex-1 px-3 py-2.5 rounded-[12px]" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className={cfLabel}>Outstanding</div>
                    <div className="text-[15px] font-semibold mt-0.5" style={{ color: settled ? CF_GREEN : CF_AMBER }}>
                      {settled ? 'Settled' : formatCurrency(s.outstanding)}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Add client modal */}
      {adding && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:px-4" onClick={() => setAdding(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" />
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full md:max-w-[400px] rounded-t-[28px] md:rounded-[28px] p-6"
            style={{
              background: 'linear-gradient(145deg, rgba(28,28,34,0.95) 0%, rgba(18,18,22,0.95) 100%)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: '0 -8px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-white">New Client</h2>
              <button onClick={() => setAdding(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className={`block ${cfLabel} mb-1.5`}>Client name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Acme Studios"
                  className={`w-full px-4 py-3 text-[15px] placeholder-white/20 ${cfInputRing}`}
                  style={cfInput}
                  autoFocus
                />
              </div>
              {error && (
                <div className="px-4 py-3 rounded-[12px] text-[13px] text-red-300" style={{ background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.2)' }}>
                  {error}
                </div>
              )}
              <button type="submit" disabled={saving} className="w-full py-3.5 rounded-[14px] text-[16px] font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-40" style={cfPrimaryBtn}>
                {saving ? 'Adding…' : 'Add Client'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
