import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, BarChart2, Shield, Zap, Users, Download,
  ArrowUpRight, Clock, Lock, ChevronRight, Activity,
} from 'lucide-react'

// ─── Shared glass tile styles ────────────────────────────────
const tile = (extra = ''): React.CSSProperties => ({
  background: 'linear-gradient(145deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)',
  backdropFilter: 'blur(28px) saturate(160%)',
  WebkitBackdropFilter: 'blur(28px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.11)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.13)',
  borderRadius: 20,
  ...(extra ? {} : {}),
})

const heroBg: React.CSSProperties = {
  background: 'linear-gradient(145deg, rgba(94,92,230,0.28) 0%, rgba(0,113,227,0.22) 60%, rgba(255,255,255,0.06) 100%)',
  backdropFilter: 'blur(32px) saturate(180%)',
  WebkitBackdropFilter: 'blur(32px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 0 60px rgba(94,92,230,0.25), 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.22)',
  borderRadius: 24,
}

const label = 'text-white/40 text-[11px] font-semibold uppercase tracking-widest'
const bigNum = 'text-white font-bold leading-none tracking-tight'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div
      className="fixed inset-0 overflow-hidden flex flex-col"
      style={{
        background:
          'radial-gradient(ellipse at 18% 55%, rgba(99,40,210,0.42) 0%, transparent 52%), ' +
          'radial-gradient(ellipse at 82% 18%, rgba(0,90,255,0.32) 0%, transparent 50%), ' +
          'radial-gradient(ellipse at 55% 88%, rgba(0,180,150,0.2) 0%, transparent 48%), ' +
          '#060608',
      }}
    >
      {/* Ambient glow layers */}
      <div className="absolute top-[25%] left-[8%] w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(110,60,255,0.16) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-[20%] right-[12%] w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,120,255,0.15) 0%, transparent 70%)', filter: 'blur(55px)' }} />

      {/* Nav */}
      <nav className="shrink-0 flex items-center justify-between px-8 py-4 z-10"
        style={{ background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-[7px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #5E5CE6, #0071E3)' }}>
            <TrendingUp size={14} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-semibold text-[15px] tracking-tight">Matrices</span>
        </div>
        <button onClick={() => navigate('/login')}
          className="text-[13px] font-medium text-white/50 hover:text-white/80 transition-colors flex items-center gap-1">
          Sign In <ChevronRight size={14} />
        </button>
      </nav>

      {/* Bento Grid */}
      <div className="flex-1 p-5 overflow-hidden">
        <div
          className="h-full w-full grid gap-3"
          style={{
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridTemplateRows: 'repeat(3, 1fr)',
          }}
        >

          {/* ── HERO: Finances ── spans col 2-4, rows 1-3 */}
          <div
            className="relative overflow-hidden flex flex-col justify-between p-7 cursor-pointer group"
            style={{ ...heroBg, gridColumn: '2 / 5', gridRow: '1 / 4' }}
            onClick={() => navigate('/login')}
          >
            {/* Background glow orb */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(94,92,230,0.35) 0%, transparent 70%)', filter: 'blur(40px)' }} />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,113,227,0.3) 0%, transparent 70%)', filter: 'blur(50px)' }} />

            {/* Top label */}
            <div>
              <div className={label}>Matrices · Finance Platform</div>
              <div className="w-12 h-12 rounded-[13px] flex items-center justify-center mt-4"
                style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08))', border: '1px solid rgba(255,255,255,0.2)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)' }}>
                <TrendingUp size={22} className="text-white" strokeWidth={1.8} />
              </div>
            </div>

            {/* Center wordmark */}
            <div className="text-center">
              <div className="text-[56px] font-black tracking-[-3px] leading-none"
                style={{ background: 'linear-gradient(160deg, #fff 0%, rgba(255,255,255,0.55) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Finances
              </div>
              <div className="text-[15px] text-white/40 mt-2 font-light tracking-wide">
                Investment Management Portal
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[28px] font-bold text-white leading-none">LKR 9.2M+</div>
                <div className="text-[12px] text-white/40 mt-0.5">Total assets under management</div>
              </div>
              <button
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-[14px] font-semibold text-white transition-all duration-200 group-hover:scale-[1.02] active:scale-[0.97]"
                style={{ background: 'linear-gradient(135deg, rgba(94,92,230,0.9), rgba(0,113,227,0.9))', boxShadow: '0 8px 24px rgba(94,92,230,0.4), inset 0 1px 0 rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                Open Dashboard
                <ArrowUpRight size={15} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* ── Col 1 tiles ──────────────────── */}

          {/* Tile: AUM */}
          <div className="flex flex-col justify-between p-5 overflow-hidden relative" style={{ ...tile(), gridColumn: '1', gridRow: '1' }}>
            <div className={label}>Assets</div>
            <div>
              <div className={`${bigNum} text-[26px]`}>9.2M</div>
              <div className="text-white/35 text-[12px] mt-0.5">LKR</div>
            </div>
            <div className="flex items-center gap-1 text-[#34C759] text-[12px] font-semibold">
              <ArrowUpRight size={13} /> Active
            </div>
          </div>

          {/* Tile: Investors */}
          <div className="flex flex-col justify-between p-5" style={{ ...tile(), gridColumn: '1', gridRow: '2' }}>
            <div className="flex items-center justify-between">
              <div className={label}>Clients</div>
              <Users size={16} className="text-white/30" />
            </div>
            <div className={`${bigNum} text-[32px]`}>9</div>
            <div className="text-white/35 text-[12px]">Active investors</div>
          </div>

          {/* Tile: Avg Return */}
          <div className="flex flex-col justify-between p-5 relative overflow-hidden" style={{ ...tile(), gridColumn: '1', gridRow: '3' }}>
            <div className={label}>Avg. Return</div>
            <div className={`${bigNum} text-[36px]`} style={{ color: '#34C759' }}>7%</div>
            <div className="text-white/35 text-[12px]">Annual rate</div>
          </div>

          {/* ── Col 5 tiles ──────────────────── */}

          {/* Tile: Security */}
          <div className="flex flex-col justify-between p-5" style={{ ...tile(), gridColumn: '5', gridRow: '1' }}>
            <div className="flex items-center justify-between">
              <div className={label}>Security</div>
              <Shield size={15} className="text-white/30" />
            </div>
            <div className="w-9 h-9 rounded-[10px] flex items-center justify-center"
              style={{ background: 'rgba(52,199,89,0.15)', border: '1px solid rgba(52,199,89,0.2)' }}>
              <Lock size={18} className="text-[#34C759]" />
            </div>
            <div className="text-[12px] text-white/40 leading-tight">Role-based<br />access control</div>
          </div>

          {/* Tile: Real-time */}
          <div className="flex flex-col justify-between p-5 relative overflow-hidden" style={{ ...tile(), gridColumn: '5', gridRow: '2' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#34C759]" style={{ boxShadow: '0 0 6px #34C759' }} />
              <div className={label}>Live</div>
            </div>
            <Zap size={28} className="text-[#FF9500]" strokeWidth={1.5} />
            <div className="text-[12px] text-white/40 leading-tight">Real-time<br />balance sync</div>
          </div>

          {/* Tile: Audit */}
          <div className="flex flex-col justify-between p-5" style={{ ...tile(), gridColumn: '5', gridRow: '3' }}>
            <div className={label}>Audit</div>
            <Activity size={26} className="text-white/30" strokeWidth={1.5} />
            <div className="text-[12px] text-white/40 leading-tight">Full transaction<br />audit trail</div>
          </div>

          {/* ── Col 6 tiles ──────────────────── */}

          {/* Tile: Reports */}
          <div className="flex flex-col justify-between p-5 relative overflow-hidden" style={{ ...tile(), gridColumn: '6', gridRow: '1' }}>
            <div className={label}>Reports</div>
            <BarChart2 size={26} className="text-[#0071E3]" strokeWidth={1.5} />
            <div className="text-[12px] text-white/40 leading-tight">Charts &<br />analytics</div>
          </div>

          {/* Tile: Export */}
          <div className="flex flex-col justify-between p-5" style={{ ...tile(), gridColumn: '6', gridRow: '2' }}>
            <div className={label}>Export</div>
            <Download size={26} className="text-white/30" strokeWidth={1.5} />
            <div className="text-[12px] text-white/40 leading-tight">CSV & PDF<br />export</div>
          </div>

          {/* Tile: Fast Entry */}
          <div className="flex flex-col justify-between p-5" style={{ ...tile(), gridColumn: '6', gridRow: '3' }}>
            <div className={label}>Entry</div>
            <Clock size={26} className="text-[#AF52DE]" strokeWidth={1.5} />
            <div className="text-[12px] text-white/40 leading-tight">Fast<br />transaction entry</div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="shrink-0 text-center pb-3 text-[11px] text-white/15">
        Matrices Investment Group · Private · {new Date().getFullYear()}
      </div>
    </div>
  )
}
