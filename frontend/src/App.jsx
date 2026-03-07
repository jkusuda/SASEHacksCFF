import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './components'
import Landing from './pages/Landing'
import Login from './pages/Login'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-white text-black">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
