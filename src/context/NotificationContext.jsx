import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { AuthContext } from './AuthContext'
import { getUnreadNotificationCount } from '../api/client'

export const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const { user } = useContext(AuthContext)
  const [unreadCount, setUnreadCount] = useState(0)

  const refreshUnreadCount = useCallback(() => {
    if (!user) {
      setUnreadCount(0)
      return
    }
    getUnreadNotificationCount()
      .then((data) => setUnreadCount(data.unread_count || 0))
      .catch(() => {})
  }, [user])

  useEffect(() => {
    refreshUnreadCount()
  }, [refreshUnreadCount])

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  )
}