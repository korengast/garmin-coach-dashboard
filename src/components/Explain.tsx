import { useState } from 'react'

export function Explain({ teaser, why }: { teaser?: string; why: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-left text-[11px] leading-snug text-slate-500 hover:text-slate-300"
      >
        <span className="mr-1 text-slate-600">{open ? '▾' : '▸'}</span>
        {teaser || 'Why this is interesting'}
      </button>
      {open ? <p className="mt-1.5 text-[12px] leading-relaxed text-slate-400">{why}</p> : null}
    </div>
  )
}
