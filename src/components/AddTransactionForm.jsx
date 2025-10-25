import { useEffect, useMemo, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL

export default function AddTransactionForm({ onAdded }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    amount: '',
    type: 'expense',
    category: '',
    merchant: '',
    note: '',
    date: new Date().toISOString().slice(0, 10),
  })

  useEffect(() => {
    fetch(`${API}/categories`).then(r => r.json()).then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    if (!form.category && categories.length > 0) {
      setForm(f => ({ ...f, category: categories[0].name }))
    }
  }, [categories])

  const canSubmit = useMemo(() => {
    const amt = parseFloat(form.amount)
    return !loading && !isNaN(amt) && amt > 0 && form.category
  }, [form, loading])

  const submit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    try {
      const payload = {
        amount: parseFloat(form.amount),
        type: form.type,
        category: form.category,
        merchant: form.merchant || undefined,
        note: form.note || undefined,
        date: new Date(form.date).toISOString(),
      }
      const res = await fetch(`${API}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to add')
      setForm({ amount: '', type: 'expense', category: form.category, merchant: '', note: '', date: new Date().toISOString().slice(0, 10) })
      onAdded?.()
    } catch (err) {
      console.error(err)
      alert('Could not add transaction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-5">
      <h3 className="text-slate-800 font-semibold text-lg mb-4">Quick add</h3>
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
        <div className="md:col-span-1">
          <label className="text-sm text-slate-600">Type</label>
          <div className="mt-1 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
            <button type="button" onClick={() => setForm(f => ({ ...f, type: 'expense' }))} className={`py-2 text-sm rounded-md ${form.type==='expense'?'bg-white shadow text-slate-900':'text-slate-600'}`}>Expense</button>
            <button type="button" onClick={() => setForm(f => ({ ...f, type: 'income' }))} className={`py-2 text-sm rounded-md ${form.type==='income'?'bg-white shadow text-slate-900':'text-slate-600'}`}>Income</button>
          </div>
        </div>
        <div className="md:col-span-1">
          <label className="text-sm text-slate-600">Amount</label>
          <input type="number" step="0.01" min="0" value={form.amount} onChange={e=>setForm(f=>({...f, amount:e.target.value}))} className="mt-1 w-full rounded-md border-slate-200 focus:border-emerald-400 focus:ring-emerald-400" placeholder="0.00" required />
        </div>
        <div className="md:col-span-1">
          <label className="text-sm text-slate-600">Category</label>
          <select value={form.category} onChange={e=>setForm(f=>({...f, category:e.target.value}))} className="mt-1 w-full rounded-md border-slate-200 focus:border-emerald-400 focus:ring-emerald-400">
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-1">
          <label className="text-sm text-slate-600">Merchant</label>
          <input value={form.merchant} onChange={e=>setForm(f=>({...f, merchant:e.target.value}))} className="mt-1 w-full rounded-md border-slate-200 focus:border-emerald-400 focus:ring-emerald-400" placeholder="Optional" />
        </div>
        <div className="md:col-span-1">
          <label className="text-sm text-slate-600">Date</label>
          <input type="date" value={form.date} onChange={e=>setForm(f=>({...f, date:e.target.value}))} className="mt-1 w-full rounded-md border-slate-200 focus:border-emerald-400 focus:ring-emerald-400" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-slate-600">Note</label>
          <input value={form.note} onChange={e=>setForm(f=>({...f, note:e.target.value}))} className="mt-1 w-full rounded-md border-slate-200 focus:border-emerald-400 focus:ring-emerald-400" placeholder="Optional" />
        </div>
        <div className="md:col-span-1 md:ml-auto">
          <button type="submit" disabled={!canSubmit} className="w-full rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-medium py-3 transition">
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  )
}
