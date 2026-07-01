import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, Eye, EyeOff, ChevronLeft } from 'lucide-react'
import { supabase } from '../../lib/supabase'

type Mode = 'signin' | 'signup'

export default function CFAuth() {
  const navigate = useNavigate()
  const [mode, setMode]         = useState<Mode>('signin')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]       = useState('')
  const [info, setInfo]         = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) return setError('Enter your email and password.')
    if (mode === 'signup' && password.length < 6) return setError('Password must be at least 6 characters.')
    setError(''); setInfo(''); setLoading(true)

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      setLoading(false)
      if (error) return setError(error.message)
      navigate('/cf/dashboard')
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      setLoading(false)
      if (error) return setError(error.message)
      if (data.session) {
        navigate('/cf/dashboard')
      } else {
        // Email-confirmation flow is enabled in Supabase.
        setInfo('Account created. Check your email to confirm, then sign in.')
        setMode('signin')
      }
    }
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
      className="fixed inset-0 flex items-center justify-center px-4 overflow-y-auto py-10"
      style={{ background: '#000' }}
    >
      {/* Back to landing */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors text-[14px] font-medium"
      >
        <ChevronLeft size={16} /> Back
      </button>

      {/* Glass card */}
      <div
        className="w-full max-w-[380px] rounded-[28px] overflow-hidden p-8 my-auto"
        style={{
          background: 'linear-gradient(160deg, rgba(255,255,255,0.065) 0%, rgba(0,0,0,0.88) 60%)',
          backdropFilter: 'blur(56px) saturate(200%)',
          WebkitBackdropFilter: 'blur(56px) saturate(200%)',
          border: '1px solid rgba(255,255,255,0.11)',
          boxShadow: [
            'inset 0 2px 0 rgba(255,255,255,0.18)',
            'inset 1px 0 0 rgba(180,100,255,0.08)',
            'inset -1px 0 0 rgba(80,210,255,0.08)',
            '0 32px 80px rgba(0,0,0,0.95)',
          ].join(', '),
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-[16px] flex items-center justify-center mb-4 shadow-xl"
            style={{ background: 'linear-gradient(180deg, rgba(255,195,70,0.18) 0%, rgba(220,140,30,0.08) 48%, rgba(14,8,0,0.72) 49%, rgba(0,0,0,0.58) 100%)', border: '1px solid rgba(255,245,210,0.22)', boxShadow: 'inset 0 1.5px 0 rgba(255,252,240,0.55), 0 8px 24px rgba(0,0,0,0.5)' }}>
            <Wallet size={24} className="text-white" strokeWidth={1.8} />
          </div>
          <h1 className="text-[22px] font-bold text-white tracking-tight">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-[13px] text-white/40 mt-1">Client Finances · Freelancer Tracker</p>
        </div>

        {/* Mode toggle */}
        <div className="mb-6 p-1 rounded-[12px] flex" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
          {(['signin', 'signup'] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(''); setInfo('') }}
              className="flex-1 py-2 rounded-[9px] text-[14px] font-semibold transition-all duration-200"
              style={mode === m
                ? { background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.10))', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.15)' }
                : { color: 'rgba(255,255,255,0.35)', border: '1px solid transparent' }
              }
            >
              {m === 'signin' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email */}
          <div>
            <label className="block text-[12px] font-medium text-white/40 uppercase tracking-wide mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={`w-full px-4 py-3 text-[15px] placeholder-white/20 ${glassFocusRing}`}
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
                className={`w-full px-4 py-3 pr-12 text-[15px] placeholder-white/20 ${glassFocusRing}`}
                style={glassInput}
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
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

          {/* Error / info */}
          {error && (
            <div className="px-4 py-3 rounded-[12px] text-[13px] text-red-300" style={{ background: 'rgba(255,59,48,0.12)', border: '1px solid rgba(255,59,48,0.2)' }}>
              {error}
            </div>
          )}
          {info && (
            <div className="px-4 py-3 rounded-[12px] text-[13px] text-emerald-200" style={{ background: 'rgba(52,199,89,0.12)', border: '1px solid rgba(52,199,89,0.2)' }}>
              {info}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-[14px] text-[16px] font-semibold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: 'linear-gradient(180deg, rgba(255,195,70,0.18) 0%, rgba(220,140,30,0.08) 46%, rgba(14,8,0,0.74) 47%, rgba(0,0,0,0.60) 100%)',
              border: '1px solid rgba(255,245,210,0.22)',
              boxShadow: 'inset 0 1.5px 0 rgba(255,252,240,0.58), inset 0 -1px 0 rgba(0,0,0,0.55), 0 0 16px rgba(200,140,30,0.14), 0 4px 16px rgba(0,0,0,0.55)',
            }}
          >
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-[12px] text-white/30 mt-5 leading-relaxed">
          {mode === 'signin' ? "Don't have an account? " : 'Already registered? '}
          <button
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setInfo('') }}
            className="text-white/60 hover:text-white font-medium transition-colors"
          >
            {mode === 'signin' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  )
}
