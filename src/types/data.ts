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

export type DashboardData = {
  meta: Meta
  latest: Latest
  days: DayRow[]
  activities: Activity[]
  recoveryPairs: RecoveryPair[]
  notes: CoachNotes
}
