import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import Home from './pages/home';
import Filtros from './pages/filtros';
import Documentacao from './pages/documentacao';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans">
        <NavBar />
        
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/filtros" element={<Filtros />} />
            <Route path="/documentacao" element={<Documentacao />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
