import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

import Landing from '../pages/Landing'
import Dashboard from '../pages/Dashboard'
import Library from '../pages/Library'
import Builder from '../pages/Builder'
import StudyArea from '../pages/StudyArea'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/library"
        element={
          <ProtectedRoute>
            <Library />
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
    </Routes>
  )
}

export default AppRoutes