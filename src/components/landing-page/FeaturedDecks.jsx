import { useEffect, useState } from 'react'
import { Pencil } from 'lucide-react'
import { getPublicDecks } from '../../api/client'
import MechLoader from '../ReusableComponents/MechLoader'
import TiltWrapper from '../ReusableComponents/3DTiltWrapper'

const DIFFICULTY_STYLES = {
  easy: 'bg-emerald-50 text-emerald-600',
  medium: 'bg-amber-50 text-amber-600',
  hard: 'bg-emerald-50 text-emerald-600',
}

// Darker background pencils — gray-900 ink, tuned for visibility on bg-slate-100
const PENCILS = [
  { top: '10%', left: '3%', rotate: -18, size: 90, opacity: 0.16 },
  { top: '65%', left: '95%', rotate: 26, size: 110, opacity: 0.16 },
]

function FeaturedDecks() {
  const decks = [
    { id: 1, title: 'Secure HDD Eradication', category: 'Data Destruction', difficulty_level: 'medium', num_flashcards: 12 },
    { id: 2, title: 'Battery Handling 101', category: 'Lithium Safety', difficulty_level: 'easy', num_flashcards: 8 },
    { id: 3, title: 'Corporate ESG Basics', category: 'ESG Compliance', difficulty_level: 'easy', num_flashcards: 15 },
    { id: 4, title: 'MacBook Teardown Safety', category: 'Device Teardowns', difficulty_level: 'hard', num_flashcards: 20 },
  ]

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
          <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">Ready to study</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">Featured Decks</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {decks.map((deck) => (
            <TiltWrapper key={deck.id} className="cursor-pointer">
              <div
                role="button"
                tabIndex={0}
                className="group relative h-full bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl transition-all"
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
            </TiltWrapper>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedDecks