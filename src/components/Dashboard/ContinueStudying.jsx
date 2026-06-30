import { BookOpen, Play, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function ContinueStudying({ activeSessions }) {
  const navigate = useNavigate()

  const decksInProgress = activeSessions.slice(0, 3)

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

      {decksInProgress.length > 0 ? (
        <div className="space-y-6">
          {decksInProgress.map((session) => (
            <div key={session.id} className="group relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <BookOpen size={16} className="text-slate-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{session.deck_title}</h3>
                    <p className="text-xs text-slate-400 font-medium">
                      Resume at card {session.current_card_index + 1}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/study/${session.deck_id}`)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition"
                >
                  <Play size={14} fill="currentColor" />
                </button>
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