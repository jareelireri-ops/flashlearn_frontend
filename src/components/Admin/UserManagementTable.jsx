import { useState } from 'react'
import { ShieldOff, ShieldCheck, ShieldAlert } from 'lucide-react'

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function UserManagementTable({ users, onToggleStatus }) {
  const [pendingId, setPendingId] = useState(null)

  async function handleToggle(user) {
    if (user.role === 'admin') return
    setPendingId(user.id)
    await onToggleStatus(user.id, !user.is_active)
    setPendingId(null)
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-500 font-mono text-sm">No users found.</div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-zinc-900 text-zinc-400 text-left font-mono text-xs uppercase tracking-wider">
            <th className="px-5 py-3 font-medium">User</th>
            <th className="px-5 py-3 font-medium">Role</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Joined</th>
            <th className="px-5 py-3 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {users.map((user) => (
            <tr key={user.id} className="bg-zinc-950 hover:bg-zinc-900/60 transition">
              <td className="px-5 py-4">
                <div className="font-semibold text-zinc-100">{user.name || 'Unnamed'}</div>
                <div className="text-zinc-500 font-mono text-xs">{user.email}</div>
              </td>
              <td className="px-5 py-4">
                <span
                  className={`text-xs font-mono font-bold px-2 py-1 rounded-md ${
                    user.role === 'admin' ? 'bg-orange-500/10 text-orange-400' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-5 py-4">
                <span
                  className={`flex items-center gap-1.5 text-xs font-semibold ${
                    user.is_active ? 'text-emerald-400' : 'text-zinc-500'
                  }`}
                >
                  {user.is_active ? <ShieldCheck size={14} /> : <ShieldOff size={14} />}
                  {user.is_active ? 'Active' : 'Suspended'}
                </span>
              </td>
              <td className="px-5 py-4 text-zinc-500 font-mono text-xs">{formatDate(user.created_at)}</td>
              <td className="px-5 py-4 text-right">
                {user.role === 'admin' ? (
                  <span className="text-xs text-zinc-600 font-mono flex items-center gap-1 justify-end" title="Admins cannot be suspended">
                    <ShieldAlert size={12} /> Protected
                  </span>
                ) : (
                  <button
                    onClick={() => handleToggle(user)}
                    disabled={pendingId === user.id}
                    className={`text-xs font-bold px-3 py-1.5 rounded-md transition disabled:opacity-50 ${
                      user.is_active
                        ? 'bg-zinc-800 text-zinc-300 hover:bg-orange-500/20 hover:text-orange-400'
                        : 'bg-orange-500 text-zinc-950 hover:bg-orange-400'
                    }`}
                  >
                    {pendingId === user.id ? '...' : user.is_active ? 'Suspend' : 'Reactivate'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserManagementTable