export type Band = 'green' | 'neutral' | 'amber' | 'red'

export type Horizon = {
  window_days: number
  mean: number | null
  sd?: number | null
  z?: number | null
  percentile?: number | null
  delta: number | null
  band: Band
}

export type Metric = {
  id: string
  label: string
  value: number | null
  unit: string
  higher_is_better: boolean
  short: Horizon
  long: Horizon
}

export type DayRow = {
  date: string
  sleep_score?: number | null
  sleep_hours?: number | null
  sleep_need_min?: number | null
  deep_pct?: number | null
  rem_pct?: number | null
  light_pct?: number | null
  rhr?: number | null
  hrv?: number | null
  hrv_status?: string | null
  stress_avg?: number | null
  stress_max?: number | null
  steps?: number | null
  bb_start?: number | null
  bb_end?: number | null
  bb_charged?: number | null
  bb_drained?: number | null
  mod_min?: number | null
  vig_min?: number | null
  intensity_min?: number | null
  debt_h?: number | null
  has_capoeira?: boolean
  evening_hard?: boolean
  train_min?: number | null
  vo2?: number | null
  pullup_reps?: number | null
  weight_kg?: number | null
}

export type Latest = {
  schema_version: number
  updated_at: string
  timezone: string
  athlete_label: string
  date: string
  metrics: Metric[]
  readiness: { band: Band; reasons: string[] }
}

export type Activity = {
  id: number
  name: string
  garmin_type?: string
  sport?: string
  start?: string
  duration_min?: number
  calories?: number
  avg_hr?: number
  max_hr?: number
  min_hr?: number
  distance_m?: number
  steps?: number
  mod?: number
  vig?: number
  te_label?: string
  vo2?: number
  stroller?: boolean
}

export type RecoveryPair = {
  date: string
  run: {
    id: number
    avg_hr?: number
    max_hr?: number
    duration_min?: number
    distance_m?: number
  }
  walk: {
    id: number
    avg_hr?: number
    max_hr?: number
    min_hr?: number
    duration_min?: number
  }
  grade: 'A' | 'B' | 'C' | string
  stroller_run?: boolean
}

export type StrengthDay = {
  date: string
  reps: number
  sets: number
}

export type BodyCompDay = {
  date: string
  weight_kg?: number | null
  waist_cm?: number | null
}

export type Hypothesis = {
  id: string
  title: string
  status: Band
  n: number
  short?: Record<string, number | null | undefined>
  long?: Record<string, number | null | undefined>
  series: Record<string, string | number | boolean | null | undefined>[]
  teaser?: string
  why: string
}

export type HypothesesFile = {
  schema_version: number
  updated_at: string
  items: Hypothesis[]
}

export type Meta = {
  schema_version: number
  updated_at: string
  timezone: string
  athlete_label: string
  window?: { start: string; end: string; n_days: number }
  source?: string
}

export type DashboardData = {
  meta: Meta
  latest: Latest
  days: DayRow[]
  activities: Activity[]
  recoveryPairs: RecoveryPair[]
  strength: StrengthDay[]
  bodyComp: BodyCompDay[]
  hypotheses: HypothesesFile
}
