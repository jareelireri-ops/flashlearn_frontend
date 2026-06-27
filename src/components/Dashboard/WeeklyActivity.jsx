import { BarChart3 } from 'lucide-react'

function WeeklyActivity({ dailyActivity }) {
  const maxCount = Math.max(1, ...dailyActivity.map((d) => d.cards_reviewed))

  const dayLabel = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 size={18} className="text-slate-400" />
        <h2 className="text-lg font-bold text-slate-900">Weekly Activity</h2>
      </div>

      {dailyActivity.length > 0 ? (
        <div className="flex items-end justify-between gap-3 h-40">
          {dailyActivity.map((day) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-xs font-bold text-slate-700">{day.cards_reviewed}</span>
              <div className="w-full bg-slate-100 rounded-lg overflow-hidden flex flex-col justify-end h-28">
                <div
                  className="w-full bg-red-500 rounded-lg transition-all duration-700"
                  style={{ height: `${(day.cards_reviewed / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-400">{dayLabel(day.date)}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 font-medium">
          No study activity recorded this week yet.
        </div>
      )}
    </div>
  )
}

export default WeeklyActivity