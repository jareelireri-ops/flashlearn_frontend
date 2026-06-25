import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { UIProvider } from './context/UIContext'
import AppRoutes from './routes/AppRoutes'
import AuthModal from './components/common/AuthModal'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UIProvider>
          <AppRoutes />
          <AuthModal />
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App