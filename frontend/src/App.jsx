import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from './components'
import Landing from './pages/Landing'
import Login from './pages/Login'
import { AuthProvider } from './contexts/AuthContext'
import Dashboard from './pages/Dashboard'
import VirtualCards from './pages/VirtualCards'
import './App.css'

function AppLayout() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      {!isDashboard && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/virtual-cards" element={<VirtualCards />} />
        <Route path="/dashboard/settings" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-white text-black">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
