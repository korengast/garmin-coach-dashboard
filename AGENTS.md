# AGENTS.md — garmin-coach-dashboard

## Mission
Static **GitHub Pages** health/sports dashboard. Data is JSON under `public/data/`. Hermes updates numbers. **No Garmin API, no tokens, no backend, no Firebase.**

## Hard rules
- Do NOT add garminconnect, garth, OAuth, env secrets, or server code.
- Do NOT copy PulseLogic server/paywall/auth — UI inspiration only.
- Capoeira: display `mixed_martial_arts` / MMA labels as **Capoeira**.
- Mobile-first dark theme.
- Vite `base` must work on GitHub Project Pages: `/garmin-coach-dashboard/`
- Use **HashRouter** so Pages deep links work.

## Visual priority (rule of thumb, not layout law)
Charts get the most visual weight, then numbers, then text. A chart may sit next to its number and a folded explanation. First paint must read as **data you can see**, not an essay.

Every trend/hypothesis has a **clear, interesting** explanation (mechanism + why it matters for Koren — not a textbook definition). Text starts **folded**; expand on click. Generic “HRV is recovery” copy is a fail.

## Data files (v3 — read these)
- `public/data/meta.json`
- `public/data/latest.json` — metric chips with short (14d) + long horizons
- `public/data/series/days.json`
- `public/data/series/activities.json`
- `public/data/series/recovery_pairs.json`
- `public/data/series/strength.json`
- `public/data/series/body_comp.json`
- `public/data/hypotheses.json`

Ignore `home_trends.json`, `insights.json`, `history/*`, `coach/notes.json` (legacy).

Types: `src/types/data.ts`. Band helper: `src/lib/bands.ts`.

## Tabs
Today | Sleep | Load | Long

## Stack
Vite + React 19 + TypeScript + Tailwind CSS + Recharts.

## Verify
```bash
npm run test:bands && npm run build && npm run lint
```
