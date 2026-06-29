import { useEffect, useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { BookOpen, LayoutDashboard, PlusCircle, LogOut, Bell, Play, Settings } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { NotificationContext } from '../context/NotificationContext'
import { getDashboardStats, getMyCollection, getCompletionStats, getDailyAnalytics, checkDueCards } from '../api/client'
import DashboardBanner from '../components/Dashboard/DashboardBanner'
import MarqueeStrip from '../components/Dashboard/MarqueeStrip'
import StatGrid from '../components/Dashboard/StatGrid'
import ContinueStudying from '../components/Dashboard/ContinueStudying'
import ReviewSchedule from '../components/Dashboard/ReviewSchedule'
import CategoryBreakdown from '../components/Dashboard/CategoryBreakdown'
import WeeklyActivity from '../components/Dashboard/WeeklyActivity'
import NotificationBadge from '../components/ReusableComponents/NotificationBadge'


function Dashboard() {
  const { user, logout } = useContext(AuthContext)
  const { unreadCount, refreshUnreadCount } = useContext(NotificationContext)
  const navigate = useNavigate()

  const [stats, setStats] = useState(null)
  const [collection, setCollection] = useState([])
  const [completion, setCompletion] = useState([])
  const [dailyActivity, setDailyActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    setLoading(true)

    Promise.all([
      getDashboardStats().catch(() => null),
      getMyCollection().catch(() => []),
      getCompletionStats().catch(() => []),
      getDailyAnalytics().catch(() => []),
    ])
      .then(([dashboardData, collectionData, completionData, dailyData]) => {
        if (dashboardData) setStats(dashboardData)
        setCollection(collectionData)
        setCompletion(completionData)
        setDailyActivity(dailyData)
      })
      .finally(() => setLoading(false))
  }, [user])

  useEffect(() => {
    if (!user) return
    checkDueCards()
      .then(() => refreshUnreadCount())
      .catch(() => {})
  }, [user])

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">

      <div className="w-64 bg-slate-950 text-slate-400 flex flex-col h-full shrink-0 border-r border-slate-900 z-10">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-10 transition hover:opacity-80">
            <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">FL</div>
            <span className="font-bold text-white tracking-tight text-lg">FlashLearn</span>
          </Link>

          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 px-4">Main</p>
          <nav className="space-y-1 mb-6">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 font-medium transition text-sm">
              <LayoutDashboard size={17} /> Dashboard
            </button>
            <button
              onClick={() => navigate('/library', { state: { tab: 'collection' } })}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-900 hover:text-white transition font-medium text-sm"
            >
              <BookOpen size={17} /> My Collection
            </button>
            <button
              onClick={() => navigate('/decks/manage')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-900 hover:text-white transition font-medium text-sm"
            >
              <PlusCircle size={17} /> Create Deck
            </button>
          </nav>

          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 px-4">Account</p>
          <nav className="space-y-1">
            <button
              onClick={() => navigate('/notifications')}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-slate-900 hover:text-white transition font-medium text-sm"
            >
              <span className="flex items-center gap-3">
                <Bell size={17} /> Notifications
              </span>
              <NotificationBadge count={unreadCount} />
            </button>
          
          </nav>
        </div>

        <div className="mt-auto p-6">
          <div className="flex items-center gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white truncate">{user?.name}</div>
              <div className="text-xs text-slate-500 truncate">Learner</div>
            </div>
            <button onClick={logout} className="text-slate-500 hover:text-red-400 transition shrink-0" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto h-full bg-slate-50">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
          <h1 className="text-lg font-bold text-slate-900">Dashboard</h1>
          <button
            onClick={() => navigate('/library', { state: { tab: 'collection' } })}
            className="px-4 py-2 border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-50 transition flex items-center gap-2"
          >
            <Play size={13} fill="currentColor" /> Review now
          </button>
        </div>

        {/* Marquee strip */}
        <MarqueeStrip />

        <div className="p-8 max-w-6xl mx-auto space-y-8">

          <DashboardBanner
            user={user}
            streak={stats?.study_streak || 0}
            cardsDue={stats?.cards_due_today || 0}
          />

          {loading ? (
            <div className="text-center py-20 text-slate-400">Loading your data...</div>
          ) : (
            <>
              <StatGrid
                streak={stats?.study_streak || 0}
                cardsDue={stats?.cards_due_today || 0}
                totalReviews={stats?.total_cards_reviewed || 0}
                totalSessions={stats?.total_sessions || 0}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <ContinueStudying completionStats={completion} />
                  <WeeklyActivity dailyActivity={dailyActivity} />
                </div>

                <div className="space-y-6">
                  <ReviewSchedule cardsDue={stats?.cards_due_today || 0} />
                  <CategoryBreakdown collection={collection} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard