import { useCallback, useState } from 'react'
import HeroSection from './components/HeroSection'
import AddTransactionForm from './components/AddTransactionForm'
import AnalyticsOverview from './components/AnalyticsOverview'
import InsightsPanel from './components/InsightsPanel'

function App() {
  const [refreshKey, setRefreshKey] = useState(0)
  const refreshAll = useCallback(() => setRefreshKey(k => k + 1), [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <HeroSection />

        <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <AddTransactionForm onAdded={refreshAll} />
            <AnalyticsOverview refreshSignal={refreshKey} />
          </div>
          <div className="xl:col-span-1 space-y-6">
            <InsightsPanel refreshSignal={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
