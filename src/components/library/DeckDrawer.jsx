import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Lock } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { UIContext } from '../../context/UIContext'
import { startStudySession, addToCollection } from '../../api/client'

function DeckDrawer({ deck, completion, isOwner, onClose }) {
  const { user } = useContext(AuthContext)
  const { openAuthModal } = useContext(UIContext)
  const navigate = useNavigate()

  if (!deck) return null

  async function handleStartStudying() {
    if (!user) {
      onClose() // Close drawer
      openAuthModal('login') // Force sign in
      return 
    }
    try {
      if (!isOwner) {
        await addToCollection(deck.id).catch(() => {})
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
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-slate-500">{deck.category}</span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={20} />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-slate-900">{deck.title}</h2>
        <p className="text-slate-500 mt-2">{deck.description}</p>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
            <div className="font-bold text-slate-900">{deck.num_flashcards}</div>
            <div className="text-xs text-slate-400 font-medium">Cards</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
            <div className="font-bold text-slate-900 capitalize">{deck.difficulty_level}</div>
            <div className="text-xs text-slate-400 font-medium">Level</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
            <div className="font-bold text-slate-900">{pct}%</div>
            <div className="text-xs text-slate-400 font-medium">Progress</div>
          </div>
        </div>

        {/* Progress Bar (Only show if they have progress) */}
        {pct > 0 && (
          <div className="mt-4">
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        <h4 className="text-sm font-semibold text-slate-700 mt-6 mb-3">Card Preview</h4>
        <div className="space-y-3 relative">
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm">
            <span className="text-[10px] font-bold tracking-wider text-red-500 uppercase">Card 1</span>
            <p className="text-sm text-slate-700 mt-1">Sample flashcard question from this deck...</p>
          </div>
          
          <div className={`border border-slate-200 rounded-xl p-4 bg-white shadow-sm transition-all ${!user ? 'blur-sm select-none' : ''}`}>
            <span className="text-[10px] font-bold tracking-wider text-red-500 uppercase">Card 2</span>
            <p className="text-sm text-slate-700 mt-1">Sample flashcard question from this deck...</p>
          </div>
          <div className={`border border-slate-200 rounded-xl p-4 bg-white shadow-sm transition-all ${!user ? 'blur-[6px] select-none opacity-60' : ''}`}>
            <span className="text-[10px] font-bold tracking-wider text-red-500 uppercase">Card 3</span>
            <p className="text-sm text-slate-700 mt-1">Sample flashcard question from this deck...</p>
          </div>

          {/* Lock Overlay for Guests */}
          {!user && (
            <div className="absolute inset-0 top-16 flex items-center justify-center z-10 pointer-events-none">
              <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 text-slate-700 border border-slate-200">
                <Lock size={12} className="text-red-500" /> Sign in to see more
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
            {deck.creator?.[0] || '?'}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">{deck.creator || 'Unknown'}</div>
            <div className="text-xs text-slate-500">Deck creator</div>
          </div>
        </div>

        <button
          onClick={handleStartStudying}
          className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white font-medium py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
        >
          {!user ? 'Sign in to Study' : '▷ Start Studying'}
        </button>

        {isOwner && (
          <button
            onClick={() => navigate('/decks/manage', { state: { deckId: deck.id } })}
            className="w-full mt-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-medium py-3.5 rounded-xl transition shadow-sm"
          >
            Edit Deck
          </button>
        )}
      </div>
    </div>
  )
}

export default DeckDrawer