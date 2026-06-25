import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { UIContext } from '../../context/UIContext'

function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const { openAuthModal } = useContext(UIContext)
  const navigate = useNavigate()

  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto bg-white border-b border-slate-200">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold">
          FL
        </div>
        <span className="font-semibold text-gray-900">FlashLearn</span>
      </div>

      {user ? (
        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-900">{user.name}</span>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition"
          >
            View Dashboard
          </button>
          <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button
            onClick={() => openAuthModal('login')}
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Sign in
          </button>
          <button
            onClick={() => openAuthModal('register')}
            className="px-5 py-2 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar