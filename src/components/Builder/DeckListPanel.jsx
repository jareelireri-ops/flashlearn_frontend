import { Globe, Lock, Archive, BookOpen } from 'lucide-react'

// creating a list of the decks on the left
function DeckListPanel({ decks, loadingDecks, selectedDeck, onSelectDeck }) {
  return (
    <div className="w-full md:w-72 shrink-0 space-y-2">
      <style>{`
        .deck-loader {
          display: inline-grid;
          width: 70px;
          aspect-ratio: 1;
          animation: deck-loader-0 3s linear infinite;
        }
        .deck-loader:before,
        .deck-loader:after {
          content: "";
          grid-area: 1/1;
        }
        .deck-loader:before {
          clip-path: polygon(100% 50%,83.81% 59.06%,93.3% 75%,74.75% 74.75%,75% 93.3%,59.06% 83.81%,50% 100%,40.94% 83.81%,25% 93.3%,25.25% 74.75%,6.7% 75%,16.19% 59.06%,0% 50%,16.19% 40.94%,6.7% 25%,25.25% 25.25%,25% 6.7%,40.94% 16.19%,50% 0%,59.06% 16.19%,75% 6.7%,74.75% 25.25%,93.3% 25%,83.81% 40.94%);
          background: #1e3a8a;
          transform: rotate(0turn) translate(-12.5%) rotate(0turn);
          animation: deck-loader-1 2s linear infinite;
        }
        .deck-loader:after {
          margin: 12.5%;
          clip-path: polygon(100% 50%,78.19% 60.26%,88.3% 82.14%,65% 75.98%,58.68% 99.24%,44.79% 79.54%,25% 93.3%,27.02% 69.28%,3.02% 67.1%,20% 50%,3.02% 32.9%,27.02% 30.72%,25% 6.7%,44.79% 20.46%,58.68% 0.76%,65% 24.02%,88.3% 17.86%,78.19% 39.74%);
          background: #ef4444;
        }
        @keyframes deck-loader-0 { to { rotate: 1turn; } }
        @keyframes deck-loader-1 { to { transform: rotate(-1turn) translate(-12.5%) rotate(.75turn); } }
      `}</style>
      {loadingDecks ? (
        <div className="flex justify-center py-10">
          <div className="deck-loader" />
        </div>
      ) : decks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
          <BookOpen size={28} className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm text-slate-500 font-medium">No decks yet</p>
          <p className="text-xs text-slate-400 mt-1">Click "New Deck" to get started</p>
        </div>
      ) : (
        decks.map((deck) => (
          <button
            key={deck.id}
            onClick={() => onSelectDeck(deck)}
            className={`w-full text-left p-4 rounded-xl border transition group ${
              selectedDeck?.id === deck.id
                ? 'bg-red-50 border-red-200'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${selectedDeck?.id === deck.id ? 'text-red-600' : 'text-slate-800'}`}>
                  {deck.title}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{deck.category || 'No category'}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {deck.is_public
                  ? <Globe size={12} className="text-emerald-500" />
                  : <Lock size={12} className="text-slate-400" />
                }
                {deck.is_archived && <Archive size={12} className="text-amber-500" />}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-slate-400">{deck.num_flashcards ?? '?'} cards</span>
              {deck.difficulty_level && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full capitalize ${
                  deck.difficulty_level === 'easy' ? 'bg-emerald-50 text-emerald-600' :
                  deck.difficulty_level === 'hard' ? 'bg-red-50 text-red-500' :
                  'bg-amber-50 text-amber-600'
                }`}>
                  {deck.difficulty_level}
                </span>
              )}
            </div>
          </button>
        ))
      )}
    </div>
  )
}

export default DeckListPanel