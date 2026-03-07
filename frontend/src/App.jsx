import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Popup from './pages/Popup'
import Dashboard from './pages/Dashboard'
import VirtualCards from './pages/VirtualCards'
import { AuthProvider } from './contexts/AuthContext'
import './App.css'

function AppLayout() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')
  const isLogin = location.pathname === '/login'
  const isPopup = location.pathname === '/popup'

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {!isDashboard && !isLogin && !isPopup && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/virtual-cards" element={<VirtualCards />} />
        <Route path="/dashboard/settings" element={<Dashboard />} />
        <Route path="/popup" element={<Popup />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AppLayout />
      </HashRouter>
    </AuthProvider>
  )
}

export default App;
