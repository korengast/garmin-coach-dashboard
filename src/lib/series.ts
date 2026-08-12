import type { DayRow } from '../types/data'

export type ChartPoint = {
  date: string
  label: string
  value: number | null
  bandLo: number | null
  bandHi: number | null
  sma28: number | null
  longMean: number | null
  anomaly: boolean
  capoeira?: boolean
}

function shortLabel(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${Number(m)}/${Number(d)}`
}

function rollingMean(values: (number | null)[], i: number, window: number): number | null {
  const start = Math.max(0, i - window + 1)
  const slice: number[] = []
  for (let j = start; j <= i; j++) {
    const v = values[j]
    if (v != null) slice.push(v)
  }
  if (!slice.length) return null
  return slice.reduce((a, b) => a + b, 0) / slice.length
}

export function enrichSeries(
  days: DayRow[],
  field: keyof DayRow,
  opts: { lastN?: number; shortN?: number; smaN?: number } = {},
): ChartPoint[] {
  const lastN = opts.lastN ?? 90
  const shortN = opts.shortN ?? 14
  const smaN = opts.smaN ?? 28
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date))
  const values = sorted.map((d) => {
    const v = d[field]
    return typeof v === 'number' ? v : null
  })
  const finite = values.filter((v): v is number => v != null)
  const longMean = finite.length ? finite.reduce((a, b) => a + b, 0) / finite.length : null

  const points: ChartPoint[] = sorted.map((d, i) => {
    const value = values[i]
    const shortMean = rollingMean(values, i, shortN)
    const shortVals: number[] = []
    for (let j = Math.max(0, i - shortN + 1); j <= i; j++) {
      const v = values[j]
      if (v != null) shortVals.push(v)
    }
    let sd = 0
    if (shortVals.length > 1 && shortMean != null) {
      const varSum = shortVals.reduce((s, v) => s + (v - shortMean) ** 2, 0)
      sd = Math.sqrt(varSum / shortVals.length)
    }
    const bandLo = shortMean != null ? shortMean - sd : null
    const bandHi = shortMean != null ? shortMean + sd : null
    const anomaly =
      value != null && bandLo != null && bandHi != null && (value < bandLo || value > bandHi)
    return {
      date: d.date,
      label: shortLabel(d.date),
      value,
      bandLo,
      bandHi,
      sma28: rollingMean(values, i, smaN),
      longMean,
      anomaly,
      capoeira: Boolean(d.has_capoeira || d.evening_hard),
    }
  })
  return points.length > lastN ? points.slice(points.length - lastN) : points
}

export function fmt(n: number | null | undefined, digits = 0): string {
  if (n == null || Number.isNaN(n)) return '—'
  return Number(n).toFixed(digits)
}

export function fmtDelta(n: number | null | undefined, digits = 1): string {
  if (n == null || Number.isNaN(n)) return '—'
  const v = Number(n)
  return `${v > 0 ? '+' : ''}${v.toFixed(digits)}`
}

export function sportLabel(a: { name?: string; sport?: string; garmin_type?: string }): string {
  const blob = `${a.sport ?? ''} ${a.garmin_type ?? ''} ${a.name ?? ''}`.toLowerCase()
  if (blob.includes('capoeira') || blob.includes('mixed_martial') || blob.includes('mixed martial')) {
    return 'Capoeira'
  }
  return a.name || a.sport || 'Activity'
}
