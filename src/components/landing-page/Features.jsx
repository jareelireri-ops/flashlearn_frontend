import { Layers, PenSquare, Trash2, FolderPlus } from 'lucide-react'

function Features() {
  return (
    <section className="px-6 py-20 bg-blue-100">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">Inside every category</span>
          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            Decks full of flashcards, made for studying.
          </h2>
          <p className="text-slate-600 mt-4">
            Every category holds curated decks. Each deck is a set of flashcards — a
            question on the front, the answer on the back. As your own learner account
            grows, you can build a personal library too.
          </p>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mx-auto mb-2">
                <FolderPlus size={18} className="text-blue-500" />
              </div>
              <p className="text-xs font-medium text-slate-700">Create decks</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mx-auto mb-2">
                <PenSquare size={18} className="text-amber-500" />
              </div>
              <p className="text-xs font-medium text-slate-700">Edit anytime</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mx-auto mb-2">
                <Trash2 size={18} className="text-red-500" />
              </div>
              <p className="text-xs font-medium text-slate-700">Delete freely</p>
            </div>
          </div>
        </div>

        <div className="relative h-64">
          <div className="absolute inset-0 bg-white/70 rounded-2xl rotate-3" />
          <div className="absolute inset-0 bg-white border border-slate-200 rounded-2xl -rotate-2 shadow-xl flex items-center justify-center">
            <Layers size={48} className="text-red-300" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features