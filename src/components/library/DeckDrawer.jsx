import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Lock, Flag, AlertTriangle } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { UIContext } from '../../context/UIContext'
import { addToCollection, getDeckPreview, submitReport } from '../../api/client'

function DeckDrawer({ deck, completion, isOwner, onClose }) {
  const { user } = useContext(AuthContext)
  const { openAuthModal } = useContext(UIContext)
  const navigate = useNavigate()

  // Determine if the current user is an admin
  const isAdmin = user?.role === 'admin'

  const [firstQuestion, setFirstQuestion] = useState(null)
  const [loadingPreview, setLoadingPreview] = useState(false)

  // Report state
  const [showReportForm, setShowReportForm] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportSubmitting, setReportSubmitting] = useState(false)
  const [reportSuccess, setReportSuccess] = useState(false)

  useEffect(() => {
    if (!deck) return
    setFirstQuestion(null)
    setLoadingPreview(true)
    // Reset report state when a new deck is opened
    setShowReportForm(false)
    setReportReason('')
    setReportSuccess(false)
    getDeckPreview(deck.id)
      .then((data) => setFirstQuestion(data.first_question))
      .catch(() => setFirstQuestion(null))
      .finally(() => setLoadingPreview(false))
  }, [deck])

  if (!deck) return null

  async function handleStartStudying() {
    if (!user) {
      onClose()
      openAuthModal('login')
      return
    }
    try {
      if (!isOwner) {
        await addToCollection(deck.id).catch(() => {})
      }
      onClose()
      navigate(`/study/${deck.id}`)
    } catch (err) {
      console.error('Failed to start studying', err)
    }
  }

  function handleReportClick() {
    // For A Guest: open auth modal instead
    if (!user) {
      onClose()
      openAuthModal('login')
      return
    }
    setShowReportForm(true)
  }

  async function handleSubmitReport() {
    if (!reportReason.trim()) return
    setReportSubmitting(true)
    try {
      await submitReport({ deck_id: deck.id, reason: reportReason.trim() })
      setReportSuccess(true)
      setReportReason('')
      // Auto-close the report form after 2 seconds
      setTimeout(() => {
        setShowReportForm(false)
        setReportSuccess(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to submit report', err)
    } finally {
      setReportSubmitting(false)
    }
  }

  const pct = completion?.completion_pct ?? 0

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

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
            <div className="font-bold text-slate-900 capitalize">{deck.difficulty_level || '—'}</div>
            <div className="text-xs text-slate-400 font-medium">Level</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
            <div className="font-bold text-slate-900">{pct}%</div>
            <div className="text-xs text-slate-400 font-medium">Progress</div>
          </div>
        </div>

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
            <p className="text-sm text-slate-700 mt-1">
              {loadingPreview ? 'Loading question...' : firstQuestion || 'No cards yet'}
            </p>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm transition-all blur-sm select-none">
            <span className="text-[10px] font-bold tracking-wider text-red-500 uppercase">Card 2</span>
            <p className="text-sm text-slate-700 mt-1">Sample flashcard question from this deck...</p>
          </div>
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-sm transition-all blur-[6px] select-none opacity-60">
            <span className="text-[10px] font-bold tracking-wider text-red-500 uppercase">Card 3</span>
            <p className="text-sm text-slate-700 mt-1">Sample flashcard question from this deck...</p>
          </div>

          <div className="absolute inset-0 top-16 flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 text-slate-700 border border-slate-200">
              <Lock size={12} className="text-red-500" />
              {!user ? 'Sign in & start studying to view more' : 'Start studying to view more'}
            </div>
          </div>
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
          disabled={isAdmin}
          className={`w-full mt-6 py-3.5 rounded-xl transition flex items-center justify-center gap-2 shadow-sm font-medium
            ${isAdmin 
              ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300' 
              : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          title={isAdmin ? "Administrators cannot study decks" : ""}
        >
          {isAdmin ? (
            'Study Restricted for Admins'
          ) : !user ? (
            'Sign in to Study'
          ) : (
            '▷ Start Studying'
          )}
        </button>

        {isOwner && (
          <button
            onClick={() => navigate('/decks/manage', { state: { deckId: deck.id } })}
            className="w-full mt-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-medium py-3.5 rounded-xl transition shadow-sm"
          >
            Edit Deck
          </button>
        )}

        {/* Report Deck which is visible to everyone except owners and admins */}
        {!isOwner && !isAdmin && (
          <div className="mt-6 border-t border-slate-100 pt-4">
            {!showReportForm ? (
              <button
                onClick={handleReportClick}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-red-500 transition font-medium"
              >
                <Flag size={13} />
                Report this deck
              </button>
            ) : (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-red-500" />
                  <span className="text-sm font-semibold text-slate-800">Report Deck</span>
                </div>

                {reportSuccess ? (
                  <p className="text-sm text-emerald-600 font-medium">
                    ✓ Report submitted. Our team will review it shortly.
                  </p>
                ) : (
                  <>
                    <textarea
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      placeholder="Describe the issue with this deck..."
                      rows={3}
                      className="w-full text-sm border border-red-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSubmitReport}
                        disabled={!reportReason.trim() || reportSubmitting}
                        className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg transition"
                      >
                        {reportSubmitting ? 'Submitting...' : 'Submit Report'}
                      </button>
                      <button
                        onClick={() => { setShowReportForm(false); setReportReason('') }}
                        className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 rounded-lg bg-white transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DeckDrawer