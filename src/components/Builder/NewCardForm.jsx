import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { DIFFICULTIES } from '../ReusableComponents/constants'
import ImageUploadField from './ImageUploadField'


// creating  a new card with all its requirements
function NewCardForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({ question: '', answer: '', difficulty_level: 'medium', image_url: '' })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [imageError, setImageError] = useState(null)

  async function handleAdd() {
    const e = {}
    if (!form.question.trim()) e.question = 'Question is required'
    if (!form.answer.trim()) e.answer = 'Answer is required'
    if (Object.keys(e).length) { setErrors(e); return }
    setSaving(true)
    await onAdd(form)
    setSaving(false)
  }

  return (
    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl space-y-3">
      <p className="text-sm font-semibold text-slate-800">New Flashcard</p>
      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">Question *</label>
        <textarea
          value={form.question}
          onChange={(e) => { setForm({ ...form, question: e.target.value }); setErrors({ ...errors, question: null }) }}
          rows={2}
          placeholder="What is the question?"
          className={`w-full text-sm border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white resize-none ${errors.question ? 'border-red-400' : 'border-slate-200'}`}
        />
        {errors.question && <p className="text-xs text-red-500 mt-1">{errors.question}</p>}
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-500 mb-1 block">Answer *</label>
        <textarea
          value={form.answer}
          onChange={(e) => { setForm({ ...form, answer: e.target.value }); setErrors({ ...errors, answer: null }) }}
          rows={2}
          placeholder="What is the answer?"
          className={`w-full text-sm border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white resize-none ${errors.answer ? 'border-red-400' : 'border-slate-200'}`}
        />
        {errors.answer && <p className="text-xs text-red-500 mt-1">{errors.answer}</p>}
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
          onClick={handleAdd}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition"
        >
          <Plus size={13} /> {saving ? 'Adding...' : 'Add Card'}
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-lg transition"
        >
          <X size={13} /> Cancel
        </button>
      </div>
    </div>
  )
}

export default NewCardForm