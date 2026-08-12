import { useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell'
import { DashCtx } from './lib/ctx'
import { loadDashboardData } from './lib/loadData'
import { LoadPage } from './pages/Load'
import { LongPage } from './pages/Long'
import { SleepPage } from './pages/Sleep'
import { TodayPage } from './pages/Today'
import type { DashboardData } from './types/data'

export default function App() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
      .then(setData)
      .catch((e: unknown) => setErr(e instanceof Error ? e.message : 'load failed'))
  }, [])

  if (err) {
    return <div className="p-6 text-rose-300">{err}</div>
  }
  if (!data) {
    return <div className="p-6 text-slate-500">Loading…</div>
  }

  return (
    <DashCtx.Provider value={data}>
      <HashRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<TodayPage />} />
            <Route path="/sleep" element={<SleepPage />} />
            <Route path="/load" element={<LoadPage />} />
            <Route path="/long" element={<LongPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </DashCtx.Provider>
  )
}
