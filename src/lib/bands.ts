import type { Band } from '../types/data'

/** Keep in sync with garmin_dashboard_export.band_for */
export function bandFor(opts: {
  value: number
  mean: number
  sd: number
  higherIsBetter: boolean
}): Band {
  const { value, mean, sd, higherIsBetter } = opts
  if (!(sd > 0)) return 'neutral'
  const z = (value - mean) / sd
  const worse = higherIsBetter ? -z : z
  if (worse >= 2) return 'red'
  if (worse >= 1) return 'amber'
  if (worse <= -1) return 'green'
  return 'neutral'
}

export function bandColor(band: Band | string): string {
  if (band === 'green') return 'text-emerald-300'
  if (band === 'amber') return 'text-amber-300'
  if (band === 'red') return 'text-rose-400'
  return 'text-slate-300'
}

export function bandPip(band: Band | string): string {
  if (band === 'green') return 'bg-emerald-400'
  if (band === 'amber') return 'bg-amber-400'
  if (band === 'red') return 'bg-rose-500'
  return 'bg-slate-500'
}

export function worseBand(a: Band | string, b: Band | string): Band {
  const rank: Record<string, number> = { green: 0, neutral: 1, amber: 2, red: 3 }
  return (rank[b] ?? 1) > (rank[a] ?? 1) ? (b as Band) : (a as Band)
}
