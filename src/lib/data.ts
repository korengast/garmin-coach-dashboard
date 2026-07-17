import type {
  Activity,
  CoachNotes,
  DashboardData,
  DayRow,
  HomeTrends,
  Insights,
  Latest,
  Meta,
  RecoveryPair,
} from '../types/data'

const base = import.meta.env.BASE_URL || '/'

async function fetchJson<T>(path: string): Promise<T> {
  const url = `${base}${path.replace(/^\//, '')}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`)
  return res.json() as Promise<T>
}

export async function loadDashboardData(): Promise<DashboardData> {
  const [meta, latest, days, activities, recoveryPairs, notes, insights, homeTrends] =
    await Promise.all([
      fetchJson<Meta>('data/meta.json'),
      fetchJson<Latest>('data/latest.json'),
      fetchJson<DayRow[]>('data/history/days.json'),
      fetchJson<Activity[]>('data/history/activities.json'),
      fetchJson<RecoveryPair[]>('data/history/recovery_pairs.json'),
      fetchJson<CoachNotes>('data/coach/notes.json'),
      fetchJson<Insights>('data/insights.json'),
      fetchJson<HomeTrends>('data/home_trends.json'),
    ])
  return { meta, latest, days, activities, recoveryPairs, notes, insights, homeTrends }
}

export function bandColor(band: string): string {
  if (band === 'green') return 'text-emerald-300 bg-emerald-500/15 ring-emerald-400/30'
  if (band === 'yellow') return 'text-amber-200 bg-amber-500/15 ring-amber-400/30'
  return 'text-rose-200 bg-rose-500/15 ring-rose-400/30'
}

export function gradeColor(grade: string): string {
  if (grade === 'A') return 'bg-emerald-500/20 text-emerald-200 ring-emerald-400/40'
  if (grade === 'B') return 'bg-amber-500/20 text-amber-100 ring-amber-400/40'
  return 'bg-rose-500/20 text-rose-100 ring-rose-400/40'
}

export function severityColor(sev: string): string {
  if (sev === 'high') return 'bg-rose-500/15 text-rose-100 ring-rose-400/30'
  if (sev === 'medium') return 'bg-amber-500/15 text-amber-100 ring-amber-400/30'
  return 'bg-slate-700/40 text-slate-300 ring-slate-600/40'
}

export function fmtNum(n: number | null | undefined, digits = 0): string {
  if (n == null || Number.isNaN(n)) return '—'
  return Number(n).toFixed(digits)
}

export function fmtDelta(n: number | null | undefined, digits = 2): string {
  if (n == null || Number.isNaN(n)) return '—'
  const v = Number(n)
  return `${v > 0 ? '+' : ''}${v.toFixed(digits)}`
}

export function shortDate(iso: string): string {
  const d = new Date(iso.includes('T') ? iso : `${iso}T12:00:00`)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function corrLabel(c: { a: string; b: string; kind: string; label?: string }): string {
  if (c.kind === 'lag' && c.label) return c.label
  return `${c.a} ↔ ${c.b}`
}

export function pointsForChart(
  pts: { date?: string; label?: string; value: number }[],
  max = 60,
): { label: string; value: number | null }[] {
  const slice = pts.length > max ? pts.slice(pts.length - max) : pts
  return slice.map((p, i) => ({
    label: p.label || (p.date ? shortDate(p.date) : String(i)),
    value: p.value,
  }))
}
