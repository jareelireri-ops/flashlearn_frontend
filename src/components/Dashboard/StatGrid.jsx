import { Flame, Clock, Target, CalendarCheck } from 'lucide-react'

function StatGrid({ streak, cardsDue, totalReviews, totalSessions }) {
  const stats = [
    { icon: Flame, color: 'text-orange-500', value: streak, unit: 'days', label: 'Day Streak' },
    { icon: Clock, color: 'text-blue-500', value: cardsDue, unit: 'cards', label: 'Due Now' },
    { icon: Target, color: 'text-emerald-500', value: totalReviews, unit: null, label: 'Total Reviews' },
    { icon: CalendarCheck, color: 'text-purple-500', value: totalSessions, unit: null, label: 'Total Sessions' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, color, value, unit, label }) => (
        <div key={label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-32">
          <Icon size={20} className={`${color} mb-2`} />
          <div>
            <div className="text-2xl font-bold text-slate-900">
              {value} {unit && <span className="text-sm font-medium text-slate-400">{unit}</span>}
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">{label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatGrid