import { useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { UIContext } from '../../context/UIContext'
import { NotificationContext } from '../../context/NotificationContext'
import NotificationBadge from '../ReusableComponents/NotificationBadge'
import Avatar from '../ReusableComponents/Avatar'

function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const { openAuthModal } = useContext(UIContext)
  const { unreadCount } = useContext(NotificationContext)
  const navigate = useNavigate()

  const isLearner = user && user.role === 'learner'

  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 bg-white border-b-2 border-gray-900">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 sm:gap-2.5 hover:opacity-80 transition-opacity shrink-0">
        <div
          className="w-7 h-7 bg-red-600 flex items-center justify-center text-white text-xs font-bold"
          style={{ borderRadius: 0, fontFamily: '"Bebas Neue", "Impact", sans-serif', letterSpacing: '0.05em' }}
        >
          FL
        </div>
        <span className="font-semibold text-gray-900 text-sm tracking-tight">FlashLearn</span>
      </Link>

      {/* Auth-aware right side */}
      {user ? (
        <div className="flex items-center gap-2 sm:gap-5">
          {/* Notifications */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative text-gray-400 hover:text-gray-900 transition-colors"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5">
                <NotificationBadge count={unreadCount} />
              </span>
            )}
          </button>

          {/* Avatar + Username (name hidden on very small screens) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Avatar user={user} size={32} />
            <span className="hidden sm:inline text-sm font-medium text-gray-900">{user.name}</span>
          </div>

          {/* Dashboard CTA - learners only, icon-only label collapses on mobile */}
          {isLearner && (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-3 sm:px-4 py-2 bg-gray-900 text-white text-xs sm:text-sm font-semibold border border-gray-900 hover:bg-gray-800 transition-colors whitespace-nowrap"
              style={{ borderRadius: 0 }}
            >
              <span className="hidden sm:inline">View Dashboard</span>
              <span className="sm:hidden">Dashboard</span>
            </button>
          )}

          {/* Logout */}
          <button
            onClick={logout}
            className="text-xs sm:text-sm text-gray-400 hover:text-gray-700 transition-colors font-medium whitespace-nowrap"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => openAuthModal('login')}
            className="text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap"
          >
            Sign in
          </button>
          <button
            onClick={() => openAuthModal('register')}
            className="px-3 sm:px-5 py-2 bg-red-600 text-white text-xs sm:text-sm font-semibold border border-red-600 hover:bg-red-700 transition-colors whitespace-nowrap"
            style={{ borderRadius: 0 }}
          >
            Get started
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar