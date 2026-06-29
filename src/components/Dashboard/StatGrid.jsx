import { Flame, Clock, Target, CalendarCheck } from 'lucide-react'

function StatGrid({ streak, cardsDue, totalReviews, totalSessions }) {
  const stats = [
    { icon: Flame, color: 'text-red-500', bg: 'bg-red-50', value: streak, label: 'Day Streak' },
    { icon: Clock, color: 'text-red-500', bg: 'bg-red-50', value: cardsDue, label: 'Due Now' },
    { icon: Target, color: 'text-red-500', bg: 'bg-red-50', value: totalReviews, label: 'Total Reviews' },
    { icon: CalendarCheck, color: 'text-red-500', bg: 'bg-red-50', value: totalSessions, label: 'Sessions' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, color, bg, value, label }) => (
        <div key={label} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
            <Icon size={16} className={color} />
          </div>
          <div className="text-2xl font-bold text-slate-900">{value}</div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-1">{label}</div>
        </div>
      ))}
    </div>
  )
}

export default StatGrid