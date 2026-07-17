# AGENTS.md — garmin-coach-dashboard

## Mission
Static **GitHub Pages** health/sports dashboard. Data is JSON under `public/data/`. Hermes updates numbers. **No Garmin API, no tokens, no backend, no Firebase.**

## Hard rules
- Do NOT add garminconnect, garth, OAuth, env secrets, or server code.
- Do NOT copy PulseLogic server/paywall/auth — UI inspiration only.
- Capoeira: display `mixed_martial_arts` / MMA labels as **Capoeira**.
- Mobile-first dark theme.
- Vite `base` must work on GitHub Project Pages: `/garmin-coach-dashboard/`

## Data files (already present)
- `public/data/latest.json`
- `public/data/meta.json`
- `public/data/history/days.json`
- `public/data/history/activities.json`
- `public/data/history/recovery_pairs.json`
- `public/data/coach/notes.json`

## Stack
Vite + React 19 + TypeScript + Tailwind CSS + Recharts (or similar light charts).

## Sections
Today | Sleep | Recovery | Training | Trends | Coach notes

## Verify
```bash
npm ci && npm run build
```
