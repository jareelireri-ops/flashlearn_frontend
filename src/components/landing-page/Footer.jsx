import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { UIContext } from '../../context/UIContext'

function Footer() {
  const { user, logout } = useContext(AuthContext)
  const { openAuthModal } = useContext(UIContext)
  const navigate = useNavigate()

  return (
    <footer className="bg-slate-950 text-slate-400 px-6 py-14">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <span className="text-red-400 text-xs font-semibold uppercase tracking-wide">
            Spaced repetition, simplified
          </span>
          <h4 className="text-white text-lg font-bold mt-2">FlashLearn</h4>
          <p className="text-sm mt-3">
            A flashcard study platform covering Software Engineering, Philosophy,
            Biblical Studies, Business, and Hospitality.
          </p>
        </div>

        <div>
          <h5 className="text-white text-xs font-semibold uppercase tracking-wide mb-4">Explore</h5>
          <ul className="space-y-2.5 text-sm">
            <li><button onClick={() => navigate('/library')} className="hover:text-white transition">Browse All Decks</button></li>
            <li><button onClick={() => navigate('/library', { state: { category: 'Software Engineering' } })} className="hover:text-white transition">Software Engineering</button></li>
            <li><button onClick={() => navigate('/library', { state: { category: 'Philosophy' } })} className="hover:text-white transition">Philosophy</button></li>
            <li><button onClick={() => navigate('/library', { state: { category: 'Biblical Studies' } })} className="hover:text-white transition">Biblical Studies</button></li>
            <li><button onClick={() => navigate('/library', { state: { category: 'Business Management' } })} className="hover:text-white transition">Business Management</button></li>
            <li><button onClick={() => navigate('/library', { state: { category: 'Hospitality' } })} className="hover:text-white transition">Hospitality</button></li>
          </ul>
        </div>

        <div>
          <h5 className="text-white text-xs font-semibold uppercase tracking-wide mb-4">Platform</h5>
          <ul className="space-y-2.5 text-sm">
            {user ? (
              <>
                <li><button onClick={() => navigate('/dashboard')} className="hover:text-white transition">Dashboard</button></li>
                <li><button onClick={() => navigate('/decks/manage')} className="hover:text-white transition">Create a Deck</button></li>
                <li><button onClick={logout} className="hover:text-white transition">Logout</button></li>
              </>
            ) : (
              <>
                <li><button onClick={() => openAuthModal('register')} className="hover:text-white transition">Register</button></li>
                <li><button onClick={() => openAuthModal('login')} className="hover:text-white transition">Sign In</button></li>
              </>
            )}
            <li><button onClick={() => navigate('/library')} className="hover:text-white transition">Browse Categories</button></li>
            <li><a href="#" className="hover:text-white transition">About Us</a></li>
            <li>
              <button onClick={() => openAuthModal('login', { redirectAdminTo: '/admin' })} className="hover:text-white transition">
                Admin Portal
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-white text-xs font-semibold uppercase tracking-wide mb-4">Contact Us</h5>
          <ul className="space-y-2.5 text-sm">
            <li>supportfl@gmail.com</li>
            <li>+254 719 527 252</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between gap-2 text-xs">
        <span>© 2026 FlashLearn. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Terms of Use</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer