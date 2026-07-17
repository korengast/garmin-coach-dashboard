import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DashboardData } from './types/data'
import { bandColor, fmtNum, gradeColor, loadDashboardData, shortDate } from './lib/data'

type Tab = 'today' | 'sleep' | 'recovery' | 'training' | 'trends' | 'coach'

const TABS: { id: Tab; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'sleep', label: 'Sleep' },
  { id: 'recovery', label: 'Recovery' },
  { id: 'training', label: 'Training' },
  { id: 'trends', label: 'Trends' },
  { id: 'coach', label: 'Coach' },
]

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card !p-3">
      <div className="text-[11px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-semibold text-slate-50">{value}</div>
      {sub ? <div className="mt-0.5 text-xs text-slate-400">{sub}</div> : null}
    </div>
  )
}

function Spark({
  data,
  dataKey,
  color,
}: {
  data: Record<string, string | number | null | undefined>[]
  dataKey: string
  color: string
}) {
  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`g-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} width={28} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }}
            labelStyle={{ color: '#cbd5e1' }}
          />
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#g-${dataKey})`} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function App() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('today')

  useEffect(() => {
    loadDashboardData()
      .then(setData)
      .catch((e: Error) => setError(e.message || String(e)))
  }, [])

  const chartDays = useMemo(() => {
    if (!data) return []
    return data.days.map((d) => ({
      label: shortDate(d.date),
      sleep_score: d.sleep_score ?? null,
      hrv: d.hrv ?? null,
      rhr: d.rhr ?? null,
      steps: d.steps ?? null,
      sleep_hours: d.sleep_hours ?? null,
      need_hours: d.sleep_need_min != null ? +(d.sleep_need_min / 60).toFixed(2) : null,
    }))
  }, [data])

  if (error) {
    return (
      <div className="mx-auto max-w-lg p-6">
        <div className="card border-rose-500/40 text-rose-100">Failed to load data: {error}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">Loading dashboard…</div>
    )
  }

  const { latest, activities, recoveryPairs, notes, days } = data
  const t = latest.today
  const readiness = t.readiness

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-3 pb-28 pt-4 sm:px-4">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-teal-300/80">Coach dashboard</p>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">{latest.athlete_label}</h1>
          <p className="mt-1 text-sm text-slate-400">
            {latest.timezone} · updated {new Date(latest.updated_at).toLocaleString()}
          </p>
        </div>
        <div
          className={`chip ring-1 ${bandColor(readiness.band)} px-3 py-2 text-sm capitalize`}
          title={readiness.reasons.join(' · ')}
        >
          {readiness.band}
        </div>
      </header>

      <nav className="card mb-4 !p-1.5">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-btn whitespace-nowrap ${tab === item.id ? 'nav-btn-active' : 'nav-btn-idle'}`}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {tab === 'today' && (
        <section className="space-y-4">
          <div className="card flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#1e293b" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={readiness.band === 'green' ? '#34d399' : readiness.band === 'yellow' ? '#fbbf24' : '#fb7185'}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(readiness.score / 100) * 326.7} 326.7`}
                />
              </svg>
              <div className="absolute text-center">
                <div className="text-3xl font-bold text-white">{readiness.score}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400">readiness</div>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-lg font-semibold text-teal-100">{latest.headline}</h2>
              <ul className="space-y-1 text-sm text-slate-300">
                {readiness.reasons.map((r) => (
                  <li key={r}>· {r}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <Metric label="Sleep score" value={fmtNum(t.sleep_score)} sub={`${fmtNum(t.sleep_hours, 1)}h / need ${t.sleep_need_min ? (t.sleep_need_min / 60).toFixed(1) : '—'}h`} />
            <Metric label="HRV" value={fmtNum(t.hrv)} sub={t.hrv_status || undefined} />
            <Metric label="Resting HR" value={fmtNum(t.rhr)} sub="bpm" />
            <Metric label="Stress avg" value={fmtNum(t.stress_avg)} sub={`max ${fmtNum(t.stress_max)}`} />
            <Metric label="Steps" value={fmtNum(t.steps)} />
            <Metric label="Body Battery" value={`${fmtNum(t.bb_start)}→${fmtNum(t.bb_end)}`} sub={`+${fmtNum(t.bb_charged)} / −${fmtNum(t.bb_drained)}`} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="card">
              <h3 className="mb-2 text-sm font-semibold text-emerald-200">Doing well</h3>
              <ul className="space-y-1.5 text-sm text-slate-300">
                {latest.doing_well.map((x) => (
                  <li key={x}>✓ {x}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <h3 className="mb-2 text-sm font-semibold text-amber-200">Focus</h3>
              <ul className="space-y-1.5 text-sm text-slate-300">
                {latest.focus.map((x) => (
                  <li key={x}>→ {x}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card text-sm text-slate-400">
            <div className="font-medium text-slate-300">14-day center</div>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div>Sleep score avg {fmtNum(latest.windows.days_14.sleep_score_mean, 1)}</div>
              <div>HRV avg {fmtNum(latest.windows.days_14.hrv_mean, 1)}</div>
              <div>RHR avg {fmtNum(latest.windows.days_14.rhr_mean, 1)}</div>
              <div>Steps avg {fmtNum(latest.windows.days_14.steps_mean)}</div>
              <div>Sleep h avg {fmtNum(latest.windows.days_14.sleep_hours_mean, 2)}</div>
              <div>Stress avg {fmtNum(latest.windows.days_14.stress_avg_mean, 1)}</div>
            </div>
          </div>
        </section>
      )}

      {tab === 'sleep' && (
        <section className="space-y-4">
          <div className="card">
            <h2 className="mb-2 text-lg font-semibold">Sleep score (14d)</h2>
            <Spark data={chartDays} dataKey="sleep_score" color="#2dd4bf" />
          </div>
          <div className="card">
            <h2 className="mb-2 text-lg font-semibold">Hours vs need</h2>
            <Spark data={chartDays} dataKey="sleep_hours" color="#818cf8" />
            <p className="mt-2 text-xs text-slate-500">Need often 8–9h after Capoeira / high load (Garmin HIGH_ACWR).</p>
          </div>
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2">Date</th>
                  <th>Score</th>
                  <th>Hours</th>
                  <th>Need</th>
                  <th>Deep%</th>
                  <th>REM%</th>
                  <th>Flag</th>
                </tr>
              </thead>
              <tbody>
                {[...days].reverse().map((d) => (
                  <tr key={d.date} className="border-t border-slate-800/80">
                    <td className="py-2 text-slate-300">{shortDate(d.date)}</td>
                    <td>{fmtNum(d.sleep_score)}</td>
                    <td>{fmtNum(d.sleep_hours, 1)}</td>
                    <td>{d.sleep_need_min ? (d.sleep_need_min / 60).toFixed(1) : '—'}</td>
                    <td>{fmtNum(d.deep_pct, 0)}</td>
                    <td>{fmtNum(d.rem_pct, 0)}</td>
                    <td className="text-xs text-amber-200/90">{d.training_feedback || d.sleep_need_feedback || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'recovery' && (
        <section className="space-y-4">
          <div className="card">
            <h2 className="mb-2 text-lg font-semibold">HRV trend</h2>
            <Spark data={chartDays} dataKey="hrv" color="#34d399" />
          </div>
          <div className="card">
            <h2 className="mb-3 text-lg font-semibold">Run → walk recovery grades</h2>
            <p className="mb-3 text-sm text-slate-400">
              Walk after run is intentional HR recovery tracking. A: min HR ≤105 in ≥10 min · B: ≤115 · C: incomplete / short cool-down.
            </p>
            <div className="space-y-3">
              {recoveryPairs.map((p) => (
                <div key={`${p.date}-${p.run.id}`} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-slate-200">{shortDate(p.date)}</div>
                    <div className="flex items-center gap-2">
                      {p.stroller_run ? <span className="chip bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/30">stroller</span> : null}
                      <span className={`chip ring-1 ${gradeColor(p.grade)}`}>Grade {p.grade}</span>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-300">
                    <div>
                      Run · {fmtNum(p.run.duration_min, 0)} min · avg {fmtNum(p.run.avg_hr)} · max {fmtNum(p.run.max_hr)}
                    </div>
                    <div>
                      Walk · {fmtNum(p.walk.duration_min, 0)} min · min HR {fmtNum(p.walk.min_hr)} · avg {fmtNum(p.walk.avg_hr)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {tab === 'training' && (
        <section className="space-y-3">
          <div className="card text-sm text-slate-400">
            Capoeira is logged in Garmin as Mixed Martial Arts (closest type). Stroller badge = morning 3k with pushchair load.
          </div>
          {activities
            .slice()
            .sort((a, b) => String(b.start).localeCompare(String(a.start)))
            .map((a) => (
              <div key={a.id} className="card">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-white">{a.name}</h3>
                  {a.sport === 'capoeira' || a.name === 'Capoeira' ? (
                    <span className="chip bg-violet-500/20 text-violet-100 ring-1 ring-violet-400/30">Capoeira</span>
                  ) : null}
                  {a.stroller ? <span className="chip bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/30">stroller</span> : null}
                  {a.te_label ? <span className="chip bg-slate-700/50 text-slate-300 ring-1 ring-slate-600">{a.te_label}</span> : null}
                </div>
                <p className="mt-1 text-xs text-slate-500">{a.start}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-300 sm:grid-cols-4">
                  <div>{fmtNum(a.duration_min, 0)} min</div>
                  <div>avg HR {fmtNum(a.avg_hr)}</div>
                  <div>max HR {fmtNum(a.max_hr)}</div>
                  <div>{a.calories != null ? `${fmtNum(a.calories)} kcal` : '—'}</div>
                </div>
              </div>
            ))}
        </section>
      )}

      {tab === 'trends' && (
        <section className="space-y-4">
          <div className="card">
            <h2 className="mb-2 text-lg font-semibold">Resting HR</h2>
            <Spark data={chartDays} dataKey="rhr" color="#f472b6" />
          </div>
          <div className="card">
            <h2 className="mb-2 text-lg font-semibold">Steps</h2>
            <Spark data={chartDays} dataKey="steps" color="#38bdf8" />
          </div>
          <div className="card text-sm text-slate-300">
            <h2 className="mb-2 text-lg font-semibold text-white">Patterns</h2>
            <ul className="space-y-2">
              <li>· Evening Capoeira → elevated next sleep need (HIGH_ACWR flags common).</li>
              <li>· Short hard morning runs (often stroller) sit at high avg HR (~160–169).</li>
              <li>· Cool-downs ≥12 min show better walk min HR than ~8 min.</li>
              <li>· RHR stable low-50s = fitness base intact even when sleep is short.</li>
            </ul>
          </div>
        </section>
      )}

      {tab === 'coach' && (
        <section className="space-y-3">
          {notes.notes.map((n, i) => (
            <div key={`${n.date}-${i}`} className="card">
              <div className="flex items-center justify-between gap-2">
                <span className="chip bg-teal-500/15 text-teal-100 ring-1 ring-teal-400/30">{n.category}</span>
                <span className="text-xs text-slate-500">{n.date}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">{n.text}</p>
            </div>
          ))}
          {latest.sport_notes ? (
            <div className="card text-sm text-slate-400">
              {Object.entries(latest.sport_notes).map(([k, v]) => (
                <div key={k} className="mb-1">
                  <span className="text-slate-300">{k}:</span> {v}
                </div>
              ))}
            </div>
          ) : null}
        </section>
      )}

      <footer className="mt-8 text-center text-[11px] leading-relaxed text-slate-500">
        Static dashboard · JSON updated by Hermes · no live Garmin login in this app
        <br />
        {latest.privacy_note}
      </footer>
    </div>
  )
}
