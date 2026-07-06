import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api',
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Endpoints where a 401 means "bad credentials on this attempt",
// not "your session expired" , so we don't log the user out on 401s from these endpoints.
const AUTH_ATTEMPT_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
]

function isAuthAttempt(url = '') {
  return AUTH_ATTEMPT_PATHS.some((path) => url.includes(path))
}

// Client-side redirect to "/" without a full page reload, to avoid losing React state.
//  This is used when the backend returns a 401 on an authenticated route, indicating the session has expired.
function redirectToHome() {
  if (window.location.pathname !== '/') {
    window.history.pushState({}, '', '/')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }
}

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''

    // Only treat 401s from already-authenticated routes as an expiredsession.
    //  401s from login/register/forgot-password/reset-password are treated as "bad credentials" and do not log the user out.
    if (status === 401 && !isAuthAttempt(url)) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      redirectToHome()
    }

    return Promise.reject(error)
  }
)

export default client

// AUTH
export async function getAuthRequirements() {
  const response = await client.get('/auth/requirements')
  return response.data
}

export async function forgotPassword(email) {
  const response = await client.post('/auth/forgot-password', { email })
  return response.data
}

export async function resetPassword(token, newPassword) {
  const response = await client.post('/auth/reset-password', {
    token,
    new_password: newPassword,
  })
  return response.data
}

export async function getProfile() {
  const response = await client.get('/auth/profile')
  return response.data
}

export async function updateProfile(data) {
  const response = await client.put('/auth/profile', data)
  return response.data
}

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
export async function getMyCollection(params = {}) {
  const response = await client.get('/collection', { params })
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
export async function startStudySession(deckId, data = {}) {
  const response = await client.post(`/study/${deckId}/start`, data, {
    headers: { 'Content-Type': 'application/json' }
  })
  return response.data
}

export async function getActiveSession(deckId) {
  const response = await client.get(`/study/${deckId}/active`)
  return response.data
}

export async function pauseSession(sessionId, currentCardIndex) {
  const response = await client.put(`/study/sessions/${sessionId}/pause`, {
    current_card_index: currentCardIndex,
  })
  return response.data
}

export async function resumeSession(sessionId) {
  const response = await client.put(`/study/sessions/${sessionId}/resume`)
  return response.data
}

export async function completeSession(sessionId) {
  const response = await client.put(`/study/sessions/${sessionId}/complete`)
  return response.data
}

export async function submitRating(sessionId, flashcardId, rating) {
  const response = await client.post(`/study/sessions/${sessionId}/review`, {
    flashcard_id: flashcardId,
    rating,
  })
  return response.data
}

export async function listSessions(status) {
  const response = await client.get('/study/sessions', {
    params: status ? { status } : {},
  })
  return response.data
}

export async function getReviewQueue(deckId) {
  const response = await client.get('/study/review-queue', {
    params: deckId ? { deck_id: deckId } : {},
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
  const response = await client.post('/notifications/check-due')
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
export async function getDeckDetails(deckId) {
  const response = await client.get(`/decks/${deckId}`)
  return response.data
}

export async function getUserDecks(params = {}) {
  const response = await client.get('/decks', { params })
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
export async function getDeckFlashcards(deckId, params = {}) {
  const response = await client.get(`/decks/${deckId}/flashcards`, { params })
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
  return response.data
}

export async function updateUserStatus(userId, isActive) {
  const response = await client.put(`/admin/users/${userId}/status`, { is_active: isActive })
  return response.data
}

export async function getAdminReports(status = null) {
  const response = await client.get('/admin/reports', {
    params: status ? { status } : {},
  })
  return response.data
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

