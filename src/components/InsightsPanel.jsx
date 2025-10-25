import { useEffect, useState } from 'react'
import { Lightbulb, Sparkles } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL

export default function InsightsPanel({ refreshSignal }) {
  const [data, setData] = useState({ recommendations: [], summary: null })

  const load = async () => {
    const res = await fetch(`${API}/recommendations`).then(r=>r.json())
    setData(res)
  }

  useEffect(() => { load() }, [])
  useEffect(() => { if (refreshSignal) load() }, [refreshSignal])

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-9 w-9 grid place-items-center rounded-lg bg-amber-100 text-amber-700">
          <Lightbulb size={18} />
        </div>
        <h3 className="text-slate-800 font-semibold text-lg">Smart recommendations</h3>
      </div>

      <div className="space-y-4">
        {data.recommendations.map((r, idx) => (
          <div key={idx} className="rounded-xl border border-slate-100 p-4 bg-gradient-to-br from-amber-50 to-white">
            <div className="flex items-center justify-between">
              <div className="font-medium text-slate-800">{r.title}</div>
              {typeof r.metric !== 'undefined' && (
                <div className="text-xs text-slate-500">{r.metric}%</div>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-600">{r.advice}</p>
          </div>
        ))}
        {data.recommendations.length === 0 && (
          <div className="text-sm text-slate-500">Add a few transactions to unlock personalized tips.</div>
        )}
        <div className="pt-2 text-xs text-slate-400 flex items-center gap-1">
          <Sparkles size={14} />
          Private, on-device heuristics — no external AI needed.
        </div>
      </div>
    </div>
  )
}
