import { Globe, Lock, Archive, BookOpen } from 'lucide-react'

// creating a list of the decks on the left
function DeckListPanel({ decks, loadingDecks, selectedDeck, onSelectDeck }) {
  return (
    <div className="w-72 shrink-0 space-y-2">
      {loadingDecks ? (
        <p className="text-sm text-slate-400 text-center py-10">Loading decks...</p>
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