import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import { UIContext } from '../../context/UIContext'
import { AuthContext } from '../../context/AuthContext'

const MARQUEE_ITEMS = [
  'Track progress',
  'Use of spaced repetition',
  'Customize personal decks',
  'Browse community decks',
  'Difficulty rating',
  'View study streaks and more.',
]

// Positioned relative to the headliner box only — overflow-hidden 
// box clips anything that would cross into the stats column
const PENCILS = [
  { top: '10%', left: '88%', rotate: -18, size: 60, opacity: 0.06 },
  { top: '55%', left: '94%', rotate: 20, size: 80, opacity: 0.05 },
  { top: '85%', left: '85%', rotate: -30, size: 50, opacity: 0.06 },
]

function Hero() {
  const { openAuthModal } = useContext(UIContext)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const isLearner = user && user.role === 'learner'

  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

  return (
    <section className="bg-white border-b border-gray-900 overflow-hidden">

      {/* Main hero grid -considering on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] border-b border-gray-900">

        {/* HEADLINER */}
        <div className="relative overflow-hidden md:border-r border-gray-900 px-6 sm:px-10 pt-10 pb-8 md:pt-12 md:pb-10 flex flex-col justify-between gap-8">
          {PENCILS.map((p, i) => (
            <Pencil
              key={i}
              className="absolute text-gray-900 pointer-events-none"
              style={{
                top: p.top,
                left: p.left,
                width: p.size,
                height: p.size,
                opacity: p.opacity,
                transform: `rotate(${p.rotate}deg)`,
              }}
              strokeWidth={1.5}
            />
          ))}

          <div>
            <h1
              className="leading-none text-gray-900 font-black uppercase"
              style={{ fontFamily: '"Bebas Neue", "Impact", sans-serif', fontSize: 'clamp(56px, 14vw, 108px)', letterSpacing: '0.02em' }}
            >FLASH<br />
              <span className="text-red-600">LEARN</span>
            </h1>

            <p className="mt-5 text-sm text-gray-500 leading-relaxed max-w-sm">
              The flashcard app built around how your brain actually works.
              Q&A cards designed to guide you in your roadmap to continuous knowledge and mastery.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {(!user || isLearner) && (
              <button
                onClick={() => isLearner ? navigate('/dashboard') : openAuthModal('register')}
                className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold border border-gray-900 hover:bg-gray-800 transition-colors"
                style={{ borderRadius: 0 }}
              >
                {isLearner ? 'Go to Dashboard' : 'Start for free'}
              </button>
            )}
            <button
              onClick={() => navigate('/library')}
              className="px-5 py-2.5 bg-gray-300 text-gray-900 text-sm font-semibold border border-gray-900 hover:bg-gray-50 transition-colors"
              style={{ borderRadius: 0 }}
            >
              Browse decks →
            </button>
          </div>
        </div>

        {/* Rightstats column: horizontal row on mobile, stacked column from md up */}
        <div className="flex flex-row md:flex-col divide-x md:divide-x-0 divide-y-0 md:divide-y divide-gray-900 border-t md:border-t-0 border-gray-900">
          <div className="flex-1 px-4 sm:px-6 py-5 md:py-7 flex flex-col justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Active users</p>
            <p className="font-black text-gray-900 leading-none mt-2" style={{ fontFamily: '"Bebas Neue", "Impact", sans-serif', fontSize: '32px' }}>342+</p>
          </div>

          <div className="flex-1 px-4 sm:px-6 py-5 md:py-7 flex flex-col justify-between">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Retention rate</p>
            <p className="font-black text-gray-900 leading-none mt-2" style={{ fontFamily: '"Bebas Neue", "Impact", sans-serif', fontSize: '32px' }}>87%</p>
          </div>

          <div className="hidden md:flex flex-1 px-6 py-7 flex-col justify-between bg-gray-900">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Public decks</p>
            <p className="font-black text-white leading-none mt-2" style={{ fontFamily: '"Bebas Neue", "Impact", sans-serif', fontSize: '44px' }}>1101+</p>
            <p className="text-xs text-gray-600 mt-3 italic leading-snug">Join the community.<br />Educate as you get educated.</p>
          </div>
        </div>

        {/* Public decks stat —its own full-width row on mobile only */}
        <div className="md:hidden flex flex-col justify-between px-4 sm:px-6 py-5 bg-gray-900 border-t border-gray-900">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Public decks</p>
          <p className="font-black text-white leading-none mt-2" style={{ fontFamily: '"Bebas Neue", "Impact", sans-serif', fontSize: '36px' }}>1101+</p>
          <p className="text-xs text-gray-600 mt-2 italic leading-snug">Beats traditional reading. Every time.</p>
        </div>
      </div>

      {/* Marquee strip */}
      <div className="bg-red-600 py-3 overflow-hidden border-b border-gray-900">
        <div
          className="flex gap-8 sm:gap-12 whitespace-nowrap text-white"
          style={{
            fontFamily: '"Bebas Neue", "Impact", sans-serif',
            fontSize: '15px',
            letterSpacing: '0.1em',
            animation: 'fl-marquee 22s linear infinite',
          }}
        >
          {doubled.map((item, i) => (
            <span key={i} className="flex items-center gap-8 sm:gap-12">
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