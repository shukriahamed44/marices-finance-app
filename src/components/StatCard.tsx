import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

interface StatCardProps {
  label: string
  value: string
  sub?: string
  accent?: 'blue' | 'green' | 'red' | 'orange' | 'purple'
  icon?: ReactNode
  className?: string
}

const ACCENT_MAP = {
  blue:   { bg: 'bg-apple-blue-light',   text: 'text-apple-blue',   icon: 'bg-apple-blue'   },
  green:  { bg: 'bg-apple-green-light',  text: 'text-apple-green',  icon: 'bg-apple-green'  },
  red:    { bg: 'bg-apple-red-light',    text: 'text-apple-red',    icon: 'bg-apple-red'    },
  orange: { bg: 'bg-apple-orange-light', text: 'text-apple-orange', icon: 'bg-apple-orange' },
  purple: { bg: 'bg-apple-purple-light', text: 'text-apple-purple', icon: 'bg-apple-purple' },
}

export default function StatCard({ label, value, sub, accent = 'blue', icon, className }: StatCardProps) {
  const colors = ACCENT_MAP[accent]
  return (
    <div className={cn('apple-card p-5 flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-apple-label-2">{label}</span>
        {icon && (
          <div className={cn('w-8 h-8 rounded-[8px] flex items-center justify-center', colors.bg)}>
            <span className={colors.text}>{icon}</span>
          </div>
        )}
      </div>
      <div>
        <div className={cn('text-[26px] font-bold leading-none tracking-tight', colors.text)}>{value}</div>
        {sub && <div className="text-[12px] text-apple-label-3 mt-1">{sub}</div>}
      </div>
    </div>
  )
}
