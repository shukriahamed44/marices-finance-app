import { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import type { Transaction, TransactionType } from '../lib/types'
import { TRANSACTION_LABELS } from '../lib/types'
import { cn } from '../lib/utils'

interface Props {
  open: boolean
  transaction: Transaction | null
  onClose: () => void
  onSave: (id: string, patch: Partial<Transaction>) => void
  onDelete: (id: string) => void
}

const TYPES_IN:  TransactionType[] = ['investment_capital', 'additional_capital']
const TYPES_OUT: TransactionType[] = ['capital_return', 'profit_return', 'loan', 'adjustment']

export default function EditTransactionModal({ open, transaction, onClose, onSave, onDelete }: Props) {
  const [type, setType]       = useState<TransactionType>('investment_capital')
  const [amount, setAmount]   = useState('')
  const [date, setDate]       = useState('')
  const [purpose, setPurpose] = useState('')
  const [notes, setNotes]     = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (transaction && open) {
      setType(transaction.type)
      setAmount(String(transaction.amount))
      setDate(transaction.date)
      setPurpose(transaction.purpose ?? '')
      setNotes(transaction.notes ?? '')
      setConfirmDelete(false)
    }
  }, [transaction, open])

  if (!open || !transaction) return null

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!transaction) return
    onSave(transaction.id, {
      type,
      amount: Number(amount),
      date,
      purpose: purpose || null,
      notes: notes || null,
    })
    onClose()
  }

  function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return }
    onDelete(transaction!.id)
    onClose()
  }

  const types = transaction.direction === 'in' ? TYPES_IN : TYPES_OUT

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-white rounded-t-[24px] sm:rounded-[20px] shadow-apple-lg overflow-hidden">
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-apple-surface-3" />
        </div>
        <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-apple-separator">
          <h2 className="text-[17px] font-semibold text-apple-label">Edit Transaction</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-apple-surface-2 flex items-center justify-center hover:bg-apple-surface-3">
            <X size={15} className="text-apple-label-2" />
          </button>
        </div>
        <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
          {/* Direction badge (readonly) */}
          <div className="flex items-center gap-2">
            <span className={cn('apple-badge text-[12px]', transaction.direction === 'in' ? 'bg-apple-green-light text-apple-green' : 'bg-apple-orange-light text-apple-orange')}>
              {transaction.direction === 'in' ? '↑ Money In' : '↓ Money Out'}
            </span>
            <span className="text-[12px] text-apple-label-3">Direction cannot be changed</span>
          </div>

          {/* Type */}
          <div>
            <label className="apple-label">Type</label>
            <select value={type} onChange={e => setType(e.target.value as TransactionType)} className="apple-input appearance-none">
              {types.map(t => <option key={t} value={t}>{TRANSACTION_LABELS[t]}</option>)}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="apple-label">Amount (LKR)</label>
            <input value={amount} onChange={e => setAmount(e.target.value)} className="apple-input text-[18px] font-bold" inputMode="numeric" />
          </div>

          {/* Date */}
          <div>
            <label className="apple-label">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="apple-input" />
          </div>

          {/* Purpose */}
          {transaction.direction === 'in' && (
            <div>
              <label className="apple-label">Purpose</label>
              <input value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="Business purpose…" className="apple-input" />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="apple-label">Notes</label>
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes…" className="apple-input" />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={handleDelete}
              className={cn('flex-1 py-3 rounded-apple text-[15px] font-semibold transition-all active:scale-[0.98]',
                confirmDelete
                  ? 'bg-apple-red text-white'
                  : 'bg-apple-red-light text-apple-red'
              )}
            >
              {confirmDelete ? 'Confirm Delete' : 'Delete'}
            </button>
            <button type="submit" className="apple-btn-primary flex-[2] flex items-center justify-center gap-2 py-3">
              <Save size={15} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
