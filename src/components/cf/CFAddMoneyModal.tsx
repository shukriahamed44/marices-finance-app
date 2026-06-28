import { useState, useMemo } from 'react'
import { X, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { useCF } from '../../context/CFContext'
import type { CFDirection } from '../../lib/cf-types'
import { cfInput, cfInputRing, cfLabel, cfTile, CF_GREEN, CF_RED } from './cfStyles'

interface Props {
  direction: CFDirection
  /** Pre-select a client (e.g. opened from a client page). */
  presetClientId?: string
  presetJobId?: string
  onClose: () => void
}

export default function CFAddMoneyModal({ direction, presetClientId, presetJobId, onClose }: Props) {
  const { clients, getJobsByClient, addTransaction } = useCF()
  const isIn = direction === 'in'

  const [clientId, setClientId] = useState(presetClientId ?? '')
  const [jobId, setJobId]       = useState(presetJobId ?? '')
  const [amount, setAmount]     = useState('')
  const [note, setNote]         = useState('')
  const [error, setError]       = useState('')
  const [saving, setSaving]     = useState(false)

  const jobs = useMemo(() => clientId ? getJobsByClient(clientId) : [], [clientId, getJobsByClient])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const value = parseFloat(amount)
    if (!value || value <= 0) return setError('Enter a valid amount.')
    if (isIn && !clientId) return setError('Select which client this is from.')
    setError(''); setSaving(true)
    await addTransaction({
      direction,
      amount: value,
      note: note.trim(),
      client_id: isIn ? clientId : null,
      job_id: isIn && jobId ? jobId : null,
    })
    setSaving(false)
    onClose()
  }

  const accent = isIn ? CF_GREEN : CF_RED

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[3px]" />
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full md:max-w-[420px] max-h-[92vh] overflow-y-auto rounded-t-[28px] md:rounded-[28px] p-6"
        style={{
          background: 'linear-gradient(145deg, rgba(28,28,34,0.95) 0%, rgba(18,18,22,0.95) 100%)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 -8px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center"
              style={{ background: `${accent}22`, border: `1px solid ${accent}40` }}>
              {isIn ? <ArrowDownLeft size={20} style={{ color: accent }} /> : <ArrowUpRight size={20} style={{ color: accent }} />}
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-white">{isIn ? 'Money In' : 'Money Out'}</h2>
              <p className="text-[12px] text-white/40">{isIn ? 'Payment received from a client' : 'An expense or withdrawal'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isIn && (
            <>
              <div>
                <label className={`block ${cfLabel} mb-1.5`}>Client</label>
                {clients.length === 0 ? (
                  <div className="text-[13px] text-white/40 px-4 py-3 rounded-[12px]" style={cfTile}>
                    No clients yet — add one from the Clients page first.
                  </div>
                ) : (
                  <select
                    value={clientId}
                    onChange={e => { setClientId(e.target.value); setJobId('') }}
                    className={`w-full px-4 py-3 text-[15px] ${cfInputRing}`}
                    style={cfInput}
                  >
                    <option value="" className="bg-[#1c1c22]">Select a client…</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id} className="bg-[#1c1c22]">{c.name}</option>
                    ))}
                  </select>
                )}
              </div>

              {jobs.length > 0 && (
                <div>
                  <label className={`block ${cfLabel} mb-1.5`}>Job <span className="text-white/25 normal-case tracking-normal">(optional)</span></label>
                  <select
                    value={jobId}
                    onChange={e => setJobId(e.target.value)}
                    className={`w-full px-4 py-3 text-[15px] ${cfInputRing}`}
                    style={cfInput}
                  >
                    <option value="" className="bg-[#1c1c22]">Unallocated</option>
                    {jobs.map(j => (
                      <option key={j.id} value={j.id} className="bg-[#1c1c22]">{j.title}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          <div>
            <label className={`block ${cfLabel} mb-1.5`}>Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-[14px] font-medium">LKR</span>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0"
                className={`w-full pl-14 pr-4 py-3 text-[15px] placeholder-white/20 ${cfInputRing}`}
                style={cfInput}
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className={`block ${cfLabel} mb-1.5`}>Brief note</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder={isIn ? 'e.g. Milestone 1 payment' : 'e.g. Software subscription'}
              className={`w-full px-4 py-3 text-[15px] placeholder-white/20 ${cfInputRing}`}
              style={cfInput}
            />
          </div>

          {error && (
            <div className="px-4 py-3 rounded-[12px] text-[13px] text-red-300" style={{ background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.2)' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-[14px] text-[16px] font-semibold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-40"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, boxShadow: `0 8px 24px ${accent}55, inset 0 1px 0 rgba(255,255,255,0.2)`, border: '1px solid rgba(255,255,255,0.15)' }}
          >
            {saving ? 'Saving…' : isIn ? 'Record Payment In' : 'Record Money Out'}
          </button>
        </form>
      </div>
    </div>
  )
}
