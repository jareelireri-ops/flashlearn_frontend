import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { UIContext } from '../../context/UIContext'

function AdminModal() {
  const { login, logout } = useContext(AuthContext)
  const { adminModalOpen, closeAdminModal } = useContext(UIContext)
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState(null)
  const [credentials, setCredentials] = useState({ email: '', password: '' })

  if (!adminModalOpen) return null

  const isEmailInvalid = (email) => email.length > 0 && (!email.includes('@') || !email.includes('.'))

  function handleClose() {
    setCredentials({ email: '', password: '' })
    setServerError(null)
    closeAdminModal()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (isEmailInvalid(credentials.email) || credentials.password.length === 0) return

    setServerError(null)
    setLoading(true)
    try {
      const loggedInUser = await login(credentials.email, credentials.password)

      if (loggedInUser?.role === 'admin') {
        handleClose()
        navigate('/admin')
      } else {
        // Credentials were valid but belong to a non-admin account.
        // Don't leave the app silently signed in as them through this portal.
        await logout()
        setServerError('This portal is for administrators only. Please use an admin account.')
      }
    } catch (err) {
      setServerError(err.response?.data?.error || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white">
            <ShieldCheck size={16} />
          </div>
          <span className="font-semibold text-gray-900">Admin Access</span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-1">Are you an admin?</h2>
        <p className="text-sm text-gray-500 mb-5">
          Sign in with your administrator credentials to access the FlashLearn control panel.
        </p>

        {serverError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">ADMIN EMAIL</label>
            <input
              type="email"
              required
              placeholder="xxxx@xxxx.com"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                isEmailInvalid(credentials.email) ? 'border-red-400 ring-red-400' : 'border-gray-200 focus:ring-slate-400'
              }`}
            />
            {isEmailInvalid(credentials.email) && (
              <p className="text-xs text-red-500 mt-1">Please enter a valid email address.</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">PASSWORD</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {loading ? 'Verifying...' : 'Enter Admin Portal'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminModal