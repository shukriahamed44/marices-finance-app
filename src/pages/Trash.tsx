import { useState } from 'react'
import { RotateCcw, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { formatCurrency, formatDate, getAvatarColor, getInitials, cn } from '../lib/utils'

export default function Trash() {
  const { trashedBalances, investors, restoreInvestor, permanentlyDeleteInvestor } = useApp()
  const [confirmId, setConfirmId] = useState<string | null>(null)

  function handlePermanentDelete(id: string) {
    if (confirmId !== id) { setConfirmId(id); return }
    permanentlyDeleteInvestor(id)
    setConfirmId(null)
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl">
      <div className="mb-6 md:mb-8">
        <h1 className="text-[26px] md:text-[32px] font-bold text-apple-label tracking-tight">Trash</h1>
        <p className="text-[15px] text-apple-label-2 mt-1">{trashedBalances.length} deleted client{trashedBalances.length === 1 ? '' : 's'}</p>
      </div>

      <div className="apple-card overflow-hidden">
        {trashedBalances.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-apple-label-3">
            <Trash2 size={32} className="mb-3" />
            <p className="text-[15px] font-medium">Trash is empty</p>
            <p className="text-[13px] mt-1">Deleted clients will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-apple-separator">
            {trashedBalances.map((b) => {
              const investor = investors.find(i => i.id === b.id)
              const isConfirming = confirmId === b.id
              return (
                <div key={b.id} className="flex items-center gap-4 px-4 md:px-6 py-5">
                  <div className={cn('w-12 h-12 rounded-full flex items-center justify-center text-white text-[14px] font-bold shrink-0 opacity-60', getAvatarColor(b.name))}>
                    {getInitials(b.name)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[16px] font-semibold text-apple-label">{b.name}</div>
                    <div className="text-[13px] text-apple-label-2 mt-0.5">
                      Remaining LKR {formatCurrency(b.remaining_balance)}
                      {investor?.deleted_at && <> · Deleted {formatDate(investor.deleted_at)}</>}
                    </div>
                    {investor?.notes && <div className="text-[12px] text-apple-label-3 mt-0.5 truncate">{investor.notes}</div>}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => restoreInvestor(b.id)}
                      className="apple-btn-secondary flex items-center gap-1.5 text-[13px]"
                    >
                      <RotateCcw size={13} />
                      <span className="hidden sm:inline">Restore</span>
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(b.id)}
                      className={cn('flex items-center gap-1.5 text-[13px] font-semibold px-3 py-2 rounded-apple transition-all active:scale-[0.98]',
                        isConfirming ? 'bg-apple-red text-white' : 'bg-apple-red-light text-apple-red'
                      )}
                    >
                      <Trash2 size={13} />
                      <span className="hidden sm:inline">{isConfirming ? 'Confirm Forever' : 'Delete Forever'}</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
