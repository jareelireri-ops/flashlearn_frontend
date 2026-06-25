import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UIContext } from '../../context/UIContext'

function Hero() {
  const { openAuthModal } = useContext(UIContext)
  const navigate = useNavigate()
  const [flipped, setFlipped] = useState(false)

  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-100 via-slate-50 to-white px-6 py-32">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">
        <div
          className="mx-auto max-w-xl min-h-[160px] flex items-center justify-center [perspective:1200px] cursor-pointer"
          onMouseEnter={() => setFlipped(true)}
          onMouseLeave={() => setFlipped(false)}
        >
          <motion.div
            className="relative w-full"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
          >
            <div className="flex flex-col items-center justify-center" style={{ backfaceVisibility: 'hidden' }}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight whitespace-nowrap">
                What is <span className="text-red-500">Flash Learn?</span>
              </h1>
              <p className="text-slate-400 text-sm mt-4">Hover to find out →</p>
            </div>

            <div
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                Study smarter, <span className="text-red-500">retain more.</span>
              </h2>
              <p className="text-slate-500 mt-4 max-w-md mx-auto text-sm">
                FlashLearn delivers spaced-repetition flashcard decks across Software
                Engineering, Philosophy, Biblical Studies, Business, and Hospitality.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-center gap-4 mt-12">
          <button
            onClick={() => openAuthModal('register')}
            className="px-6 py-3 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition shadow-lg shadow-slate-900/10"
          >
            Start Learning →
          </button>
          <button
            onClick={() => navigate('/library')}
            className="px-6 py-3 rounded-full bg-white text-slate-900 font-medium border border-slate-200 hover:bg-slate-50 transition"
          >
            Browse Decks
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero