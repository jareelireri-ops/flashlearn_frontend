import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

import Landing from '../pages/Landing'
import Dashboard from '../pages/Dashboard'
import Library from '../pages/Library'
import Builder from '../pages/Builder'
import StudyArea from '../pages/StudyArea'
import Notifications from '../pages/Notifications'
import Profile from '../pages/Profile'
import ResetPassword from '../pages/ResetPassword'
import Admin from '../pages/Admin'

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Landing />
          </PublicRoute>
        }
      />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Public routes for guests, but logged-in users see full content */}
      <Route path="/library" element={<Library />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/decks/manage"
        element={
          <ProtectedRoute>
            <Builder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/study/:deckId"
        element={
          <ProtectedRoute>
            <StudyArea />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />

      {/* Catch-all route to redirect unknown URLs to the home page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes