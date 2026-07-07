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
  getAdminStats,
} from '../api/client'
import UserManagementTable from '../components/Admin/UserManagementTable'
import ReportsTable from '../components/Admin/ReportsTable'

function AdminLoader() {
  return (
    <>
      <style>{`
        .admin-loader {
          --s: 25px;
          --g: 5px;
          width: calc(2*(1.353*var(--s) + var(--g)));
          aspect-ratio: 1;
          background:
            linear-gradient(#f97316 0 0) left/50% 100% no-repeat,
            conic-gradient(from -90deg at var(--s) calc(0.353*var(--s)),
              #f4f4f5 135deg,#3f3f46 0 270deg,#71717a 0);
          background-blend-mode: multiply;
          --_m:
            linear-gradient(to bottom right,
               #0000 calc(0.25*var(--s)),#000 0 calc(100% - calc(0.25*var(--s)) - 1.414*var(--g)),#0000 0),
            conic-gradient(from -90deg at right var(--g) bottom var(--g),#000 90deg,#0000 0);
          -webkit-mask: var(--_m);
                  mask: var(--_m);
          background-size:   50% 50%;
          -webkit-mask-size: 50% 50%;
                  mask-size: 50% 50%;
          -webkit-mask-composite: source-in;
                  mask-composite: intersect;
          animation: admin-l9 1.5s infinite;
        }
        @keyframes admin-l9 {
          0%,12.5%    {background-position:0% 0%,0 0}
          12.6%,37.5% {background-position:100% 0%,0 0}
          37.6%,62.5% {background-position:100% 100%,0 0}
          62.6%,87.5% {background-position:0% 100%,0 0}
          87.6%,100%  {background-position:0% 0%,0 0}
        }
      `}</style>
      <div className="flex justify-center py-20">
        <div className="admin-loader" />
      </div>
    </>
  )
}

function Admin() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState([])
  const [reports, setReports] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user || user.role !== 'admin') return
    setLoading(true)
    Promise.all([
      getAllUsers().catch(() => []),
      getAdminReports().catch(() => []),
      getAdminStats().catch(() => null),
    ])
      .then(([usersData, reportsData, statsData]) => {
        setUsers(usersData)
        setReports(reportsData)
        setStats(statsData)
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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
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
      <div className="border-b border-zinc-800 px-4 sm:px-8 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-zinc-950 font-bold text-sm shrink-0">
              FL
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight truncate">Admin Console</h1>
              <p className="text-xs text-zinc-500 font-mono truncate">Platform moderation &amp; user management</p>
            </div>
          </Link>

          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
            <span className="text-xs font-mono text-zinc-500 truncate max-w-[120px] sm:max-w-none">{user.name}</span>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/"
                className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 px-2.5 sm:px-3 py-2 rounded-lg hover:bg-orange-500/10 hover:border-orange-500/40 hover:text-orange-400 transition"
              >
                <Home size={14} /> <span className="hidden sm:inline">Back to App</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 px-2.5 sm:px-3 py-2 rounded-lg hover:bg-orange-500/10 hover:border-orange-500/40 hover:text-orange-400 transition"
              >
                <LogOut size={14} /> <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
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

        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="text-2xl font-bold text-zinc-100">{stats.total_decks}</div>
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mt-1">Total Decks</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="text-2xl font-bold text-zinc-100">{stats.total_flashcards}</div>
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mt-1">Total Flashcards</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="text-2xl font-bold text-orange-400">{stats.sessions_7d}</div>
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mt-1">Sessions (This week)</div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="text-2xl font-bold text-orange-400">{stats.active_users_7d}</div>
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mt-1">Active Users (This week)</div>
            </div>
          </div>
        )}

        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-1 w-full sm:w-fit mb-6 overflow-x-auto">
          <button
            onClick={() => setTab('users')}
            className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-md text-sm font-semibold transition whitespace-nowrap flex-1 sm:flex-none ${
              tab === 'users' ? 'bg-orange-500 text-zinc-950' : 'text-zinc-400 hover:text-zinc-100'
            }`}
          >
            <Users size={14} /> Users
          </button>
          <button
            onClick={() => setTab('reports')}
            className={`flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-md text-sm font-semibold transition whitespace-nowrap flex-1 sm:flex-none ${
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
          <AdminLoader />
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