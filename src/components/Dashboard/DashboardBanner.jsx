import { Flame } from 'lucide-react'

function DashboardBanner({ user, streak, cardsDue }) {
  const firstName = (user?.name?.split(' ')[0] || 'there').toUpperCase()

  return (
    <div className="bg-slate-900 rounded-2xl px-6 py-5 text-white shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-red-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative z-10">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Good morning</p>
        <h1 className="text-xl font-bold mt-1 uppercase">
          {firstName} — YOU'RE ON A <span className="text-red-400">{streak}-DAY STREAK!</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          {cardsDue} cards due today. Review them to stay on track.
        </p>
      </div>
    </div>
  )
}

export default DashboardBanner