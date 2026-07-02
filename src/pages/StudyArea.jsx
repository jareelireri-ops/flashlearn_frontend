import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, AlertCircle } from 'lucide-react'
import {
  getDeckFlashcards,
  getDeckDetails,
  getActiveSession,
  startStudySession,
  resumeSession,
} from '../api/client'
import StudySession from '../components/study/StudySession'

const StudyArea = () => {
  const { deckId } = useParams()
  const navigate = useNavigate()

  const [deck, setDeck] = useState(null)
  const [cards, setCards] = useState([])
  const [sessionId, setSessionId] = useState(null)
  const [resumeIndex, setResumeIndex] = useState(0)
  const [initialRatings, setInitialRatings] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showResumePrompt, setShowResumePrompt] = useState(false)
  const [pendingSession, setPendingSession] = useState(null)

  useEffect(() => {
    initializeSession()
  }, [deckId])

  const initializeSession = async () => {
    setLoading(true)
    setError(null)

    try {
      // Request page size of 1000 to fetch all cards for study session
      const deckRes = await getDeckFlashcards(deckId, { per_page: 1000 })
      const flashcards = deckRes.flashcards || []

      let deckData = { title: 'Study Session' }
      try {
        const details = await getDeckDetails(deckId)
        deckData = details
      } catch (_) {}

      if (!flashcards || flashcards.length === 0) {
        setError('This deck has no flashcards yet. Add some cards first.')
        setLoading(false)
        return
      }

      setDeck(deckData)
      setCards(flashcards)

      try {
        const activeRes = await getActiveSession(deckId)
        const active = activeRes?.session

        if (active && active.status === 'paused') {
          setPendingSession(active)
          setShowResumePrompt(true)
          setLoading(false)
          return
        }
      } catch (_) {
      }

      await startFresh()
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Deck not found.')
      } else {
        setError('Something went wrong loading this deck. Please try again.')
      }
      setLoading(false)
    }
  }

  // Accepts a force parameter and passes force_new to the backend
  const startFresh = async (force = false) => {
    const res = await startStudySession(deckId, { force_new: force })
    setSessionId(res.session.id)
    setResumeIndex(res.session?.current_card_index || 0)
    setInitialRatings(res.session_ratings || {})
    setLoading(false)
  }

  const handleResume = async () => {
    setShowResumePrompt(false)
    setLoading(true)
    try {
      const res = await resumeSession(pendingSession.id)
      setSessionId(pendingSession.id)
      setResumeIndex(res.current_card_index || pendingSession.current_card_index || 0)
      setInitialRatings(res.session_ratings || {})
    } catch (_) {
      await startFresh()
    } finally {
      setLoading(false)
    }
  }

  // Explicitly passes true to force a brand new session
  const handleStartFresh = async () => {
    setShowResumePrompt(false)
    setLoading(true)
    await startFresh(true)
  }

  if (loading) {
    return (
      <div className="study-state">
        <Loader2 size={32} className="spin" />
        <p>Preparing your session…</p>
        <style>{`
          .study-state {
            min-height: 100vh;
            background: #0f1729;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            color: #64748b;
            font-size: 14px;
          }
          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div className="study-state">
        <AlertCircle size={40} color="#f87171" />
        <p>{error}</p>
        <button className="back-btn" onClick={() => navigate(-1)}>Go Back</button>
        <style>{`
          .study-state {
            min-height: 100vh;
            background: #0f1729;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16px;
            color: #94a3b8;
            font-size: 14px;
            text-align: center;
            padding: 20px;
          }
          .back-btn {
            padding: 10px 24px;
            background: #3b82f6;
            color: #fff;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
          }
        `}</style>
      </div>
    )
  }

  if (showResumePrompt) {
    return (
      <div className="resume-screen">
        <div className="resume-card">
          <h2>Resume Session?</h2>
          <p>
            You have an unfinished session for <strong>{deck?.title}</strong>.
            Pick up where you left off?
          </p>
          <div className="resume-actions">
            <button className="btn-ghost" onClick={handleStartFresh}>
              Start Over
            </button>
            <button className="btn-primary" onClick={handleResume}>
              Resume
            </button>
          </div>
        </div>
        <style>{`
          .resume-screen {
            min-height: 100vh;
            background: #0f1729;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .resume-card {
            background: #1e2a3a;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 20px;
            padding: 40px 36px;
            max-width: 400px;
            width: 100%;
            text-align: center;
          }
          .resume-card h2 {
            color: #f1f5f9;
            font-size: 20px;
            font-weight: 700;
            margin: 0 0 12px;
          }
          .resume-card p {
            color: #94a3b8;
            font-size: 14px;
            line-height: 1.6;
            margin: 0 0 28px;
          }
          .resume-card strong { color: #e2e8f0; }
          .resume-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
          }
          .btn-primary {
            padding: 10px 28px;
            background: #3b82f6;
            color: #fff;
            border: none;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          }
          .btn-primary:hover { background: #2563eb; }
          .btn-ghost {
            padding: 10px 28px;
            background: rgba(255,255,255,0.07);
            border: 1px solid rgba(255,255,255,0.12);
            color: #94a3b8;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          }
          .btn-ghost:hover {
            background: rgba(255,255,255,0.12);
            color: #e2e8f0;
          }
        `}</style>
      </div>
    )
  }

  return (
    <StudySession
      deck={deck}
      cards={cards}
      sessionId={sessionId}
      resumeIndex={resumeIndex}
      initialRatings={initialRatings}
      onExit={() => navigate(-1)}
    />
  )
}

export default StudyArea