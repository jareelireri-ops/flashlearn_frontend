import { useEffect, useState, useContext } from 'react'
import { Bell, Check, Trash2, BookOpen, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { NotificationContext } from '../context/NotificationContext'
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from '../api/client'
import Navbar from '../components/ReusableComponents/Navbar'
import Breadcrumbs from '../components/ReusableComponents/Breadcrumbs'

function timeAgo(isoString) {
  const seconds = Math.floor((Date.now() - new Date(isoString)) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function Notifications() {
  const navigate = useNavigate()
  const { refreshUnreadCount } = useContext(NotificationContext)

  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchNotifications = (unreadOnly) => {
    setLoading(true)
    listNotifications(unreadOnly)
      .then(setNotifications)
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchNotifications(filter === 'unread')
  }, [filter])

  async function handleMarkRead(notification) {
    if (notification.is_read) return
    try {
      await markNotificationRead(notification.id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
      )
      refreshUnreadCount()
    } catch (err) {
      console.error('Failed to mark notification as read', err)
    }
  }

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      refreshUnreadCount()
    } catch (err) {
      console.error('Failed to mark all as read', err)
    }
  }

  async function handleDelete(notificationId) {
    try {
      await deleteNotification(notificationId)
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      refreshUnreadCount()
    } catch (err) {
      console.error('Failed to delete notification', err)
    }
  }

  function handleNotificationClick(notification) {
    handleMarkRead(notification)
    if (notification.related_deck_id) {
      if (notification.notification_type === 'review_due') {
        navigate(`/study/${notification.related_deck_id}`)
      } else {
        navigate('/library', { state: { tab: 'collection' } })
      }
    }
  }

  const hasUnread = notifications.some((n) => !n.is_read)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-8">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Dashboard', path: '/dashboard' }, { label: 'Notifications' }]} />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          {hasUnread && (
            <button
              onClick={handleMarkAllRead}
              className="text-sm font-semibold text-red-500 hover:text-red-600 transition flex items-center gap-1"
            >
              <Check size={14} /> Mark all as read
            </button>
          )}
        </div>

        <div className="flex bg-white border border-slate-200 rounded-lg p-1 w-fit mb-6 shadow-sm">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2 rounded-md text-sm font-medium transition ${filter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-5 py-2 rounded-md text-sm font-medium transition ${filter === 'unread' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Unread
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <Bell size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">
              {filter === 'unread' ? "You're all caught up." : 'No notifications yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`group flex items-start gap-4 p-4 rounded-2xl border shadow-sm cursor-pointer transition ${
                  notification.is_read
                    ? 'bg-white border-slate-200'
                    : 'bg-red-50 border-red-100 hover:bg-red-100/60'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notification.is_read ? 'bg-slate-50 text-slate-400' : 'bg-red-500/10 text-red-500'}`}>
                  {notification.notification_type === 'review_due' ? <Clock size={18} /> : <BookOpen size={18} />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${notification.is_read ? 'text-slate-600' : 'text-slate-900 font-medium'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{timeAgo(notification.created_at)}</p>
                </div>

                {!notification.is_read && (
                  <span className="w-2 h-2 rounded-full bg-red-500 mt-2 shrink-0" />
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(notification.id)
                  }}
                  className="text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100 shrink-0"
                  title="Delete notification"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications