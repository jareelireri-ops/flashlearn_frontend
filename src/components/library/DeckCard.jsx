import { Plus, Minus, Sparkles, Users } from 'lucide-react'

const DIFFICULTY_STYLES = {
  easy: 'bg-emerald-50 text-emerald-600',
  medium: 'bg-amber-50 text-amber-600',
  hard: 'bg-red-50 text-red-600',
}

function DeckCard({ deck, completion, onClick, onSave, onRemove, hasNewCards }) {
  const pct = completion?.completion_pct ?? null
  const isDone = pct === 100

  return (
    <div
      onClick={onClick}
      className="relative bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group"
    >
      {/* Quick Save Button Shows as a plus on hover) */}
      {onSave && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSave()
          }}
          className="absolute top-3 right-3 p-1.5 bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
          title="Save to My Collection"
        >
          <Plus size={16} strokeWidth={3} />
        </button>
      )}

      {/* Remove from Collection Button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="absolute top-3 right-3 p-1.5 bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
          title="Remove from Collection"
        >
          <Minus size={16} strokeWidth={3} />
        </button>
      )}

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-500">{deck.category}</span>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            DIFFICULTY_STYLES[deck.difficulty_level] || 'bg-slate-100 text-slate-500'
          }`}
        >
          {deck.difficulty_level}
        </span>
      </div>

      <div className="flex items-center gap-1.5 pr-6">
        <h3 className="font-semibold text-slate-900">{deck.title}</h3>
        {hasNewCards && (
          <span
            className="flex items-center gap-0.5 text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full shrink-0"
            title="New cards have been added since you last studied this deck"
          >
            <Sparkles size={10} /> NEW CARDS
          </span>
        )}
      </div>
      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{deck.description}</p>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">{deck.num_flashcards} cards</span>
          {deck.num_learners != null && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Users size={11} /> {deck.num_learners} learners
            </span>
          )}
        </div>
        {pct !== null && (
          isDone ? (
            <span className="text-xs font-medium text-emerald-600">✓ Done</span>
          ) : (
            <span className="text-xs font-medium text-slate-500">{pct}%</span>
          )
        )}
      </div>

      {pct !== null && (
        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
          <div
            className={`h-full rounded-full ${isDone ? 'bg-emerald-500' : 'bg-red-400'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  )
}

export default DeckCard