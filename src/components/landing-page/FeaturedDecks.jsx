import { useEffect, useState } from 'react'
import { getPublicDecks } from '../../api/client'

function FeaturedDecks() {
  const [decks, setDecks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPublicDecks()
      .then((data) => setDecks(data.slice(0, 4))) // featured = first 4 for now
      .catch(() => setError('Could not load decks'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="py-12 text-center">Loading decks...</div>
  if (error) return <div className="py-12 text-center text-red-500">{error}</div>

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">Featured Decks</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        {decks.map((deck) => (
          <div key={deck.id} className="border rounded-xl p-4 hover:shadow-md transition">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100">
              {deck.difficulty_level}
            </span>
            <h3 className="font-semibold mt-2">{deck.title}</h3>
            <p className="text-sm text-gray-500">{deck.category}</p>
            <p className="text-xs text-gray-400 mt-1">{deck.num_flashcards} cards</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedDecks