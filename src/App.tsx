import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import ClientDetail from './pages/ClientDetail'
import Reports from './pages/Reports'
import CFAuth from './pages/cf/CFAuth'
import CFLayout from './components/cf/CFLayout'
import CFDashboard from './pages/cf/CFDashboard'
import CFClientsList from './pages/cf/CFClientsList'
import CFClientDetail from './pages/cf/CFClientDetail'
import CFDebtsList from './pages/cf/CFDebtsList'
import type { ReactNode } from 'react'

function Spinner() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black gap-4">
      <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
      <p className="text-white/30 text-[13px]">Loading…</p>
    </div>
  )
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/"      element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard"       element={<Dashboard />} />
        <Route path="/clients"         element={<Clients />} />
        <Route path="/clients/:id"     element={<ClientDetail />} />
        <Route path="/reports"         element={<Reports />} />
        <Route path="*"                element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* ── Client Finances (standalone freelancer tracker) ── */}
      <Route path="/cf/auth" element={<CFAuth />} />
      <Route path="/cf" element={<CFLayout />}>
        <Route index             element={<Navigate to="/cf/dashboard" replace />} />
        <Route path="dashboard"  element={<CFDashboard />} />
        <Route path="clients"    element={<CFClientsList />} />
        <Route path="clients/:id" element={<CFClientDetail />} />
        <Route path="debts"      element={<CFDebtsList />} />
        <Route path="*"          element={<Navigate to="/cf/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  )
}
