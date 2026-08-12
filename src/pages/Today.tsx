import { MetricChip } from '../components/MetricChip'
import { TrendChart } from '../components/TrendChart'
import { HypothesisCard } from '../components/HypothesisCard'
import { bandPip } from '../lib/bands'
import { useDash } from '../lib/ctx'
import { enrichSeries } from '../lib/series'

export function TodayPage() {
  const { latest, days, hypotheses } = useDash()
  const sleep = enrichSeries(days, 'sleep_hours', { lastN: 14 })
  const hrv = enrichSeries(days, 'hrv', { lastN: 28 })
  const flags = hypotheses.items.filter((h) => h.status === 'amber' || h.status === 'red')
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <span className={`h-2.5 w-2.5 rounded-full ${bandPip(latest.readiness.band)}`} />
        <span>{latest.readiness.reasons[0]}</span>
      </div>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {latest.metrics.map((m) => (
          <MetricChip key={m.id} m={m} />
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <TrendChart
          data={sleep}
          color="#818cf8"
          yHint="sleep h"
          teaser="Last 14 nights vs your usual"
          why="The shaded band is your last two weeks. A pink dot is a night outside that band — a short-horizon surprise, not a life sentence. The dashed line is the whole-window mean, so you can see whether a 'bad' night is actually just back to the long-term habit. For recomp, the lever is still time-in-bed after hard evenings, not a perfect stage mix."
        />
        <TrendChart
          data={hrv}
          color="#2dd4bf"
          yHint="HRV"
          teaser="HRV, 28 days"
          why="HRV here is last-night average, not a medical diagnosis. Rising vs the 6-month mean with a calm RHR is the engine looking fitter. A single crash after Capoeira or a short night is expected — three-day slides are the ones that should change tomorrow's session."
        />
      </div>
      {flags.length ? (
        <div className="space-y-3">
          {flags.map((h) => (
            <HypothesisCard key={h.id} h={h} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
