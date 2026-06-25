import { useState, useContext, useEffect } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { UIContext } from '../../context/UIContext'

function AuthModal() {
  const { login, register } = useContext(AuthContext)
  const { authModalOpen, authModalView, setAuthModalView, closeAuthModal } = useContext(UIContext)

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' })

  // Reset error when switching tabs, so a stale error doesn't linger across forms
  useEffect(() => {
    setError(null)
  }, [authModalView])

  if (!authModalOpen) return null

  async function handleLogin(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(loginData.email, loginData.password)
      closeAuthModal()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register(registerData.name, registerData.email, registerData.password)
      // Autofill the login form with what they just registered, then switch tabs
      setLoginData({ email: registerData.email, password: registerData.password })
      setAuthModalView('login')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        {/* Close button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* Logo + brand */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold">
            FL
          </div>
          <span className="font-semibold text-gray-900">FlashLearn</span>
        </div>

        {/* Tab toggle */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-6">
          <button
            onClick={() => setAuthModalView('login')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
              authModalView === 'login'
                ? 'bg-slate-900 text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthModalView('register')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
              authModalView === 'register'
                ? 'bg-slate-900 text-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {authModalView === 'login' ? (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome back 👋</h2>
            <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">EMAIL</label>
                <input
                  type="email"
                  name="flashlearn-login-email"
                  autoComplete="off"
                  required
                  placeholder="admin@flashlearn.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-gray-500">PASSWORD</label>
                  <a href="#" className="text-xs text-red-500 hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="flashlearn-login-password"
                    autoComplete="off"
                    required
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
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
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
              >
                {loading ? 'Signing in...' : 'Sign In to FlashLearn'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{' '}
              <button
                onClick={() => setAuthModalView('register')}
                className="text-gray-900 font-medium hover:underline"
              >
                Register free
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create your account</h2>
            <form onSubmit={handleRegister} autoComplete="off" className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">FULL NAME</label>
                <input
                  type="text"
                  name="flashlearn-register-name"
                  autoComplete="off"
                  required
                  placeholder="Jareel Ireri"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">EMAIL</label>
                <input
                  type="email"
                  name="flashlearn-register-email"
                  autoComplete="off"
                  required
                  placeholder="you@example.com"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">PASSWORD</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="flashlearn-register-password"
                    autoComplete="off"
                    required
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
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
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account?{' '}
              <button
                onClick={() => setAuthModalView('login')}
                className="text-gray-900 font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default AuthModal