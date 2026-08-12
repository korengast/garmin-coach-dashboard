import type { Metric } from '../types/data'
import { bandPip } from '../lib/bands'
import { fmt, fmtDelta } from '../lib/series'

const SPARK: Record<string, string> = {
  green: '#34d399',
  amber: '#fbbf24',
  red: '#fb7185',
  neutral: '#5eead4',
}

function MiniSpark({ values, color }: { values: (number | null)[]; color: string }) {
  const n = values.length
  const pts = values
    .map((v, i) => (v == null ? null : { i, v }))
    .filter((p): p is { i: number; v: number } => p != null)
  if (n < 2 || pts.length < 2) return null
  const w = 88
  const h = 26
  const pad = 1.5
  const min = Math.min(...pts.map((p) => p.v))
  const max = Math.max(...pts.map((p) => p.v))
  const span = max - min || 1
  const xy = pts.map(({ i, v }) => {
    const x = pad + (i / (n - 1)) * (w - pad * 2)
    const y = pad + (1 - (v - min) / span) * (h - pad * 2)
    return { x, y }
  })
  const last = xy[xy.length - 1]
  return (
    <svg
      width="100%"
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="mt-1.5 block"
      aria-hidden
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={xy.map((p) => `${p.x},${p.y}`).join(' ')}
      />
      <circle cx={last.x} cy={last.y} r="1.8" fill={color} />
    </svg>
  )
}

export function MetricChip({ m, spark }: { m: Metric; spark?: (number | null)[] }) {
  const band = m.short.band === 'neutral' ? m.long.band : m.short.band
  const digits = m.unit === 'h' || m.id === 'debt' ? 2 : 0
  return (
    <div className="card !p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] uppercase tracking-wider text-slate-500">{m.label}</div>
        <span className={`h-2 w-2 rounded-full ${bandPip(band)}`} title={band} />
      </div>
      <div className="mt-1 text-2xl font-semibold tabular-nums text-slate-50">
        {fmt(m.value, digits)}
        {m.unit ? <span className="ml-1 text-xs font-normal text-slate-500">{m.unit}</span> : null}
      </div>
      {spark ? <MiniSpark values={spark} color={SPARK[band] ?? SPARK.neutral} /> : null}
      <div className="mt-1 flex gap-3 text-[11px] tabular-nums text-slate-500">
        <span>14d {fmtDelta(m.short.delta, digits || 1)}</span>
        <span>win {fmtDelta(m.long.delta, digits || 1)}</span>
      </div>
    </div>
  )
}
