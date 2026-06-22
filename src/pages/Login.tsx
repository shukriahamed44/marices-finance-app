import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Eye, EyeOff, ChevronLeft, Lock } from 'lucide-react'
import { useAuth, type UserRole } from '../context/AuthContext'

export default function Login() {
  const { signIn }      = useAuth()
  const navigate        = useNavigate()
  const [role, setRole] = useState<UserRole>('admin')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) return setError('Enter your email and password.')
    setError(''); setLoading(true)
    const err = await signIn(email, password, role)
    setLoading(false)
    if (err) return setError(err)
    navigate('/dashboard')
  }

  const glassInput = {
    background: 'rgba(255,255,255,0.06)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    color: '#fff',
    outline: 'none',
  } as React.CSSProperties

  const glassFocusRing = 'focus:ring-2 focus:ring-white/20 focus:border-white/25'

  return (
    <div
      className="fixed inset-0 flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse at 20% 40%, rgba(99,40,210,0.5) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(0,90,255,0.35) 0%, transparent 50%), radial-gradient(ellipse at 60% 85%, rgba(0,180,150,0.2) 0%, transparent 50%), #000' }}
    >
      {/* Ambient orbs */}
      <div className="absolute top-[20%] left-[10%] w-72 h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(120,60,255,0.2) 0%, transparent 70%)', filter: 'blur(50px)' }} />
      <div className="absolute bottom-[15%] right-[10%] w-60 h-60 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(0,150,255,0.2) 0%, transparent 70%)', filter: 'blur(45px)' }} />

      {/* Back to landing */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors text-[14px] font-medium"
      >
        <ChevronLeft size={16} /> Back
      </button>

      {/* Glass card */}
      <div
        className="w-full max-w-[380px] rounded-[28px] overflow-hidden p-8"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-[16px] flex items-center justify-center mb-4 shadow-xl"
            style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.2), rgba(255,255,255,0.07))', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)' }}>
            <TrendingUp size={26} className="text-white" strokeWidth={1.8} />
          </div>
          <h1 className="text-[22px] font-bold text-white tracking-tight">Sign In</h1>
          <p className="text-[13px] text-white/40 mt-1">Matrices Finance Portal</p>
        </div>

        {/* Role toggle */}
        <div className="mb-6 p-1 rounded-[12px] flex" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {(['admin', 'client'] as UserRole[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => { setRole(r); setError('') }}
              className="flex-1 py-2 rounded-[9px] text-[14px] font-semibold capitalize transition-all duration-200"
              style={role === r
                ? { background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.10))', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.15)' }
                : { color: 'rgba(255,255,255,0.35)', border: '1px solid transparent' }
              }
            >
              {r === 'admin' ? '⌘ Admin' : '👤 Client'}
            </button>
          ))}
        </div>

        {/* Client notice */}
        {role === 'client' && (
          <div className="mb-5 px-4 py-3 rounded-[12px] text-[13px] text-white/50 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <Lock size={13} className="inline mb-0.5 mr-1.5" />
            Client portal coming soon
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email */}
          <div>
            <label className="block text-[12px] font-medium text-white/40 uppercase tracking-wide mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={role === 'admin' ? 'admin@matrices.lk' : 'your@email.com'}
              disabled={role === 'client'}
              className={`w-full px-4 py-3 text-[15px] placeholder-white/20 ${glassFocusRing} disabled:opacity-40`}
              style={glassInput}
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[12px] font-medium text-white/40 uppercase tracking-wide mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={role === 'client'}
                className={`w-full px-4 py-3 pr-12 text-[15px] placeholder-white/20 ${glassFocusRing} disabled:opacity-40`}
                style={glassInput}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-[12px] text-[13px] text-red-300" style={{ background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.2)' }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || role === 'client'}
            className="w-full mt-2 py-3.5 rounded-[14px] text-[16px] font-semibold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(135deg, rgba(94,92,230,0.9), rgba(0,113,227,0.9))',
              boxShadow: '0 8px 24px rgba(94,92,230,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Dev hint */}
        <p className="text-center text-[11px] text-white/20 mt-5 leading-relaxed">
          Dev mode: admin@matrices.lk / admin123
        </p>
      </div>
    </div>
  )
}
