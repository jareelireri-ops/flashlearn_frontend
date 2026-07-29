import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  if (!adminOnly && user.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default ProtectedRoute