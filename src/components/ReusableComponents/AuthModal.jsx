import { useState, useContext, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { X, Eye, EyeOff, Check } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { UIContext } from '../../context/UIContext'
import { forgotPassword, getAuthRequirements } from '../../api/client'

// fallback in case /auth/requirements can't be reached — kept at least as
// strict as the backend default so we never validate weaker than the server
const DEFAULT_REQUIREMENTS = {
  password: { min_length: 8, max_length: 128, requires_letter: true, requires_lowercase: true, requires_number: true, requires_symbol: true },
  name: { min_length: 2, max_length: 100 },
  email: { max_length: 254 },
}

// one row in the password checklist — greys out until met, then ticks green
function RequirementItem({ met, label }) {
  return (
    <li className={`flex items-center gap-1.5 text-xs transition-colors ${met ? 'text-emerald-600' : 'text-gray-400'}`}>
      <span className={`flex items-center justify-center w-3.5 h-3.5 rounded-full border shrink-0 ${met ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}>
        {met && <Check size={9} className="text-white" strokeWidth={3} />}
      </span>
      {label}
    </li>
  )
}

// live count shown under an input — turns red once the value is outside min/max
function CharCounter({ length, min, max, showError }) {
  const tooShort = min != null && length < min
  const tooLong = length > max
  return (
    <p className={`text-xs mt-1 text-right ${showError ? 'text-red-500' : 'text-gray-400'}`}>
      {length}/{max}
      {showError && tooShort && ` — needs at least ${min}`}
      {showError && tooLong && ` — over the limit`}
    </p>
  )
}

function AuthModal() {
  const { login, register, logout } = useContext(AuthContext)
  const { authModalOpen, authModalView, authModalOptions, setAuthModalView, closeAuthModal } = useContext(UIContext)
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState(null)
  const [forgotSuccess, setForgotSuccess] = useState(null)
  const [resetToken, setResetToken] = useState(null)
  const [requirements, setRequirements] = useState(DEFAULT_REQUIREMENTS)

  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [forgotEmail, setForgotEmail] = useState('')

  // shows a field's red "invalid" state only once the user leaves it with
  // bad input — cleared again the moment they click back in to fix it, so
  // no field ever highlights red while it's actively being typed into
  const [loginEmailShowError, setLoginEmailShowError] = useState(false)
  const [registerEmailShowError, setRegisterEmailShowError] = useState(false)
  const [forgotEmailShowError, setForgotEmailShowError] = useState(false)
  const [registerNameShowError, setRegisterNameShowError] = useState(false)
  const [registerPasswordShowError, setRegisterPasswordShowError] = useState(false)
  const [registerConfirmShowError, setRegisterConfirmShowError] = useState(false)

  // pull the live password rules from the backend once, on mount, so this
  // form never drifts out of sync with what the server actually enforces.
  // merged with defaults per-section so an old/partial server response
  // (e.g. missing the newer "name" block) can't leave a field undefined
  useEffect(() => {
    getAuthRequirements()
      .then((data) => setRequirements({
        password: { ...DEFAULT_REQUIREMENTS.password, ...data.password },
        name: { ...DEFAULT_REQUIREMENTS.name, ...data.name },
        email: { ...DEFAULT_REQUIREMENTS.email, ...data.email },
      }))
      .catch(() => setRequirements(DEFAULT_REQUIREMENTS))
  }, [])

  useEffect(() => {
    setServerError(null)
    setForgotSuccess(null)
    setResetToken(null)
    setLoginEmailShowError(false)
    setRegisterEmailShowError(false)
    setForgotEmailShowError(false)
    setRegisterNameShowError(false)
    setRegisterPasswordShowError(false)
    setRegisterConfirmShowError(false)
  }, [authModalView])

  if (!authModalOpen) return null

  const isNameInvalid = registerData.name.length > 0 && (registerData.name.trim().length < requirements.name.min_length || registerData.name.length > requirements.name.max_length)
  const isEmailInvalid = (email) => email.length > 0 && (!email.includes('@') || !email.includes('.') || email.length > requirements.email.max_length)

  // individual pass/fail checks, reused both for the checklist ticks and
  // for the overall validity boolean below
  function getPasswordChecks(password) {
    const { min_length, max_length, requires_letter, requires_lowercase, requires_number, requires_symbol } = requirements.password
    return {
      length: password.length >= min_length && password.length <= max_length,
      letter: !requires_letter || /[A-Z]/.test(password),
      lowercase: !requires_lowercase || /[a-z]/.test(password),
      number: !requires_number || /[0-9]/.test(password),
      symbol: !requires_symbol || /[^A-Za-z0-9]/.test(password),
    }
  }

  function isPasswordInvalid(password) {
    const checks = getPasswordChecks(password)
    return password.length === 0 || Object.values(checks).some((met) => !met)
  }

  const isConfirmInvalid = registerData.confirmPassword.length > 0 && registerData.confirmPassword !== registerData.password
  const passwordChecks = getPasswordChecks(registerData.password)

  async function handleLogin(e) {
    e.preventDefault()
    if (isEmailInvalid(loginData.email) || loginData.password.length === 0) return

    setServerError(null)
    setLoading(true)
    try {
      const loggedInUser = await login(loginData.email, loginData.password)

      // Admin accounts must sign in exclusively through the Admin Portal.
      // If valid admin credentials are entered here, reject and sign them back out.

      if (loggedInUser?.role === 'admin') {
        await logout()
        setServerError('Admin accounts must sign in through the Admin Portal.')
        return
      }

      closeAuthModal()
    } catch (err) {
      setServerError(err.response?.data?.error || 'Failed to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    if (isNameInvalid || isEmailInvalid(registerData.email) || isPasswordInvalid(registerData.password) || isConfirmInvalid) return

    setServerError(null)
    setLoading(true)
    try {
      await register(registerData.name, registerData.email, registerData.password)
      setLoginData({ email: registerData.email, password: registerData.password })
      setAuthModalView('login')
    } catch (err) {
      setServerError(err.response?.data?.error || 'Failed to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

    // Using a fake link generator for  for the time being as its in development
  async function handleForgotPassword(e) {
    e.preventDefault()
    if (isEmailInvalid(forgotEmail)) return

    setServerError(null)
    setForgotSuccess(null)
    setResetToken(null)
    setLoading(true)
    try {
      const data = await forgotPassword(forgotEmail)
      setForgotSuccess(data.message || 'If that email exists, a reset link has been sent.')
      if (data.reset_token) {
        setResetToken(data.reset_token)
      }
    } catch (err) {
      setServerError(err.response?.data?.error || 'Failed to send reset request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
      onClick={closeAuthModal}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={closeAuthModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-sm font-bold">FL</div>
          <span className="font-semibold text-gray-900">Flash Learn</span>
        </div>

        {authModalView !== 'forgot' && (
          <div className="flex bg-gray-100 rounded-full p-1 mb-6">
            <button onClick={() => setAuthModalView('login')} className={`flex-1 py-2 rounded-full text-sm font-medium transition ${authModalView === 'login' ? 'bg-slate-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}>Sign In</button>
            <button onClick={() => setAuthModalView('register')} className={`flex-1 py-2 rounded-full text-sm font-medium transition ${authModalView === 'register' ? 'bg-slate-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}>Register</button>
          </div>
        )}

        {serverError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {serverError}
          </div>
        )}

        {authModalView === 'login' ? (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome to Flash Learn </h2>
            <form onSubmit={handleLogin} autoComplete="off" noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">EMAIL</label>
                <input
                  type="email" required placeholder="XXXX@XXXX.com" maxLength={requirements.email.max_length}
                  value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  onFocus={() => setLoginEmailShowError(false)}
                  onBlur={() => setLoginEmailShowError(isEmailInvalid(loginData.email))}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${loginEmailShowError ? 'border-red-400 ring-red-400' : 'border-gray-200 focus:ring-gray-300'}`}
                />
                {loginEmailShowError && <p className="text-xs text-red-500 mt-1">Please enter a valid email address with an '@'.</p>}
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-gray-500">PASSWORD</label>
                  <button
                    type="button"
                    onClick={() => setAuthModalView('forgot')}
                    className="text-xs text-red-500 hover:text-red-600 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                    value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60">
                {loading ? 'Signing in...' : 'Sign In to FlashLearn'}
              </button>
            </form>
          </>
        ) : authModalView === 'forgot' ? (
          <>
            <button
              type="button"
              onClick={() => setAuthModalView('login')}
              className="text-xs text-slate-500 hover:text-slate-700 mb-3"
            >
              ← Back to sign in
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Reset your password</h2>
            <p className="text-sm text-gray-500 mb-4">Enter your email and we'll send reset instructions.</p>


          
            {forgotSuccess ? (
              <div className="space-y-3">
                <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                  {forgotSuccess}
                </div>
                {resetToken && (
                  <div className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 space-y-2">
                    <p className="text-slate-600"> Use this link to reset:</p>
                    <Link
                      to={`/reset-password?token=${resetToken}`}
                      onClick={closeAuthModal}
                      className="text-red-500 hover:underline break-all text-xs font-medium"
                    >
                      Reset password now
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} noValidate className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">EMAIL</label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    maxLength={requirements.email.max_length}
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    onFocus={() => setForgotEmailShowError(false)}
                    onBlur={() => setForgotEmailShowError(isEmailInvalid(forgotEmail))}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${forgotEmailShowError ? 'border-red-400 ring-red-400' : 'border-gray-200 focus:ring-gray-300'}`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            )}
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create your Flash Learn account</h2>
            <form onSubmit={handleRegister} autoComplete="off" noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
                <input
                  type="text" required placeholder="Jareel Ireri"
                  value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  onFocus={() => setRegisterNameShowError(false)}
                  onBlur={() => setRegisterNameShowError(isNameInvalid)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${registerNameShowError ? 'border-red-400 ring-red-400' : 'border-gray-200 focus:ring-gray-300'}`}
                />
                {registerNameShowError && <p className="text-xs text-red-500 mt-1">Name must be at least 2 characters.</p>}
                <CharCounter length={registerData.name.length} min={requirements.name.min_length} max={requirements.name.max_length} showError={registerNameShowError} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">EMAIL</label>
                <input
                  type="email" required placeholder="you@example.com" maxLength={requirements.email.max_length}
                  value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  onFocus={() => setRegisterEmailShowError(false)}
                  onBlur={() => setRegisterEmailShowError(isEmailInvalid(registerData.email))}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${registerEmailShowError ? 'border-red-400 ring-red-400' : 'border-gray-200 focus:ring-gray-300'}`}
                />
                {registerEmailShowError && <p className="text-xs text-red-500 mt-1">Please enter a valid email address with an '@'.</p>}
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <label className="block text-xs font-semibold text-gray-500">PASSWORD</label>
                  <span className={`text-xs ${registerPasswordShowError ? 'text-red-500' : 'text-gray-400'}`}>
                    {registerData.password.length}/{requirements.password.max_length}
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                    value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    onFocus={() => setRegisterPasswordShowError(false)}
                    onBlur={() => setRegisterPasswordShowError(registerData.password.length > 0 && isPasswordInvalid(registerData.password))}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${registerPasswordShowError ? 'border-red-400 ring-red-400' : 'border-gray-200 focus:ring-gray-300'}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* pre-listed requirements — always visible, tick green as each is met */}
                <ul className="mt-2 space-y-1">
                  <RequirementItem met={passwordChecks.length} label={`${requirements.password.min_length}-${requirements.password.max_length} characters`} />
                  {requirements.password.requires_letter && (
                    <RequirementItem met={passwordChecks.letter} label="Contains an uppercase letter" />
                  )}
                  {requirements.password.requires_lowercase && (
                    <RequirementItem met={passwordChecks.lowercase} label="Contains a lowercase letter" />
                  )}
                  {requirements.password.requires_number && (
                    <RequirementItem met={passwordChecks.number} label="Contains a number" />
                  )}
                  {requirements.password.requires_symbol && (
                    <RequirementItem met={passwordChecks.symbol} label="Contains a symbol (e.g. ! @ # $)" />
                  )}
                </ul>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">CONFIRM PASSWORD</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'} required placeholder="••••••••"
                    value={registerData.confirmPassword} onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    onFocus={() => setRegisterConfirmShowError(false)}
                    onBlur={() => setRegisterConfirmShowError(isConfirmInvalid)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${registerConfirmShowError ? 'border-red-400 ring-red-400' : 'border-gray-200 focus:ring-gray-300'}`}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <ul className="mt-2 space-y-1">
                  <RequirementItem
                    met={registerData.confirmPassword.length > 0 && !isConfirmInvalid}
                    label="Passwords match"
                  />
                </ul>
              </div>
              <button
                type="submit"
                disabled={loading || isNameInvalid || isEmailInvalid(registerData.email) || isPasswordInvalid(registerData.password) || isConfirmInvalid}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 rounded-lg transition disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default AuthModal