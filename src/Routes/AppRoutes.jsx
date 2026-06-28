import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

import Landing from '../pages/Landing'
import Dashboard from '../pages/Dashboard'
import Library from '../pages/Library'
import Builder from '../pages/Builder'
import StudyArea from '../pages/StudyArea'
import Notifications from '../pages/Notifications'
import Admin from '../pages/Admin'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

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

    </Routes>
  )
}

export default AppRoutes