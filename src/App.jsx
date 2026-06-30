import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UIProvider } from './context/UIContext'
import { NotificationProvider } from './context/NotificationContext'
import AppRoutes from './Routes/AppRoutes'
import AuthModal from './components/ReusableComponents/AuthModal'
import AccessDeniedGate from './components/ReusableComponents/AccessDeniedGate'
import AdminModal from './components/ReusableComponents/AdminModal'

import './index.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <UIProvider>
            <AppRoutes />
            <AuthModal />
            <AdminModal />
            <AccessDeniedGate />
          </UIProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App