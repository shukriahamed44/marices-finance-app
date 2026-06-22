import { useState, useEffect, useRef } from 'react'
import { X, Plus } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { TransactionType } from '../lib/types'
import { TRANSACTION_LABELS } from '../lib/types'
import { cn } from '../lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  defaultInvestorId?: string
}

const TYPES_IN:  TransactionType[] = ['investment_capital', 'additional_capital']
const TYPES_OUT: TransactionType[] = ['capital_return', 'profit_return', 'loan', 'adjustment']

export default function TransactionModal({ open, onClose, defaultInvestorId }: Props) {
  const { investors, addTransaction } = useApp()
  const [direction, setDirection]     = useState<'in' | 'out'>('in')
  const [type, setType]               = useState<TransactionType>('investment_capital')
  const [investorId, setInvestorId]   = useState(defaultInvestorId ?? '')
  const [amount, setAmount]           = useState('')
  const [date, setDate]               = useState(new Date().toISOString().split('T')[0])
  const [purpose, setPurpose]         = useState('')
  const [notes, setNotes]             = useState('')
  const [error, setError]             = useState('')
  const amountRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setInvestorId(defaultInvestorId ?? '')
      setAmount(''); setPurpose(''); setNotes(''); setError('')
      setDirection('in'); setType('investment_capital')
      setDate(new Date().toISOString().split('T')[0])
      setTimeout(() => amountRef.current?.focus(), 80)
    }
  }, [open, defaultInvestorId])

  useEffect(() => {
    setType(direction === 'in' ? 'investment_capital' : 'capital_return')
  }, [direction])

  const activeInvestors = investors.filter(i => i.status !== 'placeholder')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!investorId)         return setError('Select an investor.')
    if (!amount || isNaN(Number(amount.replace(/,/g, ''))) || Number(amount.replace(/,/g, '')) <= 0)
      return setError('Enter a valid amount.')

    addTransaction({
      investor_id: investorId,
      date,
      type,
      direction,
      amount: Number(amount.replace(/,/g, '')),
      purpose: purpose || null,
      notes: notes || null,
    })
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-[24px] sm:rounded-[20px] shadow-apple-lg overflow-hidden">
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-apple-surface-3" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-3 border-b border-apple-separator">
          <h2 className="text-[17px] font-semibold text-apple-label">New Transaction</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-apple-surface-2 flex items-center justify-center hover:bg-apple-surface-3">
            <X size={15} className="text-apple-label-2" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Direction toggle */}
          <div className="bg-apple-surface-2 rounded-[10px] p-1 flex">
            {(['in', 'out'] as const).map(d => (
              <button
                key={d}
                type="button"
                onClick={() => setDirection(d)}
                className={cn(
                  'flex-1 py-2 rounded-[8px] text-[14px] font-semibold transition-all',
                  direction === d
                    ? d === 'in'
                      ? 'bg-apple-green text-white shadow-apple'
                      : 'bg-apple-red text-white shadow-apple'
                    : 'text-apple-label-2'
                )}
              >
                {d === 'in' ? '↑ Money In' : '↓ Money Out'}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="apple-label">Amount (LKR)</label>
            <input
              ref={amountRef}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              className="apple-input text-[22px] font-bold tracking-tight"
              inputMode="numeric"
            />
          </div>

          {/* Investor */}
          <div>
            <label className="apple-label">Investor</label>
            <select value={investorId} onChange={e => setInvestorId(e.target.value)} className="apple-input appearance-none">
              <option value="">Select investor…</option>
              {activeInvestors.map(i => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="apple-label">Type</label>
            <select value={type} onChange={e => setType(e.target.value as TransactionType)} className="apple-input appearance-none">
              {(direction === 'in' ? TYPES_IN : TYPES_OUT).map(t => (
                <option key={t} value={t}>{TRANSACTION_LABELS[t]}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="apple-label">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="apple-input" />
          </div>

          {/* Purpose */}
          {direction === 'in' && (
            <div>
              <label className="apple-label">Purpose / Business</label>
              <input value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="e.g. Phone Auction, Rental…" className="apple-input" />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="apple-label">Notes</label>
            <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional details…" className="apple-input" />
          </div>

          {error && <p className="text-[13px] text-apple-red font-medium">{error}</p>}

          <button type="submit" className="apple-btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2">
            <Plus size={17} strokeWidth={2.5} />
            Add Transaction
          </button>
        </form>
      </div>
    </div>
  )
}
