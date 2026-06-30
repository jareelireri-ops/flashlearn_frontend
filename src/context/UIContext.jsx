import { createContext, useState } from 'react'

export const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalView, setAuthModalView] = useState('login') // 'login' | 'register'
  const [authModalOptions, setAuthModalOptions] = useState({})

  const [adminModalOpen, setAdminModalOpen] = useState(false)

  const [accessDeniedMessage, setAccessDeniedMessage] = useState(null)

  function openAuthModal(view = 'login', options = {}) {
    setAuthModalView(view)
    setAuthModalOptions(options)
    setAuthModalOpen(true)
  }

  function closeAuthModal() {
    setAuthModalOpen(false)
    setAuthModalOptions({})
  }

  function openAdminModal() {
    setAdminModalOpen(true)
  }

  function closeAdminModal() {
    setAdminModalOpen(false)
  }

  function showAccessDenied(message) {
    setAccessDeniedMessage(message)
    setTimeout(() => setAccessDeniedMessage(null), 3500)
  }

  const value = {
    authModalOpen,
    authModalView,
    authModalOptions,
    setAuthModalView,
    openAuthModal,
    closeAuthModal,
    adminModalOpen,
    openAdminModal,
    closeAdminModal,
    accessDeniedMessage,
    setAccessDeniedMessage,
    showAccessDenied,
  }

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}