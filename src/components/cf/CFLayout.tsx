import { useState } from 'react'
import { Outlet, NavLink, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { LayoutDashboard, Users, HandCoins, TrendingUp, Wallet, LogOut, X, Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { CFProvider } from '../../context/CFContext'
import { cfPageBg, cfTile, CF_ACTIVE_BG, CF_ACTIVE_BORDER, CF_ACTIVE_SHADOW } from './cfStyles'

const NAV = [
  { to: '/cf/dashboard',   icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/cf/clients',     icon: Users,           label: 'Clients'     },
  { to: '/cf/debts',       icon: HandCoins,       label: 'Debts'       },
  { to: '/cf/investments', icon: TrendingUp,      label: 'Investments' },
]

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  return (
    <nav className="flex-1 px-3 space-y-1">
      {NAV.map(({ to, icon: Icon, label }) => {
        const active = location.pathname === to || location.pathname.startsWith(to + '/')
        return (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[14px] font-medium transition-all"
            style={active
              ? { background: CF_ACTIVE_BG, color: '#fff', border: `1px solid ${CF_ACTIVE_BORDER}`, boxShadow: CF_ACTIVE_SHADOW }
              : { color: 'rgba(255,255,255,0.5)' }}
          >
            <Icon size={17} strokeWidth={active ? 2.5 : 2} />
            {label}
          </NavLink>
        )
      })}
    </nav>
  )
}

function SidebarInner({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <aside
      className="flex flex-col w-[230px] h-full shrink-0"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)', borderRight: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Logo */}
      <div className="px-5 pt-7 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[9px] flex items-center justify-center"
            style={{ background: CF_ACTIVE_BG, border: `1px solid ${CF_ACTIVE_BORDER}`, boxShadow: CF_ACTIVE_SHADOW }}>
            <Wallet size={15} className="text-white" strokeWidth={2.2} />
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-semibold text-white leading-none">Client Finances</div>
            <div className="text-[11px] text-white/35 leading-none mt-1">Freelancer Tracker</div>
          </div>
          {onClose && (
            <button onClick={onClose} className="md:hidden w-7 h-7 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <NavItems onNavigate={onClose} />

      {/* User + sign out */}
      <div className="px-3 pb-5">
        <div className="rounded-[14px] p-3 flex items-center gap-2.5" style={cfTile}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
            style={{ background: CF_ACTIVE_BG, border: `1px solid ${CF_ACTIVE_BORDER}` }}>
            {user?.email?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-white truncate">{user?.email?.split('@')[0] ?? 'User'}</div>
            <div className="text-[11px] text-white/35 truncate">{user?.email}</div>
          </div>
          <button onClick={handleSignOut} title="Sign out" className="w-7 h-7 flex items-center justify-center rounded-full text-white/40 hover:text-[#FF453A] hover:bg-white/10 transition-colors">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default function CFLayout() {
  const { user, loading } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={cfPageBg}>
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
      </div>
    )
  }
  if (!user) return <Navigate to="/cf/auth" replace />

  return (
    <CFProvider>
      <div className="fixed inset-0 flex overflow-hidden" style={cfPageBg}>
        {/* Mobile top bar */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-12 flex items-center px-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={() => setDrawerOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-[10px] text-white/70 hover:bg-white/10">
            <Menu size={20} />
          </button>
          <span className="ml-3 text-[16px] font-semibold text-white">Client Finances</span>
        </div>

        {/* Mobile drawer backdrop */}
        {drawerOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]" onClick={() => setDrawerOpen(false)} />
        )}

        {/* Sidebar */}
        <div className={`fixed md:static inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out ${drawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <SidebarInner onClose={() => setDrawerOpen(false)} />
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto pt-12 md:pt-0">
          <Outlet />
        </main>
      </div>
    </CFProvider>
  )
}
