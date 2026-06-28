import { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { ChevronLeft, ChevronDown, Plus, Trash2, Briefcase, CheckCircle2, X, CreditCard, ArrowDownLeft } from 'lucide-react'
import { useCF } from '../../context/CFContext'
import { formatCurrency, formatDate } from '../../lib/utils'
import { getInitials, getAvatarColor } from '../../lib/utils'
import CFAddMoneyModal from '../../components/cf/CFAddMoneyModal'
import { cfTile, cfHero, cfInput, cfInputRing, cfLabel, cfPrimaryBtn, CF_GREEN, CF_AMBER } from '../../components/cf/cfStyles'

export default function CFClientDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getClientById, getJobsByClient, getClientStats, addJob, deleteJob, deleteClient, transactions, deleteTransaction, loading } = useCF()

  const [addingJob, setAddingJob] = useState(false)
  const [title, setTitle]         = useState('')
  const [total, setTotal]         = useState('')
  const [saving, setSaving]       = useState(false)
  const [paying, setPaying]       = useState(false)
  const [showPaid, setShowPaid]   = useState(false)

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
      </div>
    )
  }

  const client = id ? getClientById(id) : undefined
  if (!client) return <Navigate to="/cf/clients" replace />

  const jobs = getJobsByClient(client.id)
  const stats = getClientStats(client.id)
  const settled = stats.outstanding <= 0

  async function handleAddJob(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    await addJob(client!.id, title.trim(), parseFloat(total) || 0)
    setSaving(false)
    setTitle(''); setTotal(''); setAddingJob(false)
  }

  async function handleDeleteClient() {
    if (confirm(`Delete "${client!.name}" and all its jobs? This cannot be undone.`)) {
      await deleteClient(client!.id)
      navigate('/cf/clients')
    }
  }

  // FIFO allocation: spread the client's total payments across jobs, oldest first.
  // A job is "paid" once cumulative payments cover it; the boundary job is part-paid.
  const jobsAsc = [...jobs].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  let pool = stats.paid
  const alloc: Record<string, { paid: number; outstanding: number; isPaid: boolean }> = {}
  for (const j of jobsAsc) {
    const tot = Number(j.total_amount)
    const applied = Math.min(pool, tot)
    pool -= applied
    alloc[j.id] = { paid: applied, outstanding: Math.max(tot - applied, 0), isPaid: tot > 0 && applied >= tot }
  }
  const openJobs = jobs.filter(j => !alloc[j.id].isPaid)
  const paidJobs = jobs.filter(j => alloc[j.id].isPaid)
  const payments = transactions
    .filter(t => t.client_id === client.id && t.direction === 'in')
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  function renderJobRow(j: typeof jobs[number], i: number) {
    const a = alloc[j.id]
    const partPaid = !a.isPaid && a.paid > 0
    return (
      <div key={j.id} className={`group flex items-center gap-3 px-4 md:px-5 py-3.5 hover:bg-white/[0.04] transition-colors ${i !== 0 ? 'border-t border-white/[0.06]' : ''}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`text-[15px] font-semibold truncate ${a.isPaid ? 'text-white/70' : 'text-white'}`}>{j.title}</span>
            {a.isPaid && <CheckCircle2 size={13} style={{ color: CF_GREEN }} className="shrink-0" />}
          </div>
          <div className="text-[12px] text-white/35 mt-0.5">{formatDate(j.created_at)}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[15px] font-semibold text-white leading-none">LKR {formatCurrency(Number(j.total_amount))}</div>
          <div className="text-[12px] mt-1 leading-none" style={{ color: a.isPaid ? CF_GREEN : CF_AMBER }}>
            {a.isPaid ? 'Paid' : partPaid ? `Outstanding ${formatCurrency(a.outstanding)} · part-paid` : `Outstanding ${formatCurrency(a.outstanding)}`}
          </div>
        </div>
        <button
          onClick={() => { if (confirm(`Delete job "${j.title}"?`)) deleteJob(j.id) }}
          className="w-7 h-7 flex items-center justify-center rounded-full text-white/15 hover:text-[#FF453A] hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 shrink-0"
          title="Delete job"
        >
          <Trash2 size={14} />
        </button>
      </div>
    )
  }

  function renderPaymentRow(t: typeof payments[number], i: number) {
    return (
      <div key={t.id} className={`group flex items-center gap-3 px-4 md:px-5 py-3.5 hover:bg-white/[0.04] transition-colors ${i !== 0 ? 'border-t border-white/[0.06]' : ''}`}>
        <div className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0" style={{ background: `${CF_GREEN}1f`, border: `1px solid ${CF_GREEN}33` }}>
          <ArrowDownLeft size={16} style={{ color: CF_GREEN }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-medium text-white truncate">{t.note || 'Payment received'}</div>
          <div className="text-[12px] text-white/35">{formatDate(t.created_at)}</div>
        </div>
        <div className="text-[14px] font-semibold shrink-0" style={{ color: CF_GREEN }}>+{formatCurrency(Number(t.amount))}</div>
        <button
          onClick={() => { if (confirm('Delete this payment?')) deleteTransaction(t.id) }}
          className="w-7 h-7 flex items-center justify-center rounded-full text-white/15 hover:text-[#FF453A] hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 shrink-0"
          title="Delete payment"
        >
          <Trash2 size={14} />
        </button>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 max-w-[1100px] mx-auto">
      {/* Back */}
      <button onClick={() => navigate('/cf/clients')} className="flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors text-[14px] font-medium mb-5">
        <ChevronLeft size={16} /> Clients
      </button>

      {/* Client header / summary */}
      <div className="relative overflow-hidden p-6 md:p-7 mb-4" style={cfHero}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className={`w-14 h-14 rounded-[16px] flex items-center justify-center text-white text-[18px] font-bold shrink-0 ${getAvatarColor(client.name)}`}>
              {getInitials(client.name)}
            </div>
            <div className="min-w-0">
              <h1 className="text-[24px] md:text-[28px] font-bold text-white tracking-tight truncate">{client.name}</h1>
              <p className="text-[13px] text-white/40">{jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}</p>
            </div>
          </div>
          <button onClick={handleDeleteClient} title="Delete client" className="w-9 h-9 flex items-center justify-center rounded-full text-white/40 hover:text-[#FF453A] hover:bg-white/10 transition-colors shrink-0">
            <Trash2 size={16} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5 mt-6">
          <div className="px-3 py-3 rounded-[14px]" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <div className={cfLabel}>Billed</div>
            <div className="text-[16px] md:text-[20px] font-bold text-white mt-1 leading-none truncate">{formatCurrency(stats.billed)}</div>
          </div>
          <div className="px-3 py-3 rounded-[14px]" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <div className={cfLabel}>Paid</div>
            <div className="text-[16px] md:text-[20px] font-bold mt-1 leading-none truncate" style={{ color: CF_GREEN }}>{formatCurrency(stats.paid)}</div>
          </div>
          <div className="px-3 py-3 rounded-[14px]" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <div className={cfLabel}>Outstanding</div>
            <div className="text-[16px] md:text-[20px] font-bold mt-1 leading-none truncate" style={{ color: settled ? CF_GREEN : CF_AMBER }}>
              {settled ? 'Settled' : formatCurrency(stats.outstanding)}
            </div>
          </div>
        </div>
      </div>

      {/* Quick payment + add job */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setPaying(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] text-[14px] font-semibold text-white transition-all active:scale-[0.98]"
          style={{ background: `linear-gradient(135deg, ${CF_GREEN}, ${CF_GREEN}cc)`, boxShadow: `0 8px 24px ${CF_GREEN}44, inset 0 1px 0 rgba(255,255,255,0.2)`, border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <CreditCard size={16} strokeWidth={2.2} /> Record Payment
        </button>
        <button
          onClick={() => setAddingJob(true)}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] text-[14px] font-semibold text-white transition-all active:scale-[0.98]"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}
        >
          <Plus size={16} strokeWidth={2.2} /> Add Job
        </button>
      </div>

      {/* Jobs & payments ledger */}
      <div className="flex items-center gap-2 mb-3 mt-6">
        <Briefcase size={16} className="text-white/50" />
        <h2 className="text-[16px] font-semibold text-white">Jobs & Payments</h2>
      </div>

      {jobs.length === 0 && payments.length === 0 ? (
        <div className="py-14 text-center" style={cfTile}>
          <div className="text-white/40 text-[14px]">No jobs yet for this client.</div>
          <button onClick={() => setAddingJob(true)} className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-[13px] font-semibold text-white" style={cfPrimaryBtn}>
            <Plus size={15} strokeWidth={2.5} /> Add Job
          </button>
        </div>
      ) : (
        <>
        {/* Outstanding jobs (still owed) */}
        {openJobs.length > 0 && (
          <div className="overflow-hidden" style={cfTile}>
            {openJobs.map((j, i) => renderJobRow(j, i))}
          </div>
        )}

        {/* Payments received — record rows */}
        {payments.length > 0 && (
          <div className={`overflow-hidden ${openJobs.length > 0 ? 'mt-3' : ''}`} style={cfTile}>
            {payments.map((t, i) => renderPaymentRow(t, i))}
          </div>
        )}

        {/* Paid jobs — collapsed to one line, expandable (green outline) */}
        {paidJobs.length > 0 && (
          <div className={(openJobs.length > 0 || payments.length > 0) ? 'mt-3' : ''}>
            <button
              onClick={() => setShowPaid(s => !s)}
              className="w-full flex items-center gap-3 px-4 md:px-5 py-3.5 transition-colors hover:bg-white/[0.03]"
              style={{ ...cfTile, border: `1px solid ${CF_GREEN}44` }}
            >
              <CheckCircle2 size={16} style={{ color: CF_GREEN }} className="shrink-0" />
              <span className="text-[14px] font-semibold text-white">Paid jobs</span>
              <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${CF_GREEN}22`, color: CF_GREEN }}>{paidJobs.length}</span>
              <span className="flex-1" />
              <ChevronDown size={16} className="text-white/40 transition-transform shrink-0" style={{ transform: showPaid ? 'rotate(180deg)' : 'none' }} />
            </button>

            {showPaid && (
              <div className="overflow-hidden mt-2" style={{ ...cfTile, border: `1px solid ${CF_GREEN}55`, boxShadow: `0 0 0 1px ${CF_GREEN}22, 0 4px 24px rgba(0,0,0,0.35)` }}>
                {paidJobs.map((j, i) => renderJobRow(j, i))}
              </div>
            )}
          </div>
        )}
        </>
      )}

      {/* Add job modal */}
      {addingJob && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center md:px-4" onClick={() => setAddingJob(false)}>
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
              <h2 className="text-[18px] font-bold text-white">New Job</h2>
              <button onClick={() => setAddingJob(false)} className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddJob} className="space-y-4">
              <div>
                <label className={`block ${cfLabel} mb-1.5`}>Job title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Landing page redesign"
                  className={`w-full px-4 py-3 text-[15px] placeholder-white/20 ${cfInputRing}`} style={cfInput} autoFocus />
              </div>
              <div>
                <label className={`block ${cfLabel} mb-1.5`}>Total amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-[14px] font-medium">LKR</span>
                  <input type="number" inputMode="decimal" step="0.01" value={total} onChange={e => setTotal(e.target.value)} placeholder="0"
                    className={`w-full pl-14 pr-4 py-3 text-[15px] placeholder-white/20 ${cfInputRing}`} style={cfInput} />
                </div>
              </div>
              <button type="submit" disabled={saving} className="w-full py-3.5 rounded-[14px] text-[16px] font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-40" style={cfPrimaryBtn}>
                {saving ? 'Adding…' : 'Add Job'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Payment modal (money in, applied across this client's jobs oldest-first) */}
      {paying && (
        <CFAddMoneyModal
          direction="in"
          presetClientId={client.id}
          onClose={() => setPaying(false)}
        />
      )}
    </div>
  )
}
