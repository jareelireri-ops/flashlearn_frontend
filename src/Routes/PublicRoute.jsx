import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

function PublicRoute({ children }) {
  const { loading } = useContext(AuthContext)

  if (loading) {
    return <div>Loading...</div>
  }

  return children
}

export default PublicRoute