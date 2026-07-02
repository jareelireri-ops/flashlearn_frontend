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
      setUsers(users.map(u => u.id === userId ? { ...u, is_active: isActive } : u))
    } catch (err) {
      console.error('Failed to update status', err)
    }
  }

  async function handleResolveReport(reportId, status) {
    try {
      await resolveReport(reportId, status)
      setReports(reports.map(r => r.id === reportId ? { ...r, status } : r))
    } catch (err) {
      console.error('Failed to resolve report', err)
    }
  }

  const pendingReports = reports.filter(r => r.status === 'pending').length

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6">
        <ShieldAlert size={48} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-zinc-400 mb-6">You don't have permission to view this page.</p>
        <Link to="/" className="text-orange-500 hover:text-orange-400 underline">Return Home</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-orange-500/30">
      <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <ShieldAlert size={18} className="text-zinc-950" />
            </div>
            <span className="font-bold text-white tracking-wide">ADMIN PORTAL</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm text-zinc-400 hover:text-white transition flex items-center gap-1.5">
              <Home size={16} /> Exit to App
            </Link>
          </div>
        </div>
      </nav>

      {/* --- Adjusted Padding Here --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">System Overview</h1>
          <p className="text-zinc-400">Manage users, content, and review reports.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
            <div className="text-zinc-500 text-sm font-medium mb-1">Total Users</div>
            <div className="text-3xl font-bold text-white">{users.length}</div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
            <div className="text-zinc-500 text-sm font-medium mb-1">Pending Reports</div>
            <div className="text-3xl font-bold text-white flex items-center gap-2">
              {pendingReports}
              {pendingReports > 0 && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>}
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
            <div className="text-zinc-500 text-sm font-medium mb-1">Suspended Accounts</div>
            <div className="text-3xl font-bold text-white">{users.filter(u => !u.is_active).length}</div>
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
        ) : (
          <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden">
            {tab === 'users' && <UserManagementTable users={users} onToggleStatus={handleToggleStatus} />}
            {tab === 'reports' && <ReportsTable reports={reports} onResolve={handleResolveReport} />}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin