import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <div>Loading...</div>
  }

  // If the user is already logged in, redirect them away from public pages (like Landing)
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  // If no user is logged in, show the public page
  return children
}

export default PublicRoute
