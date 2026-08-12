import { HypothesisCard } from '../components/HypothesisCard'
import { TrendChart } from '../components/TrendChart'
import { useDash } from '../lib/ctx'
import { enrichSeries } from '../lib/series'

export function LongPage() {
  const { days, hypotheses } = useDash()
  const rhr = enrichSeries(days, 'rhr', { lastN: 180 })
  const hrv = enrichSeries(days, 'hrv', { lastN: 180 })
  const debt = enrichSeries(days, 'debt_h', { lastN: 180 })
  const steps = enrichSeries(days, 'steps', { lastN: 180 })
  return (
    <div className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <TrendChart
          data={rhr}
          color="#fb7185"
          yHint="RHR"
          teaser="Resting HR, full window"
          why="Grey is 28d smooth; dashed is the window mean. A falling long line is aerobic fitness showing up at rest. A week that sits above the band while HRV also slumps is fatigue or life load, not a bad watch day."
        />
        <TrendChart
          data={hrv}
          color="#2dd4bf"
          yHint="HRV"
          teaser="HRV, full window"
          why="Use this next to RHR. They should oppose each other if the autonomic picture is intact (see coupling card). Rising HRV with unpaid sleep debt is the fitness–recovery gap — engine yes, recharge no."
        />
        <TrendChart
          data={debt}
          color="#fbbf24"
          yHint="debt h"
          teaser="Sleep debt, full window"
          why="This is the recomp constraint. If the 28d SMA does not fall, more Capoeira or more 3ks will not get you leaner. Pay the night after evening-hard first."
        />
        <TrendChart
          data={steps}
          color="#38bdf8"
          yHint="steps"
          teaser="Steps, full window"
          why="Useful as a behavior check: more steps on already-short nights is a no-deload pattern. Easy volume is good; stacking it on 5.5h nights is not."
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {hypotheses.items.map((h) => (
          <HypothesisCard key={h.id} h={h} />
        ))}
      </div>
    </div>
  )
}
