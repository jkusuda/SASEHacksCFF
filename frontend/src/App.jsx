import { HashRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Popup from './pages/Popup';

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* The main Web Dashboard / Landing Page */}
        <Route path="/" element={<Landing />} />
        
        {/* The specific route that the Chrome Extension will load */}
        <Route path="/popup" element={<Popup />} />
      </Routes>
    </HashRouter>
  )
}

export default App;
