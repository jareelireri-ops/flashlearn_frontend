import { Clock, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function ReviewSchedule({ cardsDue }) {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock size={18} className="text-slate-400" />
        <h2 className="text-lg font-bold text-slate-900">Review Schedule</h2>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-slate-600">Due Now</span>
        <span className="text-sm font-bold text-red-500">{cardsDue}</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-6">
        <div className="h-full bg-red-500 rounded-full" style={{ width: cardsDue > 0 ? '100%' : '0%' }} />
      </div>

      <button
        onClick={() => navigate('/library', { state: { tab: 'collection', filter: 'due' } })}
        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition flex items-center justify-center gap-2"
      >
        <Play size={14} fill="currentColor" /> Start {cardsDue} Due Cards
      </button>
    </div>
  )
}

export default ReviewSchedule