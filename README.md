# Garmin Coach Dashboard

Personal sports & health dashboard (static). Metrics are JSON files updated by Hermes — **not** connected live to Garmin from this app.

**Live:** after deploy → `https://korengast.github.io/garmin-coach-dashboard/`

## Privacy
Public repo (required for free GitHub Pages). Contains intentional personal training metrics. Do not fork/scrape without permission.

## Dev
```bash
npm ci
npm run dev
npm run build
```

## Update data
Hermes (or a local export) overwrites `public/data/**/*.json` and pushes to `main`.
