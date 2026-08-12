import { NavLink, Outlet } from 'react-router-dom'
import { useDash } from '../lib/ctx'

const TABS = [
  { to: '/', label: 'Today', end: true },
  { to: '/sleep', label: 'Sleep', end: false },
  { to: '/load', label: 'Load', end: false },
  { to: '/long', label: 'Long', end: false },
]

export function Shell() {
  const { meta, latest } = useDash()
  const updated = meta.updated_at?.slice(0, 16).replace('T', ' ')
  return (
    <div className="mx-auto min-h-screen max-w-5xl px-3 pb-16 pt-4 sm:px-6">
      <header className="mb-4 flex items-end justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Garmin coach</div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-50">{latest.date}</h1>
        </div>
        <div className="text-right text-[11px] text-slate-500">
          <div>{meta.window ? `${meta.window.n_days}d` : ''}</div>
          <div>{updated}</div>
        </div>
      </header>
      <nav className="mb-4 flex gap-1 rounded-2xl bg-slate-900/70 p-1 ring-1 ring-slate-800">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `nav-btn ${isActive ? 'nav-btn-active' : 'nav-btn-idle'}`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}
