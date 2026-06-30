import { useNavigate } from 'react-router-dom'

function Avatar({ user, size = 36 }) {
  const navigate = useNavigate()
  const initial = user?.name?.[0]?.toUpperCase() || 'U'

  return (
    <button
      onClick={() => navigate('/profile')}
      title="Profile"
      style={{ width: size, height: size }}
      className="rounded-full overflow-hidden shrink-0 bg-red-500 text-white flex items-center justify-center font-bold text-sm hover:opacity-90 transition"
    >
      {user?.profile_picture_url ? (
        <img
          src={user.profile_picture_url}
          alt={user?.name || 'Profile'}
          className="w-full h-full object-cover"
        />
      ) : (
        initial
      )}
    </button>
  )
}

export default Avatar