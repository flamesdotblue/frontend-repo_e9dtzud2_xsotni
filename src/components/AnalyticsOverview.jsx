import { useEffect, useMemo, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

export default function AnalyticsOverview({ refreshSignal }) {
  const [summary, setSummary] = useState(null)
  const [recent, setRecent] = useState([])

  const load = async () => {
    const s = await fetch(`${API}/summary`).then(r=>r.json())
    setSummary(s)
    const tx = await fetch(`${API}/transactions?limit=8`).then(r=>r.json())
    setRecent(tx)
  }

  useEffect(() => { load() }, [])
  useEffect(() => { if (refreshSignal) load() }, [refreshSignal])

  const cards = useMemo(() => {
    if (!summary) return []
    return [
      { title: 'Total income', value: `$${summary.total_income?.toLocaleString?.()}` || '$0', tone: 'emerald' },
      { title: 'Total expense', value: `$${summary.total_expense?.toLocaleString?.()}` || '$0', tone: 'rose' },
      { title: 'Net', value: `$${summary.net?.toLocaleString?.()}` || '$0', tone: summary.net >= 0 ? 'emerald' : 'rose' },
      { title: 'Transactions', value: summary.count || 0, tone: 'sky' },
    ]
  }, [summary])

  const categories = Object.entries(summary?.by_category || {})
    .sort((a,b)=>b[1]-a[1]).slice(0,6)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="xl:col-span-2 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((c, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-4">
              <div className={`text-sm text-slate-600`}>{c.title}</div>
              <div className={`mt-2 text-2xl font-semibold text-slate-800`}>{c.value}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-800 font-semibold text-lg">Top categories</h3>
          </div>
          <div className="space-y-3">
            {categories.length === 0 && (
              <div className="text-slate-500 text-sm">No expenses yet. Add your first transaction.</div>
            )}
            {categories.map(([name, total]) => {
              const max = categories[0]?.[1] || 1
              const pct = Math.round((total / max) * 100)
              return (
                <div key={name} className="">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>{name}</span>
                    <span>${total.toLocaleString?.() || total}</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="xl:col-span-1 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-800 font-semibold text-lg">Recent activity</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {recent.map(tx => (
            <div key={tx.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-800">{tx.merchant || tx.category}</div>
                <div className="text-xs text-slate-500">{new Date(tx.date || tx.created_at).toLocaleDateString?.() || ''} • {tx.category}</div>
              </div>
              <div className={`text-sm font-semibold ${tx.type==='expense'?'text-rose-600':'text-emerald-600'}`}>{tx.type==='expense'?'-':'+'}${tx.amount}</div>
            </div>
          ))}
          {recent.length === 0 && (
            <div className="py-10 text-center text-slate-500 text-sm">No transactions yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
