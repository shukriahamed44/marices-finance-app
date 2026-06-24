import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-apple-bg">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-11 bg-white/80 backdrop-blur-apple border-b border-apple-separator flex items-center px-4">
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-[10px] hover:bg-apple-surface-2 text-apple-label"
        >
          <Menu size={20} />
        </button>
        <span className="ml-3 text-[17px] font-semibold text-apple-label">Matrices</span>
      </div>

      {/* Mobile drawer backdrop */}
      {drawerOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Sidebar — desktop: static | mobile: drawer */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50
        transition-transform duration-300 ease-in-out
        ${drawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar onClose={() => setDrawerOpen(false)} />
      </div>

      <main className="flex-1 overflow-auto pt-11 md:pt-0">
        <Outlet />
      </main>
    </div>
  )
}
