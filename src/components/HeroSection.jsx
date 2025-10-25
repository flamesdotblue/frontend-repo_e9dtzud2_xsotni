import Spline from '@splinetool/react-spline'

export default function HeroSection() {
  return (
    <section className="relative h-[520px] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/80" />

      <div className="relative z-10 flex h-full items-center px-6 sm:px-10">
        <div className="max-w-2xl text-white">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Live spending insights
          </div>
          <h1 className="text-4xl font-semibold sm:text-5xl md:text-6xl">
            Track money beautifully
          </h1>
          <p className="mt-4 text-slate-300 text-lg">
            Add, categorize, and analyze your spending with smart recommendations that help you save.
          </p>
        </div>
      </div>
    </section>
  )
}
