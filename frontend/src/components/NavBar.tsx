import { Link, useLocation } from 'react-router-dom';

export function NavBar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-orange-500 font-bold border-b-2 border-orange-500' : 'text-gray-600 hover:text-orange-400';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <div>
            <h1 className="font-bold text-gray-800 leading-tight">De Olho na Segurança</h1>
            <p className="text-xs text-gray-500">Motor de Dados CAT</p>
          </div>
        </Link>
        <div className="flex gap-6">
          <Link to="/" className={`pb-1 ${isActive('/')}`}>Dashboard</Link>
          <Link to="/filtros" className={`pb-1 ${isActive('/filtros')}`}>Pesquisa</Link>
          <Link to="/documentacao" className={`pb-1 ${isActive('/documentacao')}`}>Documentação</Link>
        </div>
      </div>
    </nav>
  );
}
