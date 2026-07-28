import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import { UIContext } from '../../context/UIContext'
import { AuthContext } from '../../context/AuthContext'
import MarqueeStrip from '../ReusableComponents/MarqueeStrip'

const MARQUEE_ITEMS = [
  'Gamify Corporate E-Waste Donations',
  'Spaced Repetition for ESG Compliance',
  'Private Decks for Technician Training',
  'Secure Data Destruction Protocols',
  'Track Global Collection Metrics',
]

const PENCILS = [
  { top: '10%', left: '88%', rotate: -18, size: 60, opacity: 0.11 },
  { top: '55%', left: '94%', rotate: 20, size: 80, opacity: 0.13 },
  { top: '85%', left: '85%', rotate: -30, size: 50, opacity: 0.12 },
]

function Hero() {
  const { openAuthModal } = useContext(UIContext)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const isLearner = user && user.role === 'learner'

  return (
    <section className="bg-white border-b border-gray-900 overflow-hidden">

      {/* Main hero grid  */}
      <div className="grid grid-cols-[1fr_100px] xs:grid-cols-[1fr_130px] sm:grid-cols-[1fr_180px] md:grid-cols-[1fr_240px] border-b border-gray-900">

        {/* HEADLINER */}
        <div className="relative overflow-hidden border-r border-gray-900 px-4 sm:px-6 md:px-10 pt-8 sm:pt-10 md:pt-12 pb-6 sm:pb-8 md:pb-10 flex flex-col justify-between gap-6 sm:gap-8">
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
              style={{ fontFamily: '"Bebas Neue", "Impact", sans-serif', fontSize: 'clamp(44px, 13vw, 108px)', letterSpacing: '0.02em' }}
            >ECO<br />
              <span className="text-emerald-600">FLIP</span>
            </h1>

            <p className="mt-4 sm:mt-5 text-xs sm:text-sm text-gray-500 leading-relaxed max-w-sm">
              The unified e-waste knowledge engine. Gamify corporate ESG compliance and train world-class refurbishment technicians in one platform.
            </p>
          </div>

          {/* Buttons — horizontal in mobile, vertical in wider screens*/}
          <div className="flex flex-row items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate('/library')}
              className="flex-1 sm:flex-none min-w-0 justify-center px-3 sm:px-5 py-2 sm:py-2.5 bg-gray-900 text-white text-xs sm:text-sm font-semibold border border-gray-900 hover:bg-gray-800 transition-colors leading-tight"
              style={{ borderRadius: 0 }}
            >
              EPR Compliance Training
            </button>
            <button
              onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
              className="flex-1 sm:flex-none min-w-0 justify-center px-3 sm:px-5 py-2 sm:py-2.5 bg-gray-300 text-gray-900 text-xs sm:text-sm font-semibold border border-gray-900 hover:bg-gray-50 transition-colors leading-tight"
              style={{ borderRadius: 0 }}
            >
              How It Works ↓
            </button>
          </div>
        </div>

        {/* Right stats column — always stacked vertically, on the right side at every breakpoint */}
        <div className="flex flex-col divide-y divide-gray-900">
          <div className="flex-1 px-2 sm:px-4 md:px-6 py-3 sm:py-5 md:py-7 flex flex-col justify-between">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-gray-400">Corporate Donors</p>
            <p className="font-black text-gray-900 leading-none mt-2" style={{ fontFamily: '"Bebas Neue", "Impact", sans-serif', fontSize: 'clamp(20px, 6vw, 32px)' }}>14,204+</p>
          </div>

          <div className="flex-1 px-2 sm:px-4 md:px-6 py-3 sm:py-5 md:py-7 flex flex-col justify-between">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-gray-400">Technician Accuracy</p>
            <p className="font-black text-gray-900 leading-none mt-2" style={{ fontFamily: '"Bebas Neue", "Impact", sans-serif', fontSize: 'clamp(20px, 6vw, 32px)' }}>99.8%</p>
          </div>

          <div className="flex-1 px-2 sm:px-4 md:px-6 py-3 sm:py-5 md:py-7 flex flex-col justify-between bg-gray-900">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-gray-500">Tons Recycled</p>
            <p className="font-black text-white leading-none mt-2" style={{ fontFamily: '"Bebas Neue", "Impact", sans-serif', fontSize: 'clamp(24px, 7vw, 44px)' }}>50,000+</p>
            <p className="hidden sm:block text-xs text-gray-600 mt-3 italic leading-snug">Empower your corporate partners.<br />Upskill your technicians.</p>
          </div>
        </div>
      </div>

      {/* Marquee strip */}
      <MarqueeStrip items={MARQUEE_ITEMS} variant="brand" />
    </section>
  )
}

export default Hero