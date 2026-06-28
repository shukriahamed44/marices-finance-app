// Shared dark liquid-glass styles for the Client Finances section.
import type { CSSProperties } from 'react'

// Full-page ambient dark background (teal/blue accent to distinguish from the
// purple investor Finances area).
export const cfPageBg: CSSProperties = {
  background:
    'radial-gradient(ellipse at 18% 50%, rgba(0,150,136,0.32) 0%, transparent 52%), ' +
    'radial-gradient(ellipse at 85% 15%, rgba(0,113,227,0.26) 0%, transparent 50%), ' +
    'radial-gradient(ellipse at 55% 90%, rgba(94,92,230,0.18) 0%, transparent 48%), ' +
    '#060608',
}

// Standard glass tile.
export const cfTile: CSSProperties = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.04) 100%)',
  backdropFilter: 'blur(28px) saturate(160%)',
  WebkitBackdropFilter: 'blur(28px) saturate(160%)',
  border: '1px solid rgba(255,255,255,0.11)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.13)',
  borderRadius: 20,
}

// Brighter hero glass.
export const cfHero: CSSProperties = {
  background: 'linear-gradient(145deg, rgba(0,200,160,0.26) 0%, rgba(0,113,227,0.20) 60%, rgba(255,255,255,0.06) 100%)',
  backdropFilter: 'blur(32px) saturate(180%)',
  WebkitBackdropFilter: 'blur(32px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 0 60px rgba(0,170,140,0.22), 0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.22)',
  borderRadius: 24,
}

// Glass input.
export const cfInput: CSSProperties = {
  background: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '12px',
  color: '#fff',
  outline: 'none',
}

export const cfInputRing = 'focus:ring-2 focus:ring-white/20 focus:border-white/25'

// Primary action button background.
export const cfPrimaryBtn: CSSProperties = {
  background: 'linear-gradient(135deg, rgba(0,200,160,0.9), rgba(0,113,227,0.9))',
  boxShadow: '0 8px 24px rgba(0,170,140,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
  border: '1px solid rgba(255,255,255,0.15)',
}

export const cfLabel = 'text-white/40 text-[11px] font-semibold uppercase tracking-widest'

// Accent colors (Apple system palette).
export const CF_GREEN = '#34C759'
export const CF_RED   = '#FF453A'
export const CF_BLUE  = '#0A84FF'
export const CF_AMBER = '#FF9F0A'
