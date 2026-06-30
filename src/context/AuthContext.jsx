import { createContext, useState, useEffect } from 'react'
import client from '../api/client'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    const storedUser = localStorage.getItem('user')

    if (token && storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  async function login(email, password) {
    const response = await client.post('/auth/login', { email, password })
    const { access_token, user: userData } = response.data

    localStorage.setItem('access_token', access_token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)

    return userData
  }

  async function register(name, email, password) {
    const response = await client.post('/auth/register', { name, email, password })
    return response.data
  }

  function logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    setUser(null)
  }

  function updateUser(updates) {
    setUser((prev) => {
      const updated = { ...prev, ...updates }
      localStorage.setItem('user', JSON.stringify(updated))
      return updated
    })
  }

  const value = { user, loading, login, register, logout, updateUser }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}