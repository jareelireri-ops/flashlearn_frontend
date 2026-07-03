import { useEffect, useState } from 'react'
import { Pencil } from 'lucide-react'
import { getPublicDecks } from '../../api/client'

const DIFFICULTY_STYLES = {
  easy: 'bg-emerald-50 text-emerald-600',
  medium: 'bg-amber-50 text-amber-600',
  hard: 'bg-red-50 text-red-600',
}

// Darker background pencils — gray-900 ink, tuned for visibility on bg-slate-100
const PENCILS = [
  { top: '10%', left: '3%', rotate: -18, size: 90, opacity: 0.16 },
  { top: '65%', left: '95%', rotate: 26, size: 110, opacity: 0.16 },
]

function FeaturedDecks() {
  const [decks, setDecks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPublicDecks()
      // Extract decks array from paginated response
      .then((data) => setDecks((data.decks || []).slice(0, 4)))
      .catch(() => setError('Could not load decks'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="py-16 text-center text-slate-400">Loading decks...</div>
  if (error) return <div className="py-16 text-center text-red-500">{error}</div>

  return (
    <section className="relative py-20 px-6 bg-slate-100 overflow-hidden">
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

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">Ready to study</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">Featured Decks</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {decks.map((deck) => (
            <div
              key={deck.id}
              role="button"
              tabIndex={0}
              className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <span
                className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                  DIFFICULTY_STYLES[deck.difficulty_level] || 'bg-slate-100 text-slate-500'
                }`}
              >
                {deck.difficulty_level}
              </span>
              <h3 className="font-semibold text-slate-900 mt-3">{deck.title}</h3>
              <p className="text-sm text-slate-400">{deck.category}</p>
              <p className="text-xs text-slate-400 mt-2">{deck.num_flashcards} cards</p>

              <Pencil
                size={14}
                className="absolute top-4 right-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedDecks