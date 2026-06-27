import { useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { UIContext } from '../../context/UIContext'
import { NotificationContext } from '../../context/NotificationContext'
import NotificationBadge from '../ReusableComponents/NotificationBadge'

function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const { openAuthModal } = useContext(UIContext)
  const { unreadCount } = useContext(NotificationContext)
  const navigate = useNavigate()

  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto bg-white border-b border-slate-200">

      <Link to="/" className="flex items-center gap-2 transition hover:opacity-80">
        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
          FL
        </div>
        <span className="font-semibold text-gray-900 tracking-tight">FlashLearn</span>
      </Link>

      {user ? (
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/notifications')}
            className="relative text-slate-500 hover:text-slate-900 transition"
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5">
                <NotificationBadge count={unreadCount} />
              </span>
            )}
          </button>

          <span className="font-medium text-gray-900">{user.name}</span>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition shadow-sm"
          >
            View Dashboard
          </button>
          <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700 transition">
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button
            onClick={() => openAuthModal('login')}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
          >
            Sign in
          </button>
          <button
            onClick={() => openAuthModal('register')}
            className="px-5 py-2 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition shadow-sm"
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar