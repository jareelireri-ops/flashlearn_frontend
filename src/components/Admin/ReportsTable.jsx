import { useState } from 'react'
import { Flag, Trash2, Check } from 'lucide-react'

const STATUS_STYLES = {
  pending: 'bg-orange-500/10 text-orange-400',
  reviewed: 'bg-zinc-800 text-zinc-300',
  resolved: 'bg-emerald-500/10 text-emerald-400',
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function ReportsTable({ reports, onResolve, onRemoveContent }) {
  const [pendingId, setPendingId] = useState(null)

  async function handleResolve(report) {
    setPendingId(report.id)
    await onResolve(report.id, 'resolved')
    setPendingId(null)
  }

  async function handleRemove(report) {
    setPendingId(report.id)
    await onRemoveContent(report)
    setPendingId(null)
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-500 font-mono text-sm">No reports to review.</div>
    )
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <div key={report.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
              <Flag size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-zinc-200">{report.reason}</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs font-mono text-zinc-500">
                <span>
                  {report.deck_id ? `Deck #${report.deck_id}` : `Flashcard #${report.flashcard_id}`}
                </span>
                <span>·</span>
                <span>Reported {formatDate(report.created_at)}</span>
                <span
                  className={`px-2 py-0.5 rounded-md font-bold ${STATUS_STYLES[report.status] || STATUS_STYLES.pending}`}
                >
                  {report.status}
                </span>
              </div>
            </div>
          </div>

          {report.status !== 'resolved' && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleResolve(report)}
                disabled={pendingId === report.id}
                className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-300 hover:bg-emerald-500/20 hover:text-emerald-400 transition disabled:opacity-50"
              >
                <Check size={12} /> Mark Resolved
              </button>
              <button
                onClick={() => handleRemove(report)}
                disabled={pendingId === report.id}
                className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-md bg-orange-500 text-zinc-950 hover:bg-orange-400 transition disabled:opacity-50"
              >
                <Trash2 size={12} /> Remove Content
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ReportsTable