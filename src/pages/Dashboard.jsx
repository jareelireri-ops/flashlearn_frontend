import { useEffect, useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { BookOpen, LayoutDashboard, PlusCircle, LogOut, Bell, Play, Settings } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { NotificationContext } from '../context/NotificationContext'
import { getDashboardStats, getMyCollection, getCompletionStats, getDailyAnalytics, getTopDecks, checkDueCards, listSessions } from '../api/client'
import DashboardBanner from '../components/Dashboard/DashboardBanner'
import MarqueeStrip from '../components/Dashboard/MarqueeStrip'
import StatGrid from '../components/Dashboard/StatGrid'
import ContinueStudying from '../components/Dashboard/ContinueStudying'
import ReviewSchedule from '../components/Dashboard/ReviewSchedule'
import CategoryBreakdown from '../components/Dashboard/CategoryBreakdown'
import WeeklyActivity from '../components/Dashboard/WeeklyActivity'
import TopDecks from '../components/Dashboard/TopDecks'
import NotificationBadge from '../components/ReusableComponents/NotificationBadge'
import DashboardSkeleton from '../components/Dashboard/DashboardSkeleton'
import Avatar from '../components/ReusableComponents/Avatar'

function Dashboard() {
  const { user, logout } = useContext(AuthContext)
  const { unreadCount, refreshUnreadCount } = useContext(NotificationContext)
  const navigate = useNavigate()

  const [stats, setStats] = useState(null)
  const [collection, setCollection] = useState([])
  const [completion, setCompletion] = useState([])
  const [dailyActivity, setDailyActivity] = useState([])
  const [topDecks, setTopDecks] = useState([])
  const [activeSessions, setActiveSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      setLoading(true)
      try {
        await checkDueCards().catch(() => {})
        refreshUnreadCount()

        const [sData, colData, compData, dailyData, tdData, sessionsData] = await Promise.all([
          getDashboardStats().catch(() => null),
          getMyCollection().catch(() => []),
          getCompletionStats().catch(() => []),
          getDailyAnalytics(7).catch(() => []),
          getTopDecks().catch(() => []),
          listSessions('paused').catch(() => [])
        ])

        setStats(sData)
        setCollection(colData)
        setCompletion(compData)
        setDailyActivity(dailyData)
        setTopDecks(tdData)
        
        // Only show up to 3 paused sessions
        setActiveSessions((sessionsData || []).slice(0, 3))
      } catch (err) {
        console.error('Error loading dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, refreshUnreadCount])

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Red Navbar */}
      <nav className="bg-red-500 border-b border-red-600 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <span className="font-bebas text-red-500 text-xl tracking-wider leading-none mt-1">S</span>
            </div>
            <span className="font-bebas tracking-wide text-2xl mt-1">SAKANYA</span>
          </Link>

          <div className="flex items-center gap-3 md:gap-5">
            <Link to="/notifications" className="relative p-2 text-red-100 hover:text-white hover:bg-red-600 rounded-full transition">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-400 rounded-full border border-red-500"></span>
              )}
            </Link>

            {user.role === 'admin' && (
              <Link to="/admin" className="hidden md:flex p-2 text-red-100 hover:text-white hover:bg-red-600 rounded-full transition">
                <Settings size={20} />
              </Link>
            )}

            <div className="h-6 w-px bg-red-400 mx-1 hidden md:block"></div>

            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-90 transition">
                <Avatar url={user.profile_picture_url} name={user.name} size="sm" />
                <span className="text-sm font-medium text-white hidden md:block">{user.name?.split(' ')[0]}</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col">
        {/* Sub-nav */}
        <div className="bg-white border-b border-slate-200 px-4 h-14 flex items-center justify-center gap-4 overflow-x-auto hide-scrollbar">
          <Link to="/dashboard" className="px-4 py-1.5 bg-slate-100 text-slate-800 text-sm font-medium rounded-full flex items-center gap-2 whitespace-nowrap">
            <LayoutDashboard size={15} /> Overview
          </Link>
          <Link to="/library" className="px-4 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-sm font-medium rounded-full transition flex items-center gap-2 whitespace-nowrap">
            <BookOpen size={15} /> Library
          </Link>
          <Link to="/builder" className="px-4 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-sm font-medium rounded-full transition flex items-center gap-2 whitespace-nowrap">
            <PlusCircle size={15} /> Create
          </Link>
          
          <div className="h-4 w-px bg-slate-200 mx-2"></div>
          
          <button 
            onClick={() => navigate('/library?tab=collection')}
            className="px-4 py-1.5 border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-50 transition flex items-center gap-2"
          >
            <Play size={13} fill="currentColor" /> Review now
          </button>
        </div>

        <MarqueeStrip />

        {/* --- Adjusted Padding Here --- */}
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8 w-full">

          <DashboardBanner
            user={user}
            streak={stats?.study_streak || 0}
            cardsDue={stats?.cards_due_today || 0}
          />

          {loading ? (
            <DashboardSkeleton />
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
                  <ContinueStudying activeSessions={activeSessions} />
                  <WeeklyActivity dailyActivity={dailyActivity} />
                </div>

                <div className="space-y-6">
                  <ReviewSchedule cardsDue={stats?.cards_due_today || 0} />
                  <TopDecks topDecks={topDecks} />
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