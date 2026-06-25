import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { startStudySession, addToCollection } from '../../api/client'

function DeckDrawer({ deck, completion, isOwner, onClose }) {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  if (!deck) return null

  async function handleStartStudying() {
    if (!user) return // guests get bounced — handled by caller showing auth modal instead
    try {
      // If it's a public deck not yet in their collection, save it first
      if (!isOwner) {
        await addToCollection(deck.id).catch(() => {}) // ignore "already in collection" errors
      }
      const data = await startStudySession(deck.id)
      navigate(`/study/${deck.id}`, { state: { session: data.session } })
    } catch (err) {
      console.error('Failed to start session', err)
    }
  }

  const pct = completion?.completion_pct ?? 0

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-500">{deck.category}</span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-slate-900">{deck.title}</h2>
        <p className="text-slate-500 mt-2">{deck.description}</p>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="font-bold text-slate-900">{deck.num_flashcards}</div>
            <div className="text-xs text-slate-400">Cards</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="font-bold text-slate-900 capitalize">{deck.difficulty_level}</div>
            <div className="text-xs text-slate-400">Level</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center">
            <div className="font-bold text-slate-900">{pct}%</div>
            <div className="text-xs text-slate-400">Progress</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-red-400 rounded-full" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <h4 className="text-sm font-semibold text-slate-700 mt-6 mb-2">Card Preview</h4>
        <div className="space-y-2">
          <div className="border border-slate-200 rounded-xl p-3">
            <span className="text-[10px] font-semibold text-red-500 uppercase">Card 1</span>
            <p className="text-sm text-slate-700 mt-1">Sample flashcard question from this deck...</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-3 blur-sm select-none">
            <span className="text-[10px] font-semibold text-red-500 uppercase">Card 2</span>
            <p className="text-sm text-slate-700 mt-1">Sample flashcard question from this deck...</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-3 blur-sm select-none">
            <span className="text-[10px] font-semibold text-red-500 uppercase">Card 3</span>
            <p className="text-sm text-slate-700 mt-1">Sample flashcard question from this deck...</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6">
          <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">
            {deck.creator?.[0] || '?'}
          </div>
          <div>
            <div className="text-sm font-medium text-slate-900">{deck.creator || 'Unknown'}</div>
            <div className="text-xs text-slate-400">Deck creator</div>
          </div>
        </div>

        <button
          onClick={handleStartStudying}
          className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl transition flex items-center justify-center gap-2"
        >
          ▷ Start Studying
        </button>

        {isOwner && (
          <button
            onClick={() => navigate('/decks/manage', { state: { deckId: deck.id } })}
            className="w-full mt-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium py-3 rounded-xl transition"
          >
            Edit Deck
          </button>
        )}
      </div>
    </div>
  )
}

export default DeckDrawer