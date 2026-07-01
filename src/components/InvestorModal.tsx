import { useState, useEffect } from 'react'
import { X, UserPlus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { Investor } from '../lib/types'
import { cn } from '../lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  investor?: Investor
}

export default function InvestorModal({ open, onClose, investor }: Props) {
  const { addInvestor, updateInvestor, deleteInvestor } = useApp()
  const [name, setName]         = useState('')
  const [rate, setRate]         = useState('')
  const [phone, setPhone]       = useState('')
  const [notes, setNotes]       = useState('')
  const [status, setStatus]     = useState<Investor['status']>('active')
  const [error, setError]       = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (open) {
      setName(investor?.name ?? '')
      setRate(investor?.return_rate?.toString() ?? '')
      setPhone(investor?.phone ?? '')
      setNotes(investor?.notes ?? '')
      setStatus(investor?.status ?? 'active')
      setError('')
      setConfirmDelete(false)
    }
  }, [open, investor])

  function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return }
    if (!investor) return
    deleteInvestor(investor.id)
    onClose()
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return setError('Name is required.')
    const payload = {
      name: name.trim(),
      return_rate: rate ? Number(rate) : null,
      phone: phone || null,
      notes: notes || null,
      status,
      deleted_at: null,
    }
    if (investor) {
      updateInvestor(investor.id, payload)
    } else {
      addInvestor(payload)
    }
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-[24px] sm:rounded-[20px] shadow-apple-lg overflow-hidden max-h-[92vh] flex flex-col">
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-apple-surface-3" />
        </div>
        <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-apple-separator">
          <h2 className="text-[17px] font-semibold text-apple-label">
            {investor ? 'Edit Investor' : 'New Investor'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-apple-surface-2 flex items-center justify-center hover:bg-apple-surface-3">
            <X size={15} className="text-apple-label-2" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto">
          <div>
            <label className="apple-label">Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Investor name" className="apple-input" autoFocus />
          </div>
          <div>
            <label className="apple-label">Return Rate (%)</label>
            <input value={rate} onChange={e => setRate(e.target.value)} placeholder="e.g. 7" className="apple-input" inputMode="decimal" />
          </div>
          <div>
            <label className="apple-label">Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+94 77 000 0000" className="apple-input" />
          </div>
          <div>
            <label className="apple-label">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any notes…" rows={2}
              className="apple-input resize-none" />
          </div>
          <div>
            <label className="apple-label">Status</label>
            <div className="flex gap-2">
              {(['active', 'closed', 'placeholder'] as const).map(s => (
                <button key={s} type="button" onClick={() => setStatus(s)}
                  className={cn('flex-1 py-2 rounded-[8px] text-[13px] font-medium capitalize border transition-all',
                    status === s ? 'border-apple-blue bg-apple-blue-light text-apple-blue' : 'border-apple-separator text-apple-label-2 hover:border-apple-label-3'
                  )}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-[13px] text-apple-red font-medium">{error}</p>}
          <div className="flex gap-3 mt-2">
            {investor && (
              <button
                type="button"
                onClick={handleDelete}
                className={cn('flex-1 py-3 rounded-apple text-[15px] font-semibold transition-all active:scale-[0.98]',
                  confirmDelete
                    ? 'bg-apple-red text-white'
                    : 'bg-apple-red-light text-apple-red'
                )}
              >
                {confirmDelete ? 'Confirm — Move to Trash' : 'Move to Trash'}
              </button>
            )}
            <button type="submit" className={cn('apple-btn-primary flex items-center justify-center gap-2 py-3', investor ? 'flex-[2]' : 'w-full')}>
              <UserPlus size={17} strokeWidth={2.5} />
              {investor ? 'Save Changes' : 'Add Investor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
