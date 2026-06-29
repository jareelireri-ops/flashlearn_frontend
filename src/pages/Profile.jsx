import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { getProfile, updateProfile } from '../api/client'
import Navbar from '../components/ReusableComponents/Navbar'
import Breadcrumbs from '../components/ReusableComponents/Breadcrumbs'

function Profile() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profilePictureUrl, setProfilePictureUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    getProfile()
      .then((data) => {
        setName(data.name || '')
        setEmail(data.email || '')
        setProfilePictureUrl(data.profile_picture_url || '')
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false))
  }, [user])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      await updateProfile({
        name: name.trim(),
        profile_picture_url: profilePictureUrl.trim() || null,
      })
      const stored = JSON.parse(localStorage.getItem('user') || '{}')
      const updated = { ...stored, name: name.trim() }
      localStorage.setItem('user', JSON.stringify(updated))
      setMessage('Profile updated successfully.')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Breadcrumbs items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Profile' }]} />

        <h1 className="text-2xl font-bold text-slate-900 mt-4 mb-6">Profile Settings</h1>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading profile...</div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            {message && (
              <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                {message}
              </div>
            )}
            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">FULL NAME</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">EMAIL</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">PROFILE PICTURE URL</label>
              <input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={profilePictureUrl}
                onChange={(e) => setProfilePictureUrl(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Profile