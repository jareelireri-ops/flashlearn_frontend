import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UIProvider } from './context/UIContext'
import { NotificationProvider } from './context/NotificationContext'
import AppRoutes from './routes/AppRoutes'
import AuthModal from './components/ReusableComponents/AuthModal'
import AccessDeniedGate from './components/ReusableComponents/AccessDeniedGate'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <UIProvider>
            <AppRoutes />
            <AuthModal />
            <AccessDeniedGate />
          </UIProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App