import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { getProfile, updateProfile } from '../api/client'
import Navbar from '../components/ReusableComponents/Navbar'
import Breadcrumbs from '../components/ReusableComponents/Breadcrumbs'
import MechLoader from '../components/ReusableComponents/MechLoader'

function Profile() {
  const { user, updateUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
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
        setProfilePicture(data.profile_picture_url || '')
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false))
  }, [user])

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }

    // Keep it reasonable in size for a text colum data type in our backend
    const MAX_BYTES = 2 * 1024 * 1024 // 2MB
    if (file.size > MAX_BYTES) {
      setError('Image is too large. Please choose a file under 2MB.')
      return
    }

    setError(null)
    const reader = new FileReader()
    reader.onload = () => setProfilePicture(reader.result)
    reader.onerror = () => setError('Failed to read image file.')
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)
    setError(null)
    try {
      const trimmedName = name.trim()
      await updateProfile({
        name: trimmedName,
        profile_picture_url: profilePicture || null,
      })
      updateUser({ name: trimmedName, profile_picture_url: profilePicture || null })
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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center justify-center">
            <MechLoader />
          </div>
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
              <label className="block text-xs font-semibold text-slate-500 mb-1">PROFILE PICTURE</label>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-slate-400 text-xs">No image</span>
                  )}
                </div>

                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-600 hover:file:bg-red-100 cursor-pointer"
                  />
                  <p className="text-xs text-slate-400 mt-1">PNG or JPG, up to 2MB.</p>
                </div>
              </div>
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