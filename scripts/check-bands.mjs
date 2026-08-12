#!/usr/bin/env node
// Keep in sync with src/lib/bands.ts and garmin_dashboard_export.band_for

function bandFor({ value, mean, sd, higherIsBetter }) {
  if (!(sd > 0)) return 'neutral'
  const z = (value - mean) / sd
  const worse = higherIsBetter ? -z : z
  if (worse >= 2) return 'red'
  if (worse >= 1) return 'amber'
  if (worse <= -1) return 'green'
  return 'neutral'
}

const cases = [
  { name: 'hrv 2sd below → red', args: { value: 30, mean: 44, sd: 5, higherIsBetter: true }, want: 'red' },
  { name: 'hrv 1sd below → amber', args: { value: 39, mean: 44, sd: 5, higherIsBetter: true }, want: 'amber' },
  { name: 'hrv in band → neutral', args: { value: 45, mean: 44, sd: 5, higherIsBetter: true }, want: 'neutral' },
  { name: 'hrv 1sd above → green', args: { value: 50, mean: 44, sd: 5, higherIsBetter: true }, want: 'green' },
  { name: 'rhr 2sd below → green', args: { value: 48, mean: 54, sd: 3, higherIsBetter: false }, want: 'green' },
  { name: 'rhr 2sd above → red', args: { value: 60, mean: 54, sd: 3, higherIsBetter: false }, want: 'red' },
  { name: 'zero sd → neutral', args: { value: 50, mean: 50, sd: 0, higherIsBetter: true }, want: 'neutral' },
]

let failed = 0
for (const c of cases) {
  const got = bandFor(c.args)
  if (got !== c.want) {
    console.error(`FAIL ${c.name}: got ${got}, want ${c.want}`)
    failed += 1
  } else {
    console.log(`ok  ${c.name}`)
  }
}
if (failed) {
  process.exit(1)
}
console.log(`passed ${cases.length}`)
