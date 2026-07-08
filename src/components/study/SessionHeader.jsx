import { X } from 'lucide-react'

const SessionHeader = ({ deckTitle, current, total, onExit }) => {
  const progress = total > 0 ? (current / total) * 100 : 0

  return (
    <div className="session-header">
      <button className="exit-btn" onClick={onExit}>
        <X size={14} />
        <span>Exit</span>
      </button>

      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="card-counter">{current} / {total}</div>

      {deckTitle && (
        <div className="deck-badge-wrapper">
          <span className="deck-badge">{deckTitle}</span>
        </div>
      )}

      <style>{`
        .session-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px 0;
        }
        .exit-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 13px;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: color 0.2s;
          flex-shrink: 0;
        }
        .exit-btn:hover { color: #e2e8f0; }
        .progress-track {
          flex: 1;
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #60a5fa);
          border-radius: 2px;
          transition: width 0.4s ease;
        }
        .card-counter {
          flex-shrink: 0;
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }
        .deck-badge-wrapper {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
        }
        .deck-badge {
          background: #1e2a3a;
          border: 1px solid rgba(59,130,246,0.3);
          color: #93c5fd;
          font-size: 12px;
          font-weight: 500;
          padding: 4px 14px;
          border-radius: 20px;
          white-space: nowrap;
        }
      `}</style>
    </div>
  )
}

export default SessionHeader
