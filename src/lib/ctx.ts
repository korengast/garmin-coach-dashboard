import { createContext, useContext } from 'react'
import type { DashboardData } from '../types/data'

export const DashCtx = createContext<DashboardData | null>(null)

export function useDash(): DashboardData {
  const v = useContext(DashCtx)
  if (!v) throw new Error('dashboard data missing')
  return v
}
