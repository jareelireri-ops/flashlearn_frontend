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

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default client

// PUBLIC (no auth required)
export async function getPublicCategories() {
  const response = await client.get('/public/categories')
  return response.data
}

export async function getPublicDecks(params = {}) {
  const response = await client.get('/public/decks', { params })
  return response.data
}

export async function getDeckPreview(deckId) {
  const response = await client.get(`/decks/${deckId}/preview`)
  return response.data
}

// COLLECTION
export async function getMyCollection() {
  const response = await client.get('/collection')
  return response.data
}

export async function addToCollection(deckId) {
  const response = await client.post(`/collection/add/${deckId}`)
  return response.data
}

export async function removeFromCollection(deckId) {
  const response = await client.delete(`/collection/remove/${deckId}`)
  return response.data
}

// STUDY SESSIONS
export async function startStudySession(deckId) {
  const response = await client.post(`/study/${deckId}/start`, {}, {
    headers: { 'Content-Type': 'application/json' }
  })
  return response.data
}

export async function getActiveSession(deckId) {
  const response = await client.get(`/study/${deckId}/active`)
  return response.data
}

export async function pauseSession(sessionId, currentCardIndex) {
  const response = await client.patch(`/study/sessions/${sessionId}/pause`, {
    current_card_index: currentCardIndex,
  })
  return response.data
}

export async function resumeSession(sessionId) {
  const response = await client.patch(`/study/sessions/${sessionId}/resume`)
  return response.data
}

export async function completeSession(sessionId) {
  const response = await client.patch(`/study/sessions/${sessionId}/complete`)
  return response.data
}

export async function submitRating(sessionId, flashcardId, rating) {
  const response = await client.post(`/study/sessions/${sessionId}/review`, {
    flashcard_id: flashcardId,
    rating,
  })
  return response.data
}

// DASHBOARD & ANALYTICS
export async function getDashboardStats() {
  const response = await client.get('/study/dashboard')
  return response.data
}

export async function getTopDecks() {
  const response = await client.get('/study/analytics/top-decks')
  return response.data
}

export async function getDailyAnalytics(days = 7) {
  const response = await client.get('/study/analytics/daily', { params: { days } })
  return response.data
}

export async function getCompletionStats() {
  const response = await client.get('/study/analytics/completion')
  return response.data
}

export async function checkDueCards() {
  const response = await client.get('/reviews/due')
  return response.data
}

// PROFILE
export async function updateProfile(data) {
  const response = await client.put('/profile', data)
  return response.data
}

// NOTIFICATIONS
export async function getUnreadNotificationCount() {
  const response = await client.get('/notifications/unread-count')
  return response.data
}

export async function listNotifications(unreadOnly = false) {
  const response = await client.get('/notifications', {
    params: unreadOnly ? { unread: 'true' } : {},
  })
  return response.data
}

export async function markNotificationRead(notificationId) {
  const response = await client.put(`/notifications/${notificationId}/read`)
  return response.data
}

export async function markAllNotificationsRead() {
  const response = await client.put('/notifications/read-all')
  return response.data
}

export async function deleteNotification(notificationId) {
  const response = await client.delete(`/notifications/${notificationId}`)
  return response.data
}

// REPORTS
export async function submitReport(data) {
  const response = await client.post('/reports', data)
  return response.data
}

// DECK MANAGEMENT
export async function getUserDecks() {
  const response = await client.get('/decks')
  return response.data
}

export async function createDeck(data) {
  const response = await client.post('/decks', data)
  return response.data
}

export async function updateDeck(deckId, data) {
  const response = await client.put(`/decks/${deckId}`, data)
  return response.data
}

export async function deleteDeck(deckId) {
  const response = await client.delete(`/decks/${deckId}`)
  return response.data
}

// FLASHCARD MANAGEMENT
export async function getDeckFlashcards(deckId) {
  const response = await client.get(`/decks/${deckId}/flashcards`)
  return response.data
}

export async function addFlashcard(deckId, data) {
  const response = await client.post(`/decks/${deckId}/flashcards`, data)
  return response.data
}

export async function updateFlashcard(cardId, data) {
  const response = await client.put(`/flashcards/${cardId}`, data)
  return response.data
}

export async function deleteFlashcard(cardId) {
  const response = await client.delete(`/flashcards/${cardId}`)
  return response.data
}


// ADMIN

export async function getAllUsers() {
  const response = await client.get('/admin/users')
  return response.data // [{ id, email, name, role, is_active, created_at }]
}

export async function updateUserStatus(userId, isActive) {
  const response = await client.put(`/admin/users/${userId}/status`, { is_active: isActive })
  return response.data
}

export async function getAdminReports(status = null) {
  const response = await client.get('/admin/reports', {
    params: status ? { status } : {},
  })
  return response.data // [{ id, reporter_id, deck_id, flashcard_id, reason, status, created_at }]
}

export async function resolveReport(reportId, status) {
  const response = await client.put(`/admin/reports/${reportId}`, { status })
  return response.data
}

export async function adminDeleteContent({ deckId, flashcardId }) {
  const response = await client.delete('/admin/content', {
    params: deckId ? { deck_id: deckId } : { flashcard_id: flashcardId },
  })
  return response.data
}