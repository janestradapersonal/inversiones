import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageLayout from './components/layout/PageLayout';
import Home from './pages/Home';
import PorQueInvertir from './pages/PorQueInvertir';
import Aprende from './pages/Aprende';
import Empieza from './pages/Empieza';
import Foro from './pages/Foro';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#7dd0e3]">
      <div className="text-center p-8">
        <h1 className="text-7xl font-light text-slate-300 mb-4">404</h1>
        <h2 className="text-2xl font-medium text-slate-800 mb-4">Página no encontrada</h2>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 rounded-xl bg-brand-orange text-white font-semibold hover:bg-orange-600 transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <Routes>
          <Route element={<PageLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/por-que-invertir" element={<PorQueInvertir />} />
            <Route path="/aprende" element={<Aprende />} />
            <Route path="/empieza" element={<Empieza />} />
            <Route path="/foro" element={<Foro />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
