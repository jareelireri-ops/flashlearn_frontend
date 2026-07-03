import { useEffect, useState } from 'react'
import { getPublicCategories } from '../../api/client'
import { Code2, BookOpen, Brain, Briefcase, UtensilsCrossed, Layers, Pencil } from 'lucide-react'

const ICONS = {
  'Software Engineering': Code2,
  'Biblical Studies': BookOpen,
  Philosophy: Brain,
  'Business Management': Briefcase,
  Hospitality: UtensilsCrossed,
}

// Darker background pencils — gray-900 ink, tuned for visibility on bg-slate-100
const PENCILS = [
  { top: '10%', left: '3%', rotate: -18, size: 90, opacity: 0.16 },
  { top: '65%', left: '95%', rotate: 26, size: 110, opacity: 0.16 },
]

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

  if (loading) return <div className="py-16 text-center text-slate-400">Loading categories...</div>
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
          <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">Explore</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2"> Categories</h2>
          <p className="text-slate-500 mt-2">Our Decks are grouped under various categories based on your need!</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = ICONS[cat.category] || Layers
            return (
              <div
                key={cat.category}
                role="button"
                tabIndex={0}
                className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 hover:border-red-200 transition-all cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-3 group-hover:bg-red-500 transition-colors">
                  <Icon size={20} className="text-red-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-semibold text-slate-900">{cat.category}</h3>
                <p className="text-sm text-slate-400">{cat.deck_count} decks</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Categories