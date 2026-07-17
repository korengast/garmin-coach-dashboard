export type Readiness = {
  score: number
  band: 'green' | 'yellow' | 'red' | string
  reasons: string[]
}

export type DayRow = {
  date: string
  sleep_score?: number | null
  sleep_hours?: number | null
  sleep_need_min?: number | null
  sleep_need_feedback?: string | null
  training_feedback?: string | null
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
  debt_h?: number | null
  has_capoeira?: boolean
  evening_hard?: boolean
  train_min?: number | null
}

export type Latest = {
  schema_version: number
  updated_at: string
  timezone: string
  athlete_label: string
  privacy_note?: string
  today: DayRow & { readiness: Readiness }
  headline: string
  focus: string[]
  doing_well: string[]
  windows: {
    days_14: Record<string, number | null | undefined>
  }
  sport_notes?: Record<string, string>
  insights_window?: string
  cum_debt_h?: number
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
  distance_m?: number
  steps?: number
  mod?: number
  vig?: number
  bb_diff?: number
  te_label?: string
  vo2?: number
  stroller?: boolean
}

export type RecoveryPair = {
  date: string
  run: { id: number; avg_hr?: number; max_hr?: number; duration_min?: number; distance_m?: number }
  walk: { id: number; avg_hr?: number; max_hr?: number; min_hr?: number; duration_min?: number }
  grade: 'A' | 'B' | 'C' | string
  stroller_run?: boolean
}

export type CoachNotes = {
  updated_at: string
  notes: { date: string; category: string; text: string }[]
}

export type Meta = {
  schema_version: number
  updated_at: string
  timezone: string
  athlete_label: string
  source?: string
}

export type InsightCard = {
  id: string
  title: string
  severity: 'high' | 'medium' | 'low' | string
  text: string
}

export type Correlation = {
  a: string
  b: string
  r: number
  n: number
  kind: string
  label?: string
  meaning?: string
}

export type Insights = {
  schema_version: number
  updated_at: string
  window: string
  n_days: number
  n_activities: number
  headline: string
  cards: InsightCard[]
  correlations: Correlation[]
  monthly: {
    month: string
    sleep_h?: number | null
    hrv?: number | null
    rhr?: number | null
    stress?: number | null
    steps?: number | null
    capoeira_days?: number
    run_days?: number
  }[]
  dow: {
    dow: string
    sleep_h?: number | null
    hrv?: number | null
    steps?: number | null
    stress?: number | null
    capoeira_rate?: number
    intensity?: number | null
  }[]
  streaks: Record<string, number>
  cum_debt_h?: number
  sport_minutes?: Record<string, number>
  actions: string[]
  metric_highlights?: HomeMetric[]
}

export type SeriesPoint = { date?: string; label?: string; value: number }

export type HomeMetric = {
  id: string
  label: string
  value?: number | null
  unit?: string
  delta?: number | null
  delta_label?: string
  trend?: string
  sub?: string
  why?: string
}

export type CorrTrend = {
  label: string
  explain: string
  physical?: string
  why_interesting?: string
  now_30d?: number | null
  delta_vs_60d_ago?: number | null
  series: SeriesPoint[]
}

export type HomeTrends = {
  schema_version: number
  updated_at: string
  window: string
  n_days: number
  headline_numbers: string
  metrics: HomeMetric[]
  min_hr_trends: {
    note: string
    weekly_chart: SeriesPoint[]
    quarterly_chart: SeriesPoint[]
    sma28: SeriesPoint[]
    sma90: SeriesPoint[]
    daily: SeriesPoint[]
    yearly_window: {
      mean: number
      min: number
      max: number
      start_mean_30: number
      end_mean_30: number
      delta_start_end: number
    }
    weekly_raw?: { week: number; rhr_mean: number; rhr_min: number; n: number }[]
    quarterly?: { quarter: string; rhr_mean: number; rhr_min: number; n: number }[]
  }
  corr_trends: Record<string, CorrTrend>
  series: Record<string, SeriesPoint[]>
  capoeira_sleep_tax_by_block: {
    block: string
    after_cap?: number | null
    after_other?: number | null
    delta?: number | null
    n_cap: number
  }[]
  slopes_per_month: Record<string, number | null>
  fitness_recovery_gap: {
    hrv_change: number
    debt_change: number
    rhr_change: number
  }
  explanations: { title: string; text: string }[]
}

export type DashboardData = {
  meta: Meta
  latest: Latest
  days: DayRow[]
  activities: Activity[]
  recoveryPairs: RecoveryPair[]
  notes: CoachNotes
  insights: Insights
  homeTrends: HomeTrends
}
