import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { resetPassword } from '../api/client'
import Navbar from '../components/ReusableComponents/Navbar'

function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tokenFromUrl = searchParams.get('token') || ''

  const [token, setToken] = useState(tokenFromUrl)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!token.trim()) {
      setError('Reset token is required.')
      return
    }

    setLoading(true)
    try {
      await resetPassword(token.trim(), password)
      setSuccess(true)
      setTimeout(() => navigate('/'), 2500)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h1 className="text-xl font-bold text-slate-900 mb-2">Reset Password</h1>
          <p className="text-sm text-slate-500 mb-6">Enter your reset token and choose a new password.</p>

          {success ? (
            <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              Password reset successfully. Redirecting to sign in...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">RESET TOKEN</label>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste your reset token"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">NEW PASSWORD</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">CONFIRM PASSWORD</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}

          <p className="text-xs text-slate-400 mt-4 text-center">
            <Link to="/" className="text-red-500 hover:underline">Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword