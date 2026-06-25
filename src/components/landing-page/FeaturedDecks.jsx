import { useEffect, useState } from 'react'
import { getPublicDecks } from '../../api/client'

const DIFFICULTY_STYLES = {
  easy: 'bg-emerald-50 text-emerald-600',
  medium: 'bg-amber-50 text-amber-600',
  hard: 'bg-red-50 text-red-600',
}

function FeaturedDecks() {
  const [decks, setDecks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPublicDecks()
      .then((data) => setDecks(data.slice(0, 4)))
      .catch(() => setError('Could not load decks'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="py-16 text-center text-slate-400">Loading decks...</div>
  if (error) return <div className="py-16 text-center text-red-500">{error}</div>

  return (
    <section className="py-20 px-6 bg-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">Ready to study</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">Featured Decks</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedDecks