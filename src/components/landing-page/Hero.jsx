import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UIContext } from '../../context/UIContext'
import { AuthContext } from '../../context/AuthContext'

const MARQUEE_ITEMS = [
  'Track progress',
  'Spaced repetition',
  'Active recall',
  'Custom decks',
  'Community decks',
  'Confidence rating',
  'Smart intervals',
  'Study streaks',
]

function Hero() {
  const { openAuthModal } = useContext(UIContext)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

  return (
    <section className="bg-white border-b border-gray-900 overflow-hidden">

      {/* Main hero grid */}
      <div className="grid border-b border-gray-900" style={{ gridTemplateColumns: '1fr 240px' }}>

        {/* Left — headline + copy + CTAs */}
        <div className="border-r border-gray-900 px-10 pt-12 pb-10 flex flex-col justify-between gap-8">
          <div>
            <h1
              className="leading-none text-gray-900 font-black uppercase"
              style={{ fontFamily: '"Bebas Neue", "Impact", sans-serif', fontSize: 'clamp(72px, 12vw, 108px)', letterSpacing: '0.02em' }}
            >
              FLASH<br />
              <span className="text-red-600">LEARN</span>
            </h1>

            <p className="mt-5 text-sm text-gray-500 leading-relaxed max-w-sm">
              The flashcard app built around how your brain actually works.
              Adaptive reviews. Real retention.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => user ? navigate('/dashboard') : openAuthModal('register')}
              className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold border border-gray-900 hover:bg-gray-800 transition-colors"
              style={{ borderRadius: 0 }}
            >
              {user ? 'Go to Dashboard' : 'Start for free'}
            </button>
            <button
              onClick={() => navigate('/library')}
              className="px-5 py-2.5 bg-white text-gray-900 text-sm font-semibold border border-gray-900 hover:bg-gray-50 transition-colors"
              style={{ borderRadius: 0 }}
            >
              Browse decks →
            </button>
          </div>
        </div>

        {/* Right — stats column */}
        <div className="flex flex-col divide-y divide-gray-900">
          <div className="flex-1 px-6 py-7 flex flex-col justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Active users</p>
            <p className="font-black text-gray-900 leading-none mt-2" style={{ fontFamily: '"Bebas Neue", "Impact", sans-serif', fontSize: '44px' }}>12K</p>
          </div>

          <div className="flex-1 px-6 py-7 flex flex-col justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Retention rate</p>
            <p className="font-black text-gray-900 leading-none mt-2" style={{ fontFamily: '"Bebas Neue", "Impact", sans-serif', fontSize: '44px' }}>87%</p>
          </div>

          <div className="flex-1 px-6 py-7 flex flex-col justify-between bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Public decks</p>
            <p className="font-black text-white leading-none mt-2" style={{ fontFamily: '"Bebas Neue", "Impact", sans-serif', fontSize: '44px' }}>3.2K</p>
            <p className="text-xs text-gray-600 mt-3 italic leading-snug">Beats passive reading.<br />Every time.</p>
          </div>
        </div>
      </div>

      {/* Marquee strip */}
      <div className="bg-red-600 py-3 overflow-hidden border-b border-gray-900">
        <div
          className="flex gap-12 whitespace-nowrap text-white"
          style={{
            fontFamily: '"Bebas Neue", "Impact", sans-serif',
            fontSize: '17px',
            letterSpacing: '0.12em',
            animation: 'fl-marquee 22s linear infinite',
          }}
        >
          {doubled.map((item, i) => (
            <span key={i} className="flex items-center gap-12">
              <span className="text-red-300 text-sm">✦</span>
              <span>{item.toUpperCase()}</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fl-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}

export default Hero