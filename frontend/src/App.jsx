import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components'
import DashboardLayout from './layouts/DashboardLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Popup from './pages/Popup'
import Dashboard from './pages/Dashboard'
import VirtualCards from './pages/VirtualCards'
import ManageFunds from './pages/ManageFunds'
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
        <Route path="/popup" element={<Popup />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="virtual-cards" element={<VirtualCards />} />
          <Route path="manage-funds" element={<ManageFunds />} />
        </Route>
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
