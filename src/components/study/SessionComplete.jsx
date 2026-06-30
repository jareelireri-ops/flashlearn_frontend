import { useNavigate } from 'react-router-dom'
import { RotateCcw, PartyPopper } from 'lucide-react'

const SessionComplete = ({ stats, onRestart }) => {
  const navigate = useNavigate()
  const total = (stats.easy || 0) + (stats.medium || 0) + (stats.hard || 0)

  return (
    <div className="complete-overlay">
      <div className="complete-card">
        <div className="complete-icon-wrap">
          <span className="complete-icon-glow" />
          <PartyPopper className="complete-icon" size={34} strokeWidth={2} />
        </div>
        <h2 className="complete-title">Session Complete!</h2>
        <p className="complete-subtitle">{total} cards reviewed</p>

        <div className="rating-summary">
          <div className="rating-pill easy">
            <span className="rating-count">{stats.easy || 0}</span>
            <span className="rating-label">Easy</span>
          </div>
          <div className="rating-pill good">
            <span className="rating-count">{stats.medium || 0}</span>
            <span className="rating-label">Medium</span>
          </div>
          <div className="rating-pill hard">
            <span className="rating-count">{stats.hard || 0}</span>
            <span className="rating-label">Hard</span>
          </div>
        </div>

        <div className="complete-actions">
          <button className="btn-restart" onClick={onRestart}>
            <RotateCcw size={15} />
            Restart
          </button>
          <button className="btn-more" onClick={() => navigate('/library')}>
            More Decks
          </button>
        </div>
      </div>

      <style>{`
        .complete-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(10,15,30,0.7);
          z-index: 200;
        }
        .complete-card {
          background: #1e2a3a;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 40px 36px;
          text-align: center;
          min-width: 320px;
          max-width: 420px;
          width: 90%;
          box-shadow: 0 25px 60px rgba(0,0,0,0.4);
        }

        .complete-icon-wrap {
          position: relative;
          width: 64px;
          height: 64px;
          margin: 0 auto 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .complete-icon-glow {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(239,68,68,0.35) 0%, rgba(239,68,68,0) 70%);
          animation: glowPulse 2.2s ease-in-out infinite;
        }
        .complete-icon {
          position: relative;
          color: #ef4444;
          animation: popIn 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes popIn {
          0% { transform: scale(0) rotate(-20deg); opacity: 0; }
          70% { transform: scale(1.15) rotate(6deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.15); }
        }

        .complete-title {
          color: #f1f5f9;
          font-size: 22px;
          font-weight: 700;
          margin: 0 0 6px;
        }
        .complete-subtitle { color: #64748b; font-size: 13px; margin: 0 0 24px; }
        .rating-summary {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-bottom: 28px;
        }
        .rating-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 10px 20px;
          border-radius: 10px;
          min-width: 72px;
        }
        .rating-pill.easy { background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.25); }
        .rating-pill.good { background: rgba(234,179,8,0.12); border: 1px solid rgba(234,179,8,0.25); }
        .rating-pill.hard { background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.25); }
        .rating-count { font-size: 22px; font-weight: 700; }
        .rating-pill.easy .rating-count { color: #4ade80; }
        .rating-pill.good .rating-count { color: #facc15; }
        .rating-pill.hard .rating-count { color: #f87171; }
        .rating-label { font-size: 11px; color: #64748b; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.5px; }
        .complete-actions { display: flex; gap: 10px; justify-content: center; }
        .btn-restart {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 25px;
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-restart:hover { background: rgba(255,255,255,0.12); color: #e2e8f0; }
        .btn-more {
          padding: 10px 24px;
          background: #ef4444;
          border: none;
          border-radius: 25px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-more:hover { background: #dc2626; }
      `}</style>
    </div>
  )
}

export default SessionComplete