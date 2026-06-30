import { useEffect, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Users, Flag, ShieldAlert, Home, LogOut } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import {
  getAllUsers,
  updateUserStatus,
  getAdminReports,
  resolveReport,
  adminDeleteContent,
} from '../api/client'
import UserManagementTable from '../components/Admin/UserManagementTable'
import ReportsTable from '../components/Admin/ReportsTable'

function Admin() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'admin') return
    setLoading(true)
    Promise.all([
      getAllUsers().catch(() => []),
      getAdminReports().catch(() => []),
    ])
      .then(([usersData, reportsData]) => {
        setUsers(usersData)
        setReports(reportsData)
      })
      .finally(() => setLoading(false))
  }, [user])

  async function handleToggleStatus(userId, isActive) {
    try {
      await updateUserStatus(userId, isActive)
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, is_active: isActive } : u)))
    } catch (err) {
      console.error('Failed to update user status', err)
    }
  }

  async function handleResolve(reportId, status) {
    try {
      await resolveReport(reportId, status)
      setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status } : r)))
    } catch (err) {
      console.error('Failed to resolve report', err)
    }
  }

  async function handleRemoveContent(report) {
    try {
      await adminDeleteContent({ deckId: report.deck_id, flashcardId: report.flashcard_id })
      await resolveReport(report.id, 'resolved')
      setReports((prev) => prev.map((r) => (r.id === report.id ? { ...r, status: 'resolved' } : r)))
    } catch (err) {
      console.error('Failed to remove content', err)
    }
  }

  function handleSignOut() {
    logout()
    navigate('/')
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert size={32} className="text-orange-500 mx-auto mb-3" />
          <p className="text-zinc-400 font-mono text-sm">Admin access required.</p>
        </div>
      </div>
    )
  }

  const pendingReports = reports.filter((r) => r.status === 'pending').length
  const suspendedUsers = users.filter((u) => !u.is_active).length

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <div className="border-b border-zinc-800 px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-zinc-950 font-bold text-sm">
              FL
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Admin Console</h1>
              <p className="text-xs text-zinc-500 font-mono">Platform moderation &amp; user management</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-500">{user.name}</span>
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg hover:bg-orange-500/10 hover:border-orange-500/40 hover:text-orange-400 transition"
            >
              <Home size={14} /> Back to App
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg hover:bg-orange-500/10 hover:border-orange-500/40 hover:text-orange-400 transition"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="text-2xl font-bold text-zinc-100">{users.length}</div>
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mt-1">Total Users</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="text-2xl font-bold text-orange-400">{pendingReports}</div>
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mt-1">Pending Reports</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="text-2xl font-bold text-zinc-100">{suspendedUsers}</div>
            <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mt-1">Suspended Users</div>
          </div>
        </div>

        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1 w-fit mb-6">
          <button
            onClick={() => setTab('users')}
            className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold transition ${
              tab === 'users' ? 'bg-orange-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Users size={14} /> Users
          </button>
          <button
            onClick={() => setTab('reports')}
            className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold transition ${
              tab === 'reports' ? 'bg-orange-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Flag size={14} /> Reports
            {pendingReports > 0 && (
              <span className="bg-zinc-950/30 text-xs font-bold px-1.5 rounded-full">{pendingReports}</span>
            )}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-zinc-500 font-mono text-sm">Loading admin data...</div>
        ) : tab === 'users' ? (
          <UserManagementTable users={users} onToggleStatus={handleToggleStatus} />
        ) : (
          <ReportsTable reports={reports} onResolve={handleResolve} onRemoveContent={handleRemoveContent} />
        )}
      </div>
    </div>
  )
}

export default Admin