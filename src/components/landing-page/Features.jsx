import { Layers, PenSquare, Trash2, FolderPlus, Pencil } from 'lucide-react'

// Same sparse background pencils used in the how-it-works section, for consistency
const PENCILS = [
  { top: '8%', left: '4%', rotate: -18, size: 100, opacity: 0.06 },
  { top: '70%', left: '90%', rotate: 24, size: 120, opacity: 0.05 },
]

function Features() {
  return (
    <section className="relative bg-slate-900 text-white px-6 py-20 overflow-hidden border-t-4 border-red-500">
      {PENCILS.map((p, i) => (
        <Pencil
          key={i}
          className="absolute text-white pointer-events-none"
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

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs font-bold text-red-500 uppercase tracking-[0.2em]">Inside every category</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-3 leading-none">
            Decks full of <span className="text-red-500">flashcards</span>, made for studying.
          </h2>
          <p className="text-slate-400 mt-4">
            Every category holds curated decks. Each deck is a set of flashcards — a
            question on the front, the answer on the back. As your own learner account
            grows, you can build a personal library too.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2">
                <FolderPlus size={18} className="text-white" />
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Create decks</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2">
                <PenSquare size={18} className="text-white" />
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Edit anytime</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-2">
                <Trash2 size={18} className="text-white" />
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Delete freely</p>
            </div>
          </div>
        </div>

        <div className="relative h-64">
          <div className="absolute inset-0 bg-white/5 rotate-3" />
          <div className="absolute inset-0 bg-slate-800 border border-white/10 -rotate-2 shadow-xl flex items-center justify-center">
            <Layers size={48} className="text-red-500" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features