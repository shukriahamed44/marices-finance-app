// Shared dark liquid-glass styles for the Client Finances section.
// Design language: pure black background, Apple-standard liquid glass tiles
// with iridescent edge refractions (prism shimmer on borders).
import type { CSSProperties } from 'react'

// Pure black page background — no ambient colour blobs.
export const cfPageBg: CSSProperties = {
  background: '#000',
}

// Iridescent edge shimmer reused across tiles and modal panels.
// Simulates light refracting through glass edges (violet left, cyan right, warm bottom, white top).
const PRISM_SHADOW = [
  'inset 0 1.5px 0 rgba(255,255,255,0.18)',    // top specular — the main glass highlight
  'inset 0 -1px 0 rgba(255,100,140,0.06)',      // bottom warm (refracted red-ish)
  'inset 1px 0 0 rgba(180,100,255,0.07)',       // left violet edge
  'inset -1px 0 0 rgba(80,210,255,0.07)',       // right cyan edge
].join(', ')

// Standard glass tile.
export const cfTile: CSSProperties = {
  background: 'linear-gradient(160deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.018) 100%)',
  backdropFilter: 'blur(40px) saturate(180%)',
  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
  border: '1px solid rgba(255,255,255,0.09)',
  boxShadow: `${PRISM_SHADOW}, 0 4px 28px rgba(0,0,0,0.85)`,
  borderRadius: 20,
}

// Elevated hero glass panel — slightly brighter specular, deeper shadow.
export const cfHero: CSSProperties = {
  background: 'linear-gradient(160deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 100%)',
  backdropFilter: 'blur(48px) saturate(200%)',
  WebkitBackdropFilter: 'blur(48px) saturate(200%)',
  border: '1px solid rgba(255,255,255,0.12)',
  boxShadow: [
    'inset 0 2px 0 rgba(255,255,255,0.22)',     // strong top specular
    'inset 0 -1px 0 rgba(255,100,140,0.07)',
    'inset 1px 0 0 rgba(200,100,255,0.09)',
    'inset -1px 0 0 rgba(80,210,255,0.09)',
    '0 0 0 0.5px rgba(255,255,255,0.05)',       // faint outer ring
    '0 8px 48px rgba(0,0,0,0.92)',
  ].join(', '),
  borderRadius: 24,
}

// Modal / sheet panel.
export const cfModal: CSSProperties = {
  background: 'linear-gradient(160deg, rgba(255,255,255,0.065) 0%, rgba(0,0,0,0.88) 60%)',
  backdropFilter: 'blur(56px) saturate(200%)',
  WebkitBackdropFilter: 'blur(56px) saturate(200%)',
  border: '1px solid rgba(255,255,255,0.11)',
  boxShadow: [
    'inset 0 2px 0 rgba(255,255,255,0.18)',
    'inset 0 -1px 0 rgba(255,100,140,0.06)',
    'inset 1px 0 0 rgba(180,100,255,0.08)',
    'inset -1px 0 0 rgba(80,210,255,0.08)',
    '0 -8px 60px rgba(0,0,0,0.9)',
    '0 40px 80px rgba(0,0,0,0.95)',
  ].join(', '),
}

// Glass input field.
export const cfInput: CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.09)',
  borderRadius: '12px',
  color: '#fff',
  outline: 'none',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.4)',
}

export const cfInputRing = 'focus:ring-2 focus:ring-white/20 focus:border-white/22'

// Shared active / selected state — warm amber gloss on black (nav items, filter pills, icon bg).
export const CF_ACTIVE_BG     = 'linear-gradient(180deg, rgba(255,195,70,0.18) 0%, rgba(220,140,30,0.08) 48%, rgba(14,8,0,0.72) 49%, rgba(0,0,0,0.58) 100%)'
export const CF_ACTIVE_BORDER = 'rgba(255,245,210,0.22)'
export const CF_ACTIVE_SHADOW = 'inset 0 1.5px 0 rgba(255,252,240,0.55), 0 2px 10px rgba(200,140,30,0.14)'

// Primary CTA button — glossy black, warm amber warmth, white-mixed strokes.
export const cfPrimaryBtn: CSSProperties = {
  background: 'linear-gradient(180deg, rgba(255,195,70,0.18) 0%, rgba(220,140,30,0.08) 46%, rgba(14,8,0,0.74) 47%, rgba(0,0,0,0.60) 100%)',
  border: '1px solid rgba(255,245,210,0.22)',
  boxShadow: [
    'inset 0 1.5px 0 rgba(255,252,240,0.58)',   // near-white specular, warm tint
    'inset 0 -1px 0 rgba(0,0,0,0.55)',
    'inset 1px 0 0 rgba(255,235,180,0.10)',
    'inset -1px 0 0 rgba(255,235,180,0.10)',
    '0 0 16px rgba(200,140,30,0.14)',
    '0 4px 16px rgba(0,0,0,0.55)',
  ].join(', '),
}

export const cfLabel = 'text-white/40 text-[11px] font-semibold uppercase tracking-widest'

// Accent colours (Apple system palette) — untouched.
export const CF_GREEN = '#34C759'
export const CF_RED   = '#FF453A'
export const CF_BLUE  = '#0A84FF'
export const CF_AMBER = '#FF9F0A'
