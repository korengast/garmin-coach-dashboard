import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ChartPoint } from '../lib/series'
import { Explain } from './Explain'

export function TrendChart({
  data,
  color = '#2dd4bf',
  height = 200,
  teaser,
  why,
  yHint,
}: {
  data: ChartPoint[]
  color?: string
  height?: number
  teaser?: string
  why?: string
  yHint?: string
}) {
  return (
    <div className="card">
      {yHint ? <div className="mb-1 text-[11px] uppercase tracking-wider text-slate-500">{yHint}</div> : null}
      <div className="w-full" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.28} />
                <stop offset="100%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
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
              width={32}
              axisLine={false}
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 12 }}
              labelStyle={{ color: '#cbd5e1' }}
            />
            <Area
              type="monotone"
              dataKey="bandHi"
              stroke="none"
              fill={color}
              fillOpacity={0.08}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="longMean"
              stroke="#64748b"
              strokeDasharray="4 4"
              strokeWidth={1}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="sma28"
              stroke="#94a3b8"
              strokeWidth={1.25}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              connectNulls
              dot={(props) => {
                const { cx, cy, payload } = props
                if (payload?.anomaly && cx != null && cy != null) {
                  return <circle cx={cx} cy={cy} r={3.5} fill="#fb7185" stroke="#0f172a" strokeWidth={1} />
                }
                return <g />
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {why ? <Explain teaser={teaser} why={why} /> : null}
    </div>
  )
}
