import { Flame, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function DashboardBanner({ user, streak, cardsDue }) {
  const navigate = useNavigate()
  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative z-10 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md text-orange-400">
          <Flame size={28} />
        </div>
        <div>
          <p className="text-slate-300 font-medium mb-1">Good morning,</p>
          <h1 className="text-2xl font-bold">
            {firstName} — you're on a <span className="text-red-400">{streak}-day streak!</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            You have <span className="text-white font-bold">{cardsDue} cards</span> due today. Review them to stay on track.
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate('/library', { state: { tab: 'collection' } })}
        className="relative z-10 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition shadow-lg shadow-red-500/20 flex items-center gap-2 whitespace-nowrap"
      >
        <Play size={16} fill="currentColor" /> Review Now
      </button>
    </div>
  )
}

export default DashboardBanner