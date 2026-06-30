import { Plus } from 'lucide-react'
import NewCardForm from './NewCardForm'
import FlashcardRow from './FlashcardRow'

//  Flashcards section having: the header, Add Card, new-card and list of cards made
function FlashcardsPanel({
  flashcards,
  loadingCards,
  showNewCardForm,
  setShowNewCardForm,
  onAddCard,
  onSaveCard,
  onDeleteCardRequest,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800">
          Flashcards
          <span className="ml-2 text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {flashcards.length}
          </span>
        </h3>
        {!showNewCardForm && (
          <button
            onClick={() => setShowNewCardForm(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 transition"
          >
            <Plus size={15} /> Add Card
          </button>
        )}
      </div>

      <div className="space-y-3">
        {showNewCardForm && (
          <NewCardForm
            onAdd={onAddCard}
            onCancel={() => setShowNewCardForm(false)}
          />
        )}

        {loadingCards ? (
          <p className="text-sm text-slate-400 text-center py-8">Loading cards...</p>
        ) : flashcards.length === 0 && !showNewCardForm ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl">
            <p className="text-sm text-slate-400">No cards yet — add your first one above</p>
          </div>
        ) : (
          flashcards.map((card) => (
            <FlashcardRow
              key={card.id}
              card={card}
              onSave={onSaveCard}
              onDelete={onDeleteCardRequest}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default FlashcardsPanel