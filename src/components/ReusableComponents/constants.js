export const CATEGORIES = [
  'Software Engineering', 'Biblical Studies', 'Philosophy',
  'Business Management', 'Hospitality', 'Language Learning',
  'Science', 'Mathematics', 'History', 'Other',
]

export const DIFFICULTIES = ['easy', 'medium', 'hard']

// Max image size before we warn (base64 inflates ~33%, and Postgres/JSON payloads
// get fast — 1.5MB raw file keeps the resulting string reasonable) the image rarely surpasses that
export const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024

// Using a Helper to convert a File to a base64 data URL 
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}