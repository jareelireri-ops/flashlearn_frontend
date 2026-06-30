import { Check, Globe, Lock } from 'lucide-react'
import { CATEGORIES, DIFFICULTIES } from '../ReusableComponents/constants'

//function of creating and editting a deck 
function DeckForm({ deckForm, setDeckForm, deckErrors, setDeckErrors, deckSaving, isEditing, onSave, onCancel }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-5">
        {isEditing ? 'Edit Deck' : 'Create New Deck'}
      </h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Title *</label>
          <input
            type="text"
            value={deckForm.title}
            onChange={(e) => { setDeckForm({ ...deckForm, title: e.target.value }); setDeckErrors({ ...deckErrors, title: null }) }}
            placeholder="e.g. JavaScript Basics"
            className={`w-full text-sm border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-300 ${deckErrors.title ? 'border-red-400' : 'border-slate-200'}`}
          />
          {deckErrors.title && <p className="text-xs text-red-500 mt-1">{deckErrors.title}</p>}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Description</label>
          <textarea
            value={deckForm.description}
            onChange={(e) => setDeckForm({ ...deckForm, description: e.target.value })}
            placeholder="What is this deck about?"
            rows={3}
            className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Category</label>
            <select
              value={deckForm.category}
              onChange={(e) => setDeckForm({ ...deckForm, category: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
            >
              <option value="">No category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">Difficulty</label>
            <select
              value={deckForm.difficulty_level}
              onChange={(e) => setDeckForm({ ...deckForm, difficulty_level: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
            >
              <option value="">Not set</option>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Tags</label>
          <input
            type="text"
            value={deckForm.tags}
            onChange={(e) => setDeckForm({ ...deckForm, tags: e.target.value })}
            placeholder="e.g. arrays, sorting, algorithms"
            className="w-full text-sm border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-300"
          />
          <p className="text-xs text-slate-400 mt-1">Separate tags with commas</p>
        </div>

        {/* Visibility of deck */}
        <div
          onClick={() => setDeckForm({ ...deckForm, is_public: !deckForm.is_public })}
          className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition select-none ${
            deckForm.is_public
              ? 'bg-emerald-50 border-emerald-200'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            deckForm.is_public ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
          }`}>
            {deckForm.is_public ? <Globe size={18} /> : <Lock size={18} />}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {deckForm.is_public ? 'Public — visible in community library' : 'Private — only you can see this'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {deckForm.is_public
                ? 'Other learners can find and study this deck'
                : 'Click to make this deck public'}
            </p>
          </div>
          {/* private/public  toggle */}
          <div className={`ml-auto w-11 h-6 rounded-full transition shrink-0 relative ${deckForm.is_public ? 'bg-emerald-500' : 'bg-slate-300'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${deckForm.is_public ? 'left-6' : 'left-1'}`} />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onSave}
            disabled={deckSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition"
          >
            <Check size={14} />
            {deckSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Deck'}
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-xl transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeckForm