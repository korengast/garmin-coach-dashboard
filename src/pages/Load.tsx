import { TrendChart } from '../components/TrendChart'
import { Explain } from '../components/Explain'
import { useDash } from '../lib/ctx'
import { enrichSeries, fmt, sportLabel } from '../lib/series'

function gradeClass(g: string): string {
  if (g === 'A') return 'text-emerald-300'
  if (g === 'B') return 'text-amber-300'
  return 'text-rose-300'
}

export function LoadPage() {
  const { days, activities, recoveryPairs, strength } = useDash()
  const intensity = enrichSeries(days, 'intensity_min', { lastN: 42 })
  const recent = activities.slice(0, 12)
  return (
    <div className="space-y-3">
      <TrendChart
        data={intensity}
        color="#fb923c"
        yHint="intensity min"
        teaser="Moderate + vigorous minutes"
        why="Hard minutes today that show up as more debt tomorrow are on the Long tab. Stacking evening Capoeira with a morning stroller 3k is the usual trap — the watch will still call the 3k 'easy' by pace."
      />
      <div className="card">
        <div className="mb-2 text-sm font-medium text-slate-100">Recent sessions</div>
        <ul className="divide-y divide-slate-800 text-sm">
          {recent.map((a) => (
            <li key={a.id} className="flex items-baseline justify-between gap-3 py-1.5">
              <div>
                <div className="text-slate-200">
                  {sportLabel(a)}
                  {a.stroller ? <span className="ml-2 text-[11px] text-slate-500">stroller</span> : null}
                </div>
                <div className="text-[11px] text-slate-500">{a.start}</div>
              </div>
              <div className="text-right tabular-nums text-slate-400">
                <div>{fmt(a.duration_min, 0)}m</div>
                <div className="text-[11px]">{a.avg_hr ? `${fmt(a.avg_hr, 0)} bpm` : ''}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {recoveryPairs.length ? (
        <div className="card">
          <div className="mb-2 text-sm font-medium text-slate-100">Run → walk recovery</div>
          <ul className="space-y-1 text-sm">
            {recoveryPairs.map((p) => (
              <li key={`${p.date}-${p.run.id}`} className="flex justify-between gap-2">
                <span className="text-slate-400">
                  {p.date}
                  {p.stroller_run ? ' · stroller' : ''}
                </span>
                <span className={`tabular-nums ${gradeClass(p.grade)}`}>
                  {p.grade} · min {fmt(p.walk.min_hr, 0)} · {fmt(p.walk.duration_min, 0)}m
                </span>
              </li>
            ))}
          </ul>
          <Explain
            teaser="The walk is the test"
            why="Min HR on the cool-down is the recovery number. Stroller 3ks stay tagged so they are not graded like solo runs. Aim 10–15 min easy, min HR falling — not another cardio block."
          />
        </div>
      ) : null}
      {strength.length ? (
        <div className="card">
          <div className="mb-2 text-sm font-medium text-slate-100">Pull-ups (logged)</div>
          <ul className="space-y-1 text-sm text-slate-300">
            {strength.slice(-10).map((s) => (
              <li key={s.date} className="flex justify-between tabular-nums">
                <span className="text-slate-500">{s.date}</span>
                <span>
                  {s.reps} reps · {s.sets} sets
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
