import { useState } from 'react'
import { Image, Upload } from 'lucide-react'
import { MAX_IMAGE_BYTES, fileToBase64 } from '../ReusableComponents/constants'

//  Reusable image upload function to be used when creating new card and editting too
function ImageUploadField({ value, onChange, error, onError }) {
  const [loading, setLoading] = useState(false)
  const inputId = `image-upload-${Math.random().toString(36).slice(2)}`

  async function handleFile(e) {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file) return

    if (!file.type.startsWith('image/')) {
      onError?.('Please select an image file')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      onError?.('Image is too large (max ~1.5MB)')
      return
    }

    onError?.(null)
    setLoading(true)
    try {
      const base64 = await fileToBase64(file)
      onChange(base64)
    } catch {
      onError?.('Failed to read image')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
        <Image size={11} /> Image
      </label>

      {value ? (
        <div className="flex items-center gap-2">
          <img
            src={value}
            alt="Flashcard"
            className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
          />
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-red-500 hover:text-red-600 cursor-pointer transition"
          >
            Replace
          </label>
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs font-medium text-slate-400 hover:text-slate-600 transition"
          >
            Remove
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className="flex items-center gap-2 text-sm border border-dashed border-slate-300 rounded-lg p-2 cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition text-slate-500"
        >
          <Upload size={13} />
          {loading ? 'Uploading...' : 'Upload image'}
        </label>
      )}

      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default ImageUploadField