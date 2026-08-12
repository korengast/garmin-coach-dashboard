import type { Metric } from '../types/data'
import { bandPip } from '../lib/bands'
import { fmt, fmtDelta } from '../lib/series'

export function MetricChip({ m }: { m: Metric }) {
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
      <div className="mt-1 flex gap-3 text-[11px] tabular-nums text-slate-500">
        <span>14d {fmtDelta(m.short.delta, digits || 1)}</span>
        <span>win {fmtDelta(m.long.delta, digits || 1)}</span>
      </div>
    </div>
  )
}
