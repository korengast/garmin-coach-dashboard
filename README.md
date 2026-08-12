# Garmin Coach Dashboard

Personal sports & health dashboard (static). Metrics are JSON files updated by Hermes — **not** connected live to Garmin from this app.

**Live:** https://korengast.github.io/garmin-coach-dashboard/

v2 is charts-first: Today / Sleep / Load / Long. Explanations start folded.

## Privacy
Public repo (required for free GitHub Pages). Contains intentional personal training metrics. Do not fork/scrape without permission.

## Dev
```bash
npm ci
npm run dev
npm run build
npm run test:bands
```

## Update data
Morning + weekly Hermes jobs run `garmin-dashboard-export.sh`, overwrite `public/data/**/*.json`, and push `main`.
