import { useState, useEffect, useCallback } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import {
  pauseSession,
  completeSession,
  submitRating,
} from '../../api/client'
import SessionHeader from './SessionHeader'
import SessionComplete from './SessionComplete'

const StudySession = ({ deck, cards, sessionId, resumeIndex = 0, initialRatings = {}, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(resumeIndex)
  const [isFlipped, setIsFlipped] = useState(false)
  const [ratings, setRatings] = useState(initialRatings)
  const [isComplete, setIsComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentCard = cards[currentIndex]
  const totalCards = cards.length
  
  // Check if the current card has already been rated, or if the user is revisiting a card they've already rated
  const hasRatedCurrent = !!ratings[currentCard?.id] || currentIndex < resumeIndex

  const autosave = useCallback(async () => {
    try {
      await pauseSession(sessionId, currentIndex)
    } catch (_) {}
  }, [sessionId, currentIndex])

  // Only trigger autosave if the user tries to close the tab or refresh
  useEffect(() => {
    const onUnload = () => autosave()
    window.addEventListener('beforeunload', onUnload)
    return () => {
      window.removeEventListener('beforeunload', onUnload)
    }
  }, [autosave])

  const handleFlip = () => {
    if (!isFlipped) setIsFlipped(true)
  }

  const handleRate = async (rating) => {
    if (hasRatedCurrent || isSubmitting) return
    setIsSubmitting(true)
    try {
      await submitRating(sessionId, currentCard.id, rating)
      setRatings((prev) => ({ ...prev, [currentCard.id]: rating }))
    } catch (_) {
      console.error("Failed to submit rating")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = async () => {
    if (!hasRatedCurrent) return
    if (currentIndex < totalCards - 1) {
      setIsFlipped(false) // this ensures the next card starts unflipped
      setCurrentIndex((i) => i + 1)
    } else {
      try { await completeSession(sessionId) } catch (_) {}
      setIsComplete(true)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false)
      setCurrentIndex(i => i - 1)
    }
  }

  const goNext = () => {
    if (currentIndex < totalCards - 1) {
      setIsFlipped(false)
      setCurrentIndex(i => i + 1)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setRatings({})
    setIsComplete(false)
  }

  // This handles the exit button click, safely triggering the autosave
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

  if (!currentCard) return null;

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
              {!hasRatedCurrent && (
                <span className="card-hint">Rate your confidence below</span>
              )}
            </div>
          </div>

          <div className="session-footer">
            <div className="footer-nav-container">
              
              {/* Left arrow: only disabled at the start, or current card is unrated */}
              <button 
                className="nav-arrow" 
                onClick={goPrev} 
                disabled={currentIndex === 0 || (isFlipped && !hasRatedCurrent)}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="footer-center">
                {!isFlipped ? (
                  <button className="reveal-btn" onClick={handleFlip}>
                    Reveal Answer
                  </button>
                ) : !hasRatedCurrent ? (
                  <div className="rating-row">
                    <p className="rating-prompt">How well did you know this?</p>
                    <div className="rating-btns">
                      <button className="rating-btn hard" onClick={() => handleRate("hard")} disabled={isSubmitting}>Hard</button>
                      <button className="rating-btn good" onClick={() => handleRate("medium")} disabled={isSubmitting}>Medium</button>
                      <button className="rating-btn easy" onClick={() => handleRate("easy")} disabled={isSubmitting}>Easy</button>
                    </div>
                  </div>
                ) : (
                  <button className="next-btn" onClick={handleNext}>
                    {currentIndex === totalCards - 1 ? "Finish" : "Next Card"}
                  </button>
                )}
              </div>

              {/* Right arrow.. only disabled at the end or current card is unrated*/}
              <button 
                className="nav-arrow" 
                onClick={goNext} 
                disabled={currentIndex === totalCards - 1 || (isFlipped && !hasRatedCurrent)}
              >
                <ChevronRight size={20} />
              </button>
            </div>
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
        .footer-nav-container { display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 520px; gap: 16px; }
        .footer-center { flex: 1; display: flex; justify-content: center; align-items: center; min-height: 50px; }
        
        .nav-arrow { width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
        .nav-arrow:hover:not(:disabled) { background: rgba(255,255,255,0.12); color: #fff; }
        .nav-arrow:disabled { opacity: 0.3; cursor: not-allowed; }
        
        .reveal-btn { padding: 13px 36px; background: #ef4444; color: #fff; border: none; border-radius: 30px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .reveal-btn:hover { background: #dc2626; }
        .next-btn { padding: 13px 40px; background: #3b82f6; color: #fff; border: none; border-radius: 30px; font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .next-btn:hover { background: #2563eb; }
        
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
          .nav-arrow { width: 38px; height: 38px; }
        }
      `}</style>
    </div>
  )
}

export default StudySession