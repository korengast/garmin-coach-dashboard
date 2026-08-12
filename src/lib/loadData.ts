import type {
  Activity,
  BodyCompDay,
  DashboardData,
  DayRow,
  HypothesesFile,
  Latest,
  Meta,
  RecoveryPair,
  StrengthDay,
} from '../types/data'

const base = import.meta.env.BASE_URL || '/'

async function fetchJson<T>(path: string): Promise<T> {
  const url = `${base}${path.replace(/^\//, '')}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`)
  return res.json() as Promise<T>
}

export async function loadDashboardData(): Promise<DashboardData> {
  const [meta, latest, days, activities, recoveryPairs, strength, bodyComp, hypotheses] =
    await Promise.all([
      fetchJson<Meta>('data/meta.json'),
      fetchJson<Latest>('data/latest.json'),
      fetchJson<DayRow[]>('data/series/days.json'),
      fetchJson<Activity[]>('data/series/activities.json'),
      fetchJson<RecoveryPair[]>('data/series/recovery_pairs.json'),
      fetchJson<StrengthDay[]>('data/series/strength.json'),
      fetchJson<BodyCompDay[]>('data/series/body_comp.json'),
      fetchJson<HypothesesFile>('data/hypotheses.json'),
    ])
  return { meta, latest, days, activities, recoveryPairs, strength, bodyComp, hypotheses }
}
