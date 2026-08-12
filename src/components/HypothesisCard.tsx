import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { bandPip } from '../lib/bands'
import { Explain } from './Explain'
import type { Hypothesis } from '../types/data'

function shortDate(iso: string): string {
  const parts = iso.split('-')
  if (parts.length < 3) return iso
  return `${Number(parts[1])}/${Number(parts[2])}`
}

function numericKeys(row: Record<string, unknown>): string[] {
  return Object.keys(row).filter((k) => k !== 'date' && typeof row[k] === 'number')
}

const COLORS = ['#2dd4bf', '#fb923c', '#818cf8', '#f472b6']

export function HypothesisCard({ h }: { h: Hypothesis }) {
  const sample = h.series.find((r) => numericKeys(r).length > 0) ?? h.series[0]
  const keys = sample ? numericKeys(sample) : []
  const chartData = h.series.slice(-90).map((r) => ({
    ...r,
    label: typeof r.date === 'string' ? shortDate(r.date) : '',
  }))
  return (
    <div className="card">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-sm font-medium text-slate-100">{h.title}</div>
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${bandPip(h.status)}`} title={h.status} />
      </div>
      {chartData.length > 1 && keys.length > 0 ? (
        <div className="w-full" style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 10 }}
                width={30}
                axisLine={false}
                tickLine={false}
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }}
              />
              {keys.slice(0, 3).map((k, i) => (
                <Line
                  key={k}
                  type="monotone"
                  dataKey={k}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={1.8}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : null}
      <Explain teaser={h.teaser} why={h.why} />
    </div>
  )
}
