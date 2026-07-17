import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DashboardData } from './types/data'
import {
  bandColor,
  corrLabel,
  fmtDelta,
  fmtNum,
  gradeColor,
  loadDashboardData,
  pointsForChart,
  severityColor,
  shortDate,
} from './lib/data'

type Tab = 'today' | 'insights' | 'sleep' | 'recovery' | 'training' | 'trends' | 'coach'

const TABS: { id: Tab; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'insights', label: 'Insights' },
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
  height = 160,
}: {
  data: Record<string, string | number | null | undefined>[]
  dataKey: string
  color: string
  height?: number
}) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`g-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.45} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} width={32} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }}
            labelStyle={{ color: '#cbd5e1' }}
          />
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#g-${dataKey})`} strokeWidth={2} connectNulls />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function LineSpark({
  data,
  color,
  height = 140,
}: {
  data: { label: string; value: number | null }[]
  color: string
  height?: number
}) {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} width={36} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }}
            labelStyle={{ color: '#cbd5e1' }}
          />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} connectNulls />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function App() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('today')
  const [openExplain, setOpenExplain] = useState(false)

  useEffect(() => {
    loadDashboardData()
      .then(setData)
      .catch((e: Error) => setError(e.message || String(e)))
  }, [])

  const chartDays = useMemo(() => {
    if (!data) return []
    return data.days.slice(-60).map((d) => ({
      label: shortDate(d.date),
      sleep_score: d.sleep_score ?? null,
      hrv: d.hrv ?? null,
      rhr: d.rhr ?? null,
      steps: d.steps ?? null,
      sleep_hours: d.sleep_hours ?? null,
      need_hours: d.sleep_need_min != null ? +(d.sleep_need_min / 60).toFixed(2) : null,
      debt_h: d.debt_h ?? null,
    }))
  }, [data])

  const monthlyChart = useMemo(() => {
    if (!data?.insights?.monthly) return []
    return data.insights.monthly.map((m) => ({
      label: m.month.slice(5),
      hrv: m.hrv ?? null,
      sleep_h: m.sleep_h ?? null,
      stress: m.stress ?? null,
      rhr: m.rhr ?? null,
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

  const { latest, activities, recoveryPairs, notes, days, insights, homeTrends } = data
  const t = latest.today
  const readiness = t.readiness
  const ht = homeTrends
  const yw = ht.min_hr_trends.yearly_window

  const rhr28 = pointsForChart(ht.min_hr_trends.sma28, 90)
  const rhr90 = pointsForChart(ht.min_hr_trends.sma90, 90)
  const rhrWeekly = ht.min_hr_trends.weekly_chart.map((p) => ({
    label: p.label || '',
    value: p.value,
  }))
  const rhrQuarterly = ht.min_hr_trends.quarterly_chart.map((p) => ({
    label: p.label || '',
    value: p.value,
  }))
  const hrvSma = pointsForChart(ht.series.hrv_sma28 || [], 90)
  const debtSma = pointsForChart(ht.series.debt_sma28 || [], 90)

  const corrKeys = [
    'hrv_vs_rhr',
    'intensity_vs_next_debt',
    'stress_vs_next_hrv',
    'evening_hard_vs_next_sleep',
    'train_vs_next_sleep',
    'debt_vs_rem',
    'sleep_vs_score',
  ]

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
          {/* NUMBERS FIRST */}
          <div className="card border-teal-500/20 bg-gradient-to-br from-slate-900 to-slate-950">
            <p className="text-[11px] uppercase tracking-wider text-teal-300/90">Beyond Garmin · trend snapshot</p>
            <h2 className="mt-1 text-lg font-semibold leading-snug text-white sm:text-xl">{ht.headline_numbers}</h2>
            <p className="mt-2 text-xs text-slate-500">{ht.window} · {ht.n_days} days</p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {ht.metrics.map((m) => (
              <div key={m.id} className="card !p-3">
                <div className="text-[10px] uppercase tracking-wider text-slate-500">{m.label}</div>
                <div className="mt-1 text-xl font-semibold text-white">
                  {fmtNum(m.value, Math.abs(m.value || 0) < 10 ? 2 : 1)}
                  {m.unit ? <span className="ml-1 text-xs font-normal text-slate-400">{m.unit}</span> : null}
                </div>
                {m.delta != null ? (
                  <div className={`mt-0.5 text-xs ${m.delta < 0 ? 'text-emerald-300' : m.delta > 0 ? 'text-amber-200' : 'text-slate-400'}`}>
                    {fmtDelta(m.delta, Math.abs(m.delta) < 1 ? 2 : 1)} {m.delta_label || ''}
                  </div>
                ) : m.sub ? (
                  <div className="mt-0.5 text-[11px] text-slate-400">{m.sub}</div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="card">
            <h2 className="mb-1 text-lg font-semibold">Resting / min HR trends</h2>
            <p className="mb-3 text-xs text-slate-500">
              Garmin RHR as daily min/resting proxy · weekly raw (no smooth) · 28d & 90d smooth · window = yearly scale
            </p>
            <div className="mb-3 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-xl bg-slate-950/60 p-2 ring-1 ring-slate-800">
                <div className="text-[10px] text-slate-500">First 30d</div>
                <div className="font-semibold text-slate-100">{fmtNum(yw.start_mean_30, 1)}</div>
              </div>
              <div className="rounded-xl bg-slate-950/60 p-2 ring-1 ring-slate-800">
                <div className="text-[10px] text-slate-500">Last 30d</div>
                <div className="font-semibold text-teal-200">{fmtNum(yw.end_mean_30, 1)}</div>
              </div>
              <div className="rounded-xl bg-slate-950/60 p-2 ring-1 ring-slate-800">
                <div className="text-[10px] text-slate-500">Δ half-year</div>
                <div className="font-semibold text-emerald-300">{fmtDelta(yw.delta_start_end, 1)} bpm</div>
              </div>
            </div>
            <h3 className="mb-1 text-sm font-medium text-slate-300">Weekly mean RHR (raw)</h3>
            <LineSpark data={rhrWeekly} color="#f472b6" />
            <h3 className="mb-1 mt-4 text-sm font-medium text-slate-300">28d smooth</h3>
            <LineSpark data={rhr28} color="#fb7185" />
            <h3 className="mb-1 mt-4 text-sm font-medium text-slate-300">90d smooth (quarterly scale)</h3>
            <LineSpark data={rhr90} color="#e879f9" />
            <h3 className="mb-1 mt-4 text-sm font-medium text-slate-300">Calendar quarter means</h3>
            <LineSpark data={rhrQuarterly} color="#c084fc" height={120} />
          </div>

          <div className="card">
            <h2 className="mb-1 text-lg font-semibold">Fitness vs recovery (smoothed)</h2>
            <p className="mb-2 text-xs text-slate-500">
              Gap: HRV {fmtDelta(ht.fitness_recovery_gap.hrv_change, 1)} · debt {fmtDelta(ht.fitness_recovery_gap.debt_change, 2)} h · RHR{' '}
              {fmtDelta(ht.fitness_recovery_gap.rhr_change, 1)} (first→last 30d)
            </p>
            <h3 className="mb-1 text-sm text-slate-300">HRV 28d smooth</h3>
            <LineSpark data={hrvSma} color="#34d399" />
            <h3 className="mb-1 mt-3 text-sm text-slate-300">Sleep debt 28d smooth</h3>
            <LineSpark data={debtSma} color="#fb7185" />
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-400 sm:grid-cols-4">
              {Object.entries(ht.slopes_per_month).map(([k, v]) => (
                <div key={k} className="rounded-lg bg-slate-950/50 px-2 py-1.5 ring-1 ring-slate-800">
                  <div className="uppercase tracking-wide text-slate-500">{k}</div>
                  <div className="text-sm font-semibold text-slate-100">{fmtDelta(v, 2)} /mo</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="mb-1 text-lg font-semibold">Rolling correlations (30d window)</h2>
            <p className="mb-3 text-xs text-slate-500">
              Trend of r over time — not a single static number. Δ = change vs ~60 days earlier.
            </p>
            <div className="space-y-4">
              {corrKeys.map((key) => {
                const c = ht.corr_trends[key]
                if (!c) return null
                const series = pointsForChart(c.series, 50)
                return (
                  <div key={key} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium text-slate-100">{c.label}</div>
                        <div className="text-[11px] text-slate-500">{c.explain}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-teal-300">
                          {c.now_30d != null ? fmtDelta(c.now_30d, 2).replace('+', '+') : '—'}
                        </div>
                        <div className="text-[11px] text-slate-500">now · Δ {fmtDelta(c.delta_vs_60d_ago, 2)}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <LineSpark data={series} color="#2dd4bf" height={110} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card">
            <h2 className="mb-2 text-lg font-semibold">Capoeira sleep tax over time</h2>
            <p className="mb-2 text-xs text-slate-500">Next-night sleep after Capoeira minus other days (hours), by period of the window</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ht.capoeira_sleep_tax_by_block.map((b) => (
                <div key={b.block} className="rounded-xl bg-slate-950/60 p-3 text-center ring-1 ring-slate-800">
                  <div className="text-xs text-slate-500">{b.block}</div>
                  <div className={`text-xl font-bold ${(b.delta || 0) < 0 ? 'text-rose-300' : 'text-emerald-300'}`}>
                    {fmtDelta(b.delta, 2)}h
                  </div>
                  <div className="text-[10px] text-slate-500">n={b.n_cap}</div>
                </div>
              ))}
            </div>
          </div>

          {/* TODAY snapshot compact */}
          <div className="card">
            <h2 className="mb-2 text-sm font-semibold text-slate-300">Today (Garmin snapshot)</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Metric label="Sleep" value={fmtNum(t.sleep_score)} sub={`${fmtNum(t.sleep_hours, 1)} h`} />
              <Metric label="HRV" value={fmtNum(t.hrv)} sub={t.hrv_status || undefined} />
              <Metric label="RHR" value={fmtNum(t.rhr)} />
              <Metric label="Steps" value={fmtNum(t.steps)} />
            </div>
          </div>

          {/* TEXT AFTER */}
          <div className="card">
            <button
              type="button"
              className="flex w-full items-center justify-between text-left"
              onClick={() => setOpenExplain((v) => !v)}
            >
              <h2 className="text-lg font-semibold">Explanations (text)</h2>
              <span className="text-sm text-teal-300">{openExplain ? 'Hide' : 'Show'}</span>
            </button>
            {openExplain ? (
              <div className="mt-3 space-y-3">
                {ht.explanations.map((e) => (
                  <div key={e.title} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                    <div className="font-medium text-slate-100">{e.title}</div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-300">{e.text}</p>
                  </div>
                ))}
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                  <div className="font-medium text-slate-100">Why these aren’t in Garmin Connect</div>
                  <ul className="mt-2 space-y-1 text-sm text-slate-300">
                    {ht.metrics.map((m) => (
                      <li key={m.id}>
                        <span className="text-slate-100">{m.label}:</span> {m.why}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Numbers & charts above first. Tap Show for correlation meanings and “not in Garmin” notes.</p>
            )}
          </div>
        </section>
      )}

      {tab === 'insights' && (
        <section className="space-y-4">
          <div className="card">
            <p className="text-xs uppercase tracking-wider text-teal-300/80">Insight cards + static top-r</p>
            <h2 className="mt-1 text-xl font-semibold text-white">{insights.headline}</h2>
            <p className="mt-2 text-sm text-slate-400">
              Window {insights.window} · prefer Today tab for rolling correlation trends
            </p>
          </div>
          <div className="space-y-3">
            {insights.cards.map((c) => (
              <div key={c.id} className="card">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-slate-100">{c.title}</h3>
                  <span className={`chip ring-1 ${severityColor(c.severity)}`}>{c.severity}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{c.text}</p>
              </div>
            ))}
          </div>
          <div className="card">
            <h2 className="mb-3 text-lg font-semibold">Top correlations (full window)</h2>
            <div className="space-y-2">
              {insights.correlations.map((c, i) => (
                <div key={`${c.a}-${c.b}-${i}`} className="flex items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2">
                  <div className="min-w-0 text-sm text-slate-300">
                    <div className="truncate font-medium text-slate-100">{corrLabel(c)}</div>
                    <div className="text-xs text-slate-500">
                      n={c.n} · {c.kind}
                    </div>
                  </div>
                  <div className={`text-lg font-bold ${Math.abs(c.r) >= 0.4 ? 'text-teal-300' : 'text-slate-200'}`}>
                    {c.r > 0 ? '+' : ''}
                    {c.r.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h2 className="mb-2 text-lg font-semibold">Seasonality — monthly HRV</h2>
            <Spark data={monthlyChart} dataKey="hrv" color="#2dd4bf" />
          </div>
          <div className="card overflow-x-auto">
            <h2 className="mb-2 text-lg font-semibold">Day-of-week fingerprint</h2>
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2">Day</th>
                  <th>Sleep h</th>
                  <th>HRV</th>
                  <th>Steps</th>
                  <th>Capoeira</th>
                </tr>
              </thead>
              <tbody>
                {insights.dow.map((d) => (
                  <tr key={d.dow} className="border-t border-slate-800/80">
                    <td className="py-2 font-medium text-slate-200">{d.dow}</td>
                    <td>{fmtNum(d.sleep_h, 1)}</td>
                    <td>{fmtNum(d.hrv, 1)}</td>
                    <td>{fmtNum(d.steps, 0)}</td>
                    <td>{d.capoeira_rate != null ? `${Math.round(d.capoeira_rate * 100)}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card">
            <h2 className="mb-2 text-lg font-semibold">Actions</h2>
            <ul className="space-y-2 text-sm text-slate-300">
              {insights.actions.map((a) => (
                <li key={a}>→ {a}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {tab === 'sleep' && (
        <section className="space-y-4">
          <div className="card">
            <h2 className="mb-2 text-lg font-semibold">Sleep score (60d)</h2>
            <Spark data={chartDays} dataKey="sleep_score" color="#38bdf8" />
          </div>
          <div className="card">
            <h2 className="mb-2 text-lg font-semibold">Hours vs need (60d)</h2>
            <Spark data={chartDays} dataKey="sleep_hours" color="#a78bfa" />
          </div>
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2 pr-2">Date</th>
                  <th>Score</th>
                  <th>Hours</th>
                  <th>Deep%</th>
                  <th>REM%</th>
                  <th>Flags</th>
                </tr>
              </thead>
              <tbody>
                {[...days].slice(-21).reverse().map((d) => (
                  <tr key={d.date} className="border-t border-slate-800/80">
                    <td className="py-2 pr-2 text-slate-300">{shortDate(d.date)}</td>
                    <td>{fmtNum(d.sleep_score)}</td>
                    <td>{fmtNum(d.sleep_hours, 1)}</td>
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
            <h2 className="mb-2 text-lg font-semibold">HRV trend (60d)</h2>
            <Spark data={chartDays} dataKey="hrv" color="#34d399" />
          </div>
          <div className="card">
            <h2 className="mb-3 text-lg font-semibold">Run → walk recovery grades</h2>
            <p className="mb-3 text-sm text-slate-400">
              Walk after run = intentional HR recovery. A: min HR ≤105 in ≥10 min · B: ≤115 · C: incomplete.
            </p>
            <div className="space-y-3">
              {recoveryPairs.map((p) => (
                <div key={`${p.date}-${p.run.id}`} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium text-slate-200">{shortDate(p.date)}</div>
                    <div className="flex items-center gap-2">
                      {p.stroller_run ? (
                        <span className="chip bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/30">stroller</span>
                      ) : null}
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
            Capoeira is logged in Garmin as Mixed Martial Arts. Stroller badge = morning 3k with pushchair load.
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
                  {a.stroller ? (
                    <span className="chip bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/30">stroller</span>
                  ) : null}
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
          <div className="card text-sm text-slate-400">For deep trend math see Today (first page). Here = quick 60d sparklines.</div>
          <div className="card">
            <h2 className="mb-2 text-lg font-semibold">Resting HR</h2>
            <Spark data={chartDays} dataKey="rhr" color="#f472b6" />
          </div>
          <div className="card">
            <h2 className="mb-2 text-lg font-semibold">Steps</h2>
            <Spark data={chartDays} dataKey="steps" color="#38bdf8" />
          </div>
          <div className="card">
            <h2 className="mb-2 text-lg font-semibold">Sleep debt (60d)</h2>
            <Spark data={chartDays} dataKey="debt_h" color="#fb7185" />
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
        </section>
      )}

      <footer className="mt-8 text-center text-[11px] leading-relaxed text-slate-500">
        Static dashboard · JSON updated by Hermes · no live Garmin login
        <br />
        {latest.privacy_note}
      </footer>
    </div>
  )
}
