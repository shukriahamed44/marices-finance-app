import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Users, BarChart2, TrendingUp, LogOut, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clients',   icon: Users,           label: 'Clients'   },
  { to: '/reports',   icon: BarChart2,       label: 'Reports'   },
]

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { balances } = useApp()
  const { user, signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const totalAUM = balances
    .filter(b => b.status === 'active')
    .reduce((s, b) => s + b.remaining_balance, 0)

  return (
    <aside className="flex flex-col w-[220px] min-h-screen bg-white/80 backdrop-blur-apple border-r border-apple-separator shrink-0">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[8px] bg-apple-blue flex items-center justify-center shadow-apple">
            <TrendingUp size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-semibold text-apple-label leading-none">Matrices</div>
            <div className="text-[11px] text-apple-label-3 leading-none mt-0.5">Finance</div>
          </div>
          {/* Close button — mobile drawer only */}
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden w-7 h-7 flex items-center justify-center rounded-full hover:bg-apple-surface-2 text-apple-label-3"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to))
          return (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[14px] font-medium transition-all',
                active
                  ? 'bg-apple-blue text-white shadow-apple'
                  : 'text-apple-label-2 hover:bg-apple-surface-2 hover:text-apple-label'
              )}
            >
              <Icon size={17} strokeWidth={active ? 2.5 : 2} />
              {label}
            </NavLink>
          )
        })}
      </nav>

      {/* User + signout */}
      <div className="px-4 pb-4">
        <div className="bg-apple-surface-2 rounded-apple p-3 flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-apple-blue flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            {user?.email?.[0]?.toUpperCase() ?? 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-apple-label truncate capitalize">{user?.role ?? 'admin'}</div>
            <div className="text-[11px] text-apple-label-3 truncate">{user?.email}</div>
          </div>
          <button onClick={handleSignOut} title="Sign out" className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-apple-surface-3 text-apple-label-3 hover:text-apple-red transition-colors">
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* AUM card at bottom */}
      <div className="px-4 pb-6">
        <div className="bg-apple-surface-2 rounded-apple p-4">
          <div className="text-[11px] font-medium text-apple-label-3 uppercase tracking-wide mb-1">Total AUM</div>
          <div className="text-[18px] font-bold text-apple-label leading-none">
            {new Intl.NumberFormat('en-LK', { notation: 'compact', maximumFractionDigits: 1 }).format(totalAUM)}
          </div>
          <div className="text-[11px] text-apple-label-3 mt-0.5">LKR</div>
        </div>
      </div>
    </aside>
  )
}
