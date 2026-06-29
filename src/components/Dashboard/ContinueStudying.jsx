import { BookOpen, Play, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function ContinueStudying({ completionStats }) {
  const navigate = useNavigate()

  const activeDecks = completionStats
    .filter((c) => c.last_reviewed_at)
    .sort((a, b) => new Date(b.last_reviewed_at) - new Date(a.last_reviewed_at))
    .slice(0, 3)

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900">Continue Studying</h2>
        <button
          onClick={() => navigate('/library')}
          className="text-sm font-semibold text-red-500 hover:text-red-600 transition flex items-center gap-1"
        >
          <Sparkles size={14} /> Browse Library
        </button>
      </div>

      {activeDecks.length > 0 ? (
        <div className="space-y-6">
          {activeDecks.map((deck) => (
            <div key={deck.deck_id} className="group relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <BookOpen size={16} className="text-slate-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{deck.deck_title}</h3>
                    <p className="text-xs text-slate-400 font-medium">{deck.total_cards} cards total</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-700">{deck.completion_pct}%</span>
                  <button
                    onClick={() => navigate(`/study/${deck.deck_id}`)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition"
                  >
                    <Play size={14} fill="currentColor" />
                  </button>
                </div>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all duration-1000"
                  style={{ width: `${deck.completion_pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 font-medium">
          You have no decks currently in progress.
          <br />
          <button onClick={() => navigate('/library')} className="text-red-500 mt-2 hover:underline">
            Start a new deck today!
          </button>
        </div>
      )}
    </div>
  )
}

export default ContinueStudying