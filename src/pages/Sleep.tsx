import { TrendChart } from '../components/TrendChart'
import { useDash } from '../lib/ctx'
import { enrichSeries } from '../lib/series'

export function SleepPage() {
  const { days } = useDash()
  const hours = enrichSeries(days, 'sleep_hours', { lastN: 42 })
  const score = enrichSeries(days, 'sleep_score', { lastN: 42 })
  const debt = enrichSeries(days, 'debt_h', { lastN: 90 })
  const rem = enrichSeries(days, 'rem_pct', { lastN: 42 })
  return (
    <div className="space-y-3">
      <TrendChart
        data={hours}
        color="#818cf8"
        yHint="hours"
        teaser="Hours vs your 14d band"
        why="Pink dots are nights outside the last two weeks. Markers in the data for Capoeira/evening-hard sit on those dates in the Long tab tax chart. If hours keep sitting under the dashed long mean, that is the chronic hole blocking fat loss — not a missing supplement."
      />
      <TrendChart
        data={score}
        color="#c084fc"
        yHint="score"
        teaser="Sleep score"
        why="Score is Garmin's blend. If it tracks hours (see Long → hours vs score), go to bed earlier. If score drops while hours hold, look at timing and late intensity, not more tracking."
      />
      <TrendChart
        data={debt}
        color="#fb7185"
        yHint="debt h"
        teaser="Debt vs need, 90 days"
        why="Debt = Garmin need minus achieved. A falling 28d SMA (grey) is the recovery story you actually want. A fit RHR with a flat or rising debt line is the fitness–recovery gap."
      />
      {rem.some((p) => p.value != null) ? (
        <TrendChart
          data={rem}
          color="#fbbf24"
          yHint="REM %"
          teaser="REM share"
          why="Short nights often keep deep % looking fine while they cut the late REM cycles. That is a skill/mood tax, not a deep-sleep win."
        />
      ) : null}
    </div>
  )
}
