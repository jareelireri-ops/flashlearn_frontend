import { Globe, Lock, Archive, ArchiveRestore, Pencil, Trash2 } from 'lucide-react'

// Selected deck card (contain info and Edit/Archive/Delete actions) 
function DeckHeaderCard({ deck, onEdit, onArchive, onDeleteRequest }) {
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-6 ${deck.is_archived ? 'border-amber-200 bg-amber-50/40' : 'border-slate-200'}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {deck.is_public
              ? <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"><Globe size={10} /> Public</span>
              : <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full"><Lock size={10} /> Private</span>
            }
            {deck.is_archived && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full"><Archive size={10} /> Archived</span>
            )}
            {deck.difficulty_level && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                deck.difficulty_level === 'easy' ? 'bg-emerald-50 text-emerald-600' :
                deck.difficulty_level === 'hard' ? 'bg-red-50 text-red-500' :
                'bg-amber-50 text-amber-600'
              }`}>{deck.difficulty_level}</span>
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-900">{deck.title}</h2>
          {deck.description && <p className="text-sm text-slate-500 mt-1">{deck.description}</p>}
          {deck.tags && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {deck.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
                <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">#{tag}</span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition"
          >
            <Pencil size={13} /> Edit
          </button>
          <button
            onClick={onArchive}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-slate-200 hover:bg-amber-50 hover:border-amber-200 text-slate-700 rounded-xl transition"
            title={deck.is_archived ? 'Restore' : 'Archive'}
          >
            {deck.is_archived ? <ArchiveRestore size={13} /> : <Archive size={13} />}
          </button>
          <button
            onClick={onDeleteRequest}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-700 hover:text-red-500 rounded-xl transition"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeckHeaderCard