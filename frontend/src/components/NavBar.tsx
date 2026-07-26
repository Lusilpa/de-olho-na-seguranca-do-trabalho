import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, ShieldAlert, Filter, BookOpen, HardHat, Building2 } from 'lucide-react';

const RECURSOS_ITEMS = [
  {
    title: 'FILTROS',
    description: 'PESQUISE NA BASE DE DADOS.',
    icon: Filter,
    to: '/filtros',
  },
  {
    title: 'CONSULTA CNPJ',
    description: 'HISTÓRICO DE ACIDENTES DE EMPRESAS.',
    icon: Building2,
    to: '/cnpj',
  },
  {
    title: 'BASES DE DADOS',
    description: 'DADOS ABERTOS DO GOVERNO (DADOS.GOV.BR).',
    icon: BookOpen,
    to: 'https://dados.gov.br/home',
  },
];

const MOBILE_LINKS = [
  { label: 'INÍCIO', to: '/' },
  { label: 'DASHBOARD', to: '/dashboard' },
  { label: 'FILTROS', to: '/filtros' },
  { label: 'CONSULTA CNPJ', to: '/cnpj' },
  { label: 'BASES DE DADOS', to: 'https://dados.gov.br/home' },
  { label: 'DOCUMENTAÇÃO', to: '/documentacao' },
];

export const Navbar: React.FC = () => {
  const [isDesktopDrawerOpen, setIsDesktopDrawerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const drawerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        drawerRef.current && !drawerRef.current.contains(target) &&
        buttonRef.current && !buttonRef.current.contains(target)
      ) {
        setIsDesktopDrawerOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeAllMenus = () => {
    setIsDesktopDrawerOpen(false);
    setIsMobileMenuOpen(false);
  };

  const baseLinkStyles = "text-sm font-black uppercase tracking-widest text-black hover:bg-black hover:text-yellow-400 border-2 border-transparent hover:border-black px-4 py-2 transition-colors outline-none flex items-center";

  return (
    <>
      <nav
        role="navigation"
        aria-label="Navegação principal"
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-between bg-yellow-400 border-b-4 border-black px-6 py-4"
      >
        <div className="flex items-center gap-4">
          <Link to="/" onClick={closeAllMenus} className="font-black text-black tracking-tighter uppercase text-xl md:text-2xl flex items-center gap-2">
            <HardHat className="w-8 h-8 stroke-[3px]" />
            SEG. TRABALHO
          </Link>
        </div>

        {/* === DESKTOP MENU === */}
        <div className="hidden md:flex items-center gap-2">
          <Link to="/" onClick={closeAllMenus} className={baseLinkStyles}>
            INÍCIO
          </Link>

          <Link to="/dashboard" onClick={closeAllMenus} className={baseLinkStyles}>
            DASHBOARD
          </Link>

          <button 
            ref={buttonRef}
            onClick={() => setIsDesktopDrawerOpen(!isDesktopDrawerOpen)}
            aria-expanded={isDesktopDrawerOpen}
            aria-controls="desktop-recursos-menu"
            className={`${baseLinkStyles} gap-2 ${isDesktopDrawerOpen ? 'bg-black text-yellow-400 border-black' : ''}`}
          >
            RECURSOS
            <ChevronDown className={`w-5 h-5 stroke-[3px] transition-transform duration-300 ${isDesktopDrawerOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <Link to="/documentacao" onClick={closeAllMenus} className={baseLinkStyles}>
            DOCS
          </Link>
        </div>

        {/* === MOBILE HEADER === */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-black hover:bg-black hover:text-yellow-400 border-2 border-black p-2 transition-colors outline-none"
            aria-label="Abrir Menu Mobile"
          >
            <Menu className="w-8 h-8 stroke-[3px]" />
          </button>
        </div>
      </nav>

      {/* === DESKTOP MEGA MENU GAVETA === */}
      <AnimatePresence>
        {isDesktopDrawerOpen && (
          <motion.div 
            ref={drawerRef}
            id="desktop-recursos-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="hidden md:block fixed right-6 top-24 z-40 w-96 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              {RECURSOS_ITEMS.map((item, index) => {
                const isExternal = item.to.startsWith('http');
                const commonClasses = "flex items-start gap-4 p-4 border-2 border-transparent hover:border-black hover:bg-yellow-400 transition-colors group";

                const content = (
                  <>
                    <div className="bg-black text-white p-3 group-hover:bg-white group-hover:text-black border-2 border-transparent group-hover:border-black transition-colors">
                      <item.icon className="w-6 h-6 stroke-[2px]" />
                    </div>
                    <div>
                      <h4 className="font-black text-black uppercase text-base mb-1">
                        {item.title}
                      </h4>
                      <p className="font-mono text-xs text-black/80 font-bold">
                        {item.description}
                      </p>
                    </div>
                  </>
                );

                if (isExternal) {
                  return (
                    <a key={index} href={item.to} target="_blank" rel="noopener noreferrer" className={commonClasses}>
                      {content}
                    </a>
                  );
                }

                return (
                  <Link key={index} to={item.to} onClick={closeAllMenus} className={commonClasses}>
                    {content}
                  </Link>
                );
              })}
            </div>
            <div className="bg-black p-4 text-center border-t-4 border-black">
              <span className="font-mono text-xs font-bold text-yellow-400 uppercase flex items-center justify-center gap-2">
                <ShieldAlert className="w-5 h-5 stroke-[2px]" /> A SEGURANÇA É LEI.
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === MOBILE FULLSCREEN DRAWER === */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden fixed inset-0 z-[60] bg-yellow-400 flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b-4 border-black bg-white">
              <span className="font-black text-black tracking-tighter uppercase text-xl flex items-center gap-2">
                <HardHat className="w-8 h-8 stroke-[3px]" />
                SEG. TRABALHO
              </span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="text-white bg-black border-2 border-black hover:bg-white hover:text-black p-2 transition-colors"
              >
                <X className="w-8 h-8 stroke-[3px]" />
              </button>
            </div>

            <div className="flex flex-col gap-4 p-8 overflow-y-auto pb-24 bg-yellow-400 flex-1">
              {MOBILE_LINKS.map((link, index) => {
                const isExternal = link.to.startsWith('http');
                const commonClasses = "text-3xl font-black uppercase tracking-tighter text-black border-b-4 border-black pb-4 hover:pl-4 transition-all";

                if (isExternal) {
                  return (
                    <a key={index} href={link.to} target="_blank" rel="noopener noreferrer" onClick={closeAllMenus} className={commonClasses}>
                      {link.label}
                    </a>
                  );
                }

                return (
                  <Link key={index} to={link.to} onClick={closeAllMenus} className={commonClasses}>
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};