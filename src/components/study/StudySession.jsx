import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronRight } from 'lucide-react'
import {
  pauseSession,
  completeSession,
  submitRating,
} from '../../api/client'
import SessionHeader from './SessionHeader'
import SessionComplete from './SessionComplete'

const AUTOSAVE_INTERVAL = 15000

const StudySession = ({ deck, cards, sessionId, resumeIndex = 0, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(resumeIndex)
  const [isFlipped, setIsFlipped] = useState(false)
  const [hasRated, setHasRated] = useState(false)
  const [ratings, setRatings] = useState({})
  const [isComplete, setIsComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const autosaveRef = useRef(null)

  const currentCard = cards[currentIndex]
  const totalCards = cards.length

  const autosave = useCallback(async () => {
    try {
      await pauseSession(sessionId, currentIndex)
    } catch (_) {}
  }, [sessionId, currentIndex])

  useEffect(() => {
    autosaveRef.current = setInterval(autosave, AUTOSAVE_INTERVAL)
    return () => clearInterval(autosaveRef.current)
  }, [autosave])

  useEffect(() => {
    const onHide = () => { if (document.visibilityState === 'hidden') autosave() }
    const onUnload = () => autosave()
    document.addEventListener('visibilitychange', onHide)
    window.addEventListener('beforeunload', onUnload)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      window.removeEventListener('beforeunload', onUnload)
    }
  }, [autosave])

  useEffect(() => {
    setIsFlipped(false)
    setHasRated(false)
  }, [currentIndex])

  const handleFlip = () => {
    if (!isFlipped) setIsFlipped(true)
  }

  const handleRate = async (rating) => {
    if (hasRated || isSubmitting) return
    setIsSubmitting(true)
    try {
      await submitRating(sessionId, currentCard.id, rating)
    } catch (_) {}
    setRatings((prev) => ({ ...prev, [currentCard.id]: rating }))
    setHasRated(true)
    setIsSubmitting(false)
  }

  const handleNext = async () => {
    if (!hasRated) return
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((i) => i + 1)
    } else {
      try { await completeSession(sessionId) } catch (_) {}
      setIsComplete(true)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setHasRated(false)
    setRatings({})
    setIsComplete(false)
  }

  const handleExit = async () => {
    await autosave()
    onExit()
  }

  const getStats = () => {
    const counts = { easy: 0, medium: 0, hard: 0 }
    Object.values(ratings).forEach((r) => {
      if (r in counts) counts[r]++
    })
    return counts
  }

  return (
    <div className="study-session">
      <SessionHeader
        deckTitle={deck?.title}
        current={currentIndex + 1}
        total={totalCards}
        onExit={handleExit}
      />

      {isComplete ? (
        <SessionComplete stats={getStats()} onRestart={handleRestart} />
      ) : (
        <div className="session-body">
          <div
            className={`flash-card ${isFlipped ? "flipped" : ""}`}
            onClick={handleFlip}
          >
            <div className="card-face card-front">
              <span className="card-label">QUESTION</span>
              <p className="card-text">{currentCard?.question}</p>
              {currentCard?.image_url && (
                <img src={currentCard.image_url} alt="" className="card-image" />
              )}
              {!isFlipped && <span className="card-hint">Click to flip</span>}
            </div>

            <div className="card-face card-back">
              <span className="card-label answer-label">ANSWER</span>
              <p className="card-text">{currentCard?.answer}</p>
              {!hasRated && (
                <span className="card-hint">Rate your confidence below</span>
              )}
            </div>
          </div>

          <div className="session-footer">
            {!isFlipped ? (
              <div className="footer-row">
                <button className="reveal-btn" onClick={handleFlip}>
                  Reveal Answer
                </button>
                <button className="nav-arrow" disabled>
                  <ChevronRight size={18} />
                </button>
              </div>
            ) : !hasRated ? (
              <div className="rating-row">
                <p className="rating-prompt">How well did you know this?</p>
                <div className="rating-btns">
                  <button className="rating-btn hard" onClick={() => handleRate("hard")} disabled={isSubmitting}>Hard</button>
                  <button className="rating-btn good" onClick={() => handleRate("medium")} disabled={isSubmitting}>Medium</button>
                  <button className="rating-btn easy" onClick={() => handleRate("easy")} disabled={isSubmitting}>Easy</button>
                </div>
              </div>
            ) : (
              <div className="footer-row">
                <button className="next-btn" onClick={handleNext}>
                  {currentIndex === totalCards - 1 ? "Finish" : "Next Card"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .study-session { min-height: 100vh; background: #0f1729; display: flex; flex-direction: column; }
        .session-body { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px 140px; }
        .flash-card { width: 100%; max-width: 520px; cursor: pointer; }
        .card-face { padding: 32px 36px; border-radius: 18px; min-height: 200px; display: flex; flex-direction: column; gap: 16px; }
        .card-front { background: #ffffff; color: #1e293b; box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
        .card-back { background: #1e2a3a; color: #e2e8f0; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 8px 32px rgba(0,0,0,0.4); display: none; }
        .flash-card.flipped .card-front { display: none; }
        .flash-card.flipped .card-back { display: flex; }
        .card-label { font-size: 11px; font-weight: 700; letter-spacing: 1.2px; color: #3b82f6; text-transform: uppercase; }
        .answer-label { color: #f87171; }
        .card-text { font-size: 18px; font-weight: 500; line-height: 1.6; flex: 1; margin: 0; }
        .card-image { max-width: 100%; border-radius: 10px; max-height: 160px; object-fit: contain; }
        .card-hint { font-size: 12px; color: #94a3b8; margin-top: auto; }
        .session-footer { position: fixed; bottom: 0; left: 0; right: 0; padding: 20px; background: linear-gradient(to top, #0f1729 70%, transparent); display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .footer-row { display: flex; align-items: center; gap: 12px; }
        .reveal-btn { padding: 13px 36px; background: #ef4444; color: #fff; border: none; border-radius: 30px; font-size: 15px; font-weight: 600; cursor: pointer; }
        .reveal-btn:hover { background: #dc2626; }
        .next-btn { padding: 13px 40px; background: #3b82f6; color: #fff; border: none; border-radius: 30px; font-size: 15px; font-weight: 600; cursor: pointer; }
        .next-btn:hover { background: #2563eb; }
        .nav-arrow { width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #475569; display: flex; align-items: center; justify-content: center; cursor: not-allowed; }
        .rating-row { display: flex; flex-direction: column; align-items: center; gap: 14px; }
        .rating-prompt { font-size: 13px; color: #64748b; margin: 0; }
        .rating-btns { display: flex; gap: 12px; }
        .rating-btn { padding: 10px 28px; border: none; border-radius: 25px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .rating-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .rating-btn.hard { background: rgba(239,68,68,0.2); color: #f87171; border: 1px solid rgba(239,68,68,0.3); }
        .rating-btn.good { background: rgba(234,179,8,0.2); color: #facc15; border: 1px solid rgba(234,179,8,0.3); }
        .rating-btn.easy { background: rgba(34,197,94,0.2); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); }
        @media (max-width: 600px) {
          .flash-card { max-width: 100%; }
          .card-face { padding: 24px 20px; }
          .card-text { font-size: 16px; }
          .rating-btn { padding: 10px 18px; font-size: 13px; }
        }
      `}</style>
    </div>
  )
}

export default StudySession