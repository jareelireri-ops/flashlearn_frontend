const DIFFICULTY_STYLES = {
  easy: 'bg-emerald-50 text-emerald-600',
  medium: 'bg-amber-50 text-amber-600',
  hard: 'bg-red-50 text-red-600',
}

function DeckCard({ deck, completion, onClick }) {
  const pct = completion?.completion_pct ?? null
  const isDone = pct === 100

  return (
    <div
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
    >
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

      <h3 className="font-semibold text-slate-900">{deck.title}</h3>
      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{deck.description}</p>

      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-slate-400">{deck.num_flashcards} cards</span>
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