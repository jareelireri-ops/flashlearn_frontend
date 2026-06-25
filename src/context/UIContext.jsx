import { createContext, useState } from 'react'

export const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalView, setAuthModalView] = useState('login') // 'login' | 'register'

  function openAuthModal(view = 'login') {
    setAuthModalView(view)
    setAuthModalOpen(true)
  }

  function closeAuthModal() {
    setAuthModalOpen(false)
  }

  const value = {
    authModalOpen,
    authModalView,
    setAuthModalView,
    openAuthModal,
    closeAuthModal,
  }

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}