import { useState } from 'react'
import { Trash2, Pencil, Check, X } from 'lucide-react'
import { DIFFICULTIES } from '../ReusableComponents/constants'
import ImageUploadField from './ImageUploadField'

//  Flashcard row (view and edit)
function FlashcardRow({ card, onSave, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    question: card.question,
    answer: card.answer,
    difficulty_level: card.difficulty_level,
    image_url: card.image_url || '',
  })
  const [saving, setSaving] = useState(false)
  const [imageError, setImageError] = useState(null)

  async function handleSave() {
    if (!form.question.trim() || !form.answer.trim()) return
    setSaving(true)
    await onSave(card.id, form)
    setSaving(false)
    setEditing(false)
  }

  function handleCancel() {
    setEditing(false)
    setImageError(null)
    setForm({
      question: card.question,
      answer: card.answer,
      difficulty_level: card.difficulty_level,
      image_url: card.image_url || '',
    })
  }

  if (!editing) {
    return (
      <div className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-xl group">
        {card.image_url && (
          <img
            src={card.image_url}
            alt=""
            className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">{card.question}</p>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{card.answer}</p>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 capitalize ${
          card.difficulty_level === 'easy' ? 'bg-emerald-50 text-emerald-600' :
          card.difficulty_level === 'hard' ? 'bg-red-50 text-red-500' :
          'bg-amber-50 text-amber-600'
        }`}>
          {card.difficulty_level}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(card.id)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-slate-50 border-2 border-red-200 rounded-xl space-y-3">
      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">Question *</label>
        <textarea
          value={form.question}
          onChange={(e) => setForm({ ...form, question: e.target.value })}
          rows={2}
          className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white resize-none"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">Answer *</label>
        <textarea
          value={form.answer}
          onChange={(e) => setForm({ ...form, answer: e.target.value })}
          rows={2}
          className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white resize-none"
        />
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Difficulty</label>
          <select
            value={form.difficulty_level}
            onChange={(e) => setForm({ ...form, difficulty_level: e.target.value })}
            className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
          >
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <ImageUploadField
            value={form.image_url}
            onChange={(val) => setForm({ ...form, image_url: val })}
            error={imageError}
            onError={setImageError}
          />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleSave}
          disabled={!form.question.trim() || !form.answer.trim() || saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition"
        >
          <Check size={13} /> {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={handleCancel}
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-lg transition"
        >
          <X size={13} /> Cancel
        </button>
      </div>
    </div>
  )
}

export default FlashcardRow