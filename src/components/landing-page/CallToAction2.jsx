import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { UIContext } from '../../context/UIContext'

// Dark ink pencils, tuned for visibility on bg-slate-100 (same as FeaturedDecks)
const PENCILS = [
  { top: '15%', left: '5%', rotate: -18, size: 90, opacity: 0.16 },
  { top: '60%', left: '92%', rotate: 26, size: 110, opacity: 0.16 },
]

function CallToAction2() {
  const { user } = useContext(AuthContext)
  const { openAuthModal } = useContext(UIContext)
  const navigate = useNavigate()

  return (
    <section className="relative bg-slate-100 px-6 py-16 overflow-hidden">
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

      <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900">
            {user ? 'Ready to keep the streak going?' : 'Ready to start learning?'}
          </h3>
          <p className="text-slate-500 mt-1">
            {user
              ? 'Head to the library and pick up where you left off.'
              : "Join FlashLearn today. It's free."}
          </p>
        </div>

        {user ? (
          <button
            onClick={() => navigate('/library')}
            className="px-6 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium transition shrink-0"
          >
            Browse the Library →
          </button>
        ) : (
          <button
            onClick={() => openAuthModal('register')}
            className="px-6 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-medium transition shrink-0"
          >
            Start Now →
          </button>
        )}
      </div>
    </section>
  )
}

export default CallToAction2