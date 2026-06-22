import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'

export type UserRole = 'admin' | 'client'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
}

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string, role: UserRole) => Promise<string | null>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

// ── Mock admin for development (no Supabase needed) ──────────
const MOCK_ADMIN: AuthUser = { id: 'mock-admin', email: 'admin@matrices.lk', role: 'admin' }
const MOCK_PASSWORD = 'admin123'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (supabase) {
      // Real Supabase auth
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const role = (session.user.user_metadata?.role as UserRole) ?? 'admin'
          setUser({ id: session.user.id, email: session.user.email!, role })
        }
        setLoading(false)
      })
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const role = (session.user.user_metadata?.role as UserRole) ?? 'admin'
          setUser({ id: session.user.id, email: session.user.email!, role })
        } else {
          setUser(null)
        }
      })
      return () => subscription.unsubscribe()
    } else {
      // Mock: check localStorage
      const saved = localStorage.getItem('matrices_auth')
      if (saved) setUser(JSON.parse(saved))
      setLoading(false)
    }
  }, [])

  async function signIn(email: string, password: string, role: UserRole): Promise<string | null> {
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return error.message
      return null
    } else {
      // Mock auth
      if (email === MOCK_ADMIN.email && password === MOCK_PASSWORD && role === 'admin') {
        localStorage.setItem('matrices_auth', JSON.stringify(MOCK_ADMIN))
        setUser(MOCK_ADMIN)
        return null
      }
      return 'Invalid email or password.'
    }
  }

  async function signOut() {
    if (supabase) {
      await supabase.auth.signOut()
    }
    localStorage.removeItem('matrices_auth')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
