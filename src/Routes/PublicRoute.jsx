import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <div>Loading...</div>
  }

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />
  }

  return children
}

export default PublicRoute