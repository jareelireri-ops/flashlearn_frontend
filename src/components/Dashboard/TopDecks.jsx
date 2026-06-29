import { TrendingUp } from 'lucide-react'

function TopDecks({ topDecks = [] }) {
  if (!topDecks.length) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-slate-400" />
          <h2 className="text-lg font-bold text-slate-900">Most Studied Decks</h2>
        </div>
        <p className="text-sm text-slate-400">Complete a study session to see your top decks here.</p>
      </div>
    )
  }

  const maxReviews = topDecks[0]?.total_reviews || 1

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={18} className="text-slate-400" />
        <h2 className="text-lg font-bold text-slate-900">Most Studied Decks</h2>
      </div>

      <div className="space-y-4">
        {topDecks.map((deck, index) => (
          <div key={deck.deck_id}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-slate-700 truncate pr-2">
                {index + 1}. {deck.deck_title}
              </span>
              <span className="text-xs font-bold text-slate-500 shrink-0">
                {deck.total_reviews} reviews
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-400 rounded-full"
                style={{ width: `${(deck.total_reviews / maxReviews) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopDecks