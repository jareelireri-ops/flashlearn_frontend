export const CATEGORIES = [
  'Software Engineering', 'Biblical Studies', 'Philosophy',
  'Business Management', 'Hospitality', 'Language Learning',
  'Science', 'Mathematics', 'History', 'Other',
]

export const DIFFICULTIES = ['easy', 'medium', 'hard']

export const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024

// Using a Helper to convert a File to a base64 data URL ,to allow uploading
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

// js file for constants that are reused across multiple components, 
// to avoid typos and make it easier to update in one place.