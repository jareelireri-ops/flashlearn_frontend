import { useEffect, useState } from 'react'
import { getPublicCategories } from '../../api/client'

function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getPublicCategories()
      .then(setCategories)
      .catch(() => setError('Could not load categories'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="py-12 text-center">Loading categories...</div>
  if (error) return <div className="py-12 text-center text-red-500">{error}</div>

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">5 Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
        {categories.map((cat) => (
          <div
            key={cat.category}
            className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer"
          >
            <h3 className="font-semibold">{cat.category}</h3>
            <p className="text-sm text-gray-500">{cat.deck_count} decks</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Categories