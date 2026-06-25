import axios from 'axios'

const client = axios.create({
  baseURL: 'http://127.0.0.1:5000/api',
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client

export async function getPublicCategories() {
  const response = await client.get('/public/categories')
  return response.data
}

export async function getPublicDecks(params = {}) {
  const response = await client.get('/public/decks', { params })
  return response.data
}

export async function getMyCollection() {
  const response = await client.get('/collection')
  return response.data
}

export async function getCompletionStats() {
  const response = await client.get('/study/analytics/completion')
  return response.data // [{ deck_id, deck_title, total_cards, cards_reviewed, completion_pct }]
}

export async function addToCollection(deckId) {
  const response = await client.post(`/collection/add/${deckId}`)
  return response.data
}

export async function startStudySession(deckId) {
  const response = await client.post(`/study/${deckId}/start`)
  return response.data
}