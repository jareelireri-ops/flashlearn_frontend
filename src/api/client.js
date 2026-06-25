import axios from 'axios'

const client = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
})

// Attach the JWT to every request automatically, if one exists
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client

// --- Public landing page endpoints (no auth required) ---

export async function getPublicCategories() {
  const response = await client.get('/public/categories')
  return response.data // [{ category, deck_count }]
}

export async function getPublicDecks(params = {}) {
  // params can include: category, search
  const response = await client.get('/public/decks', { params })
  return response.data // [{ id, title, description, category, difficulty_level, creator, num_flashcards, num_learners }]
}