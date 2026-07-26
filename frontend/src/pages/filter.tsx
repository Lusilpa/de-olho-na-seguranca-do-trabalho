import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Filter as FilterIcon, X, Search, ChevronLeft, ChevronRight, RotateCcw,
  Loader2, ServerCrash, AlertTriangle,
} from 'lucide-react';
import { getRegistros } from '../api/dashboardApi';
import type { CatRecord, RegistrosResponse } from '../api/types';

const ANOS = ['Todos', '2021', '2022', '2023', '2024', '2025', '2026'];
const UFS = [
  'Todos', 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ',
  'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];
const TIPOS = ['Todos', 'Típico', 'Trajeto', 'Doença Ocupacional'];
const PAGE_SIZE = 10;

function tipoBadge(tipo: string) {
  const t = tipo.toLowerCase();
  if (t.includes('típico') || t.includes('tipico')) return 'bg-white text-black border-2 border-black';
  if (t.includes('trajeto')) return 'bg-yellow-400 text-black border-2 border-black';
  return 'bg-black text-white border-2 border-black';
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 border-2 border-black ${className}`} aria-hidden="true" />;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

export function Filter() {
  const [filtroAno, setFiltroAno] = useState('Todos');
  const [filtroUf, setFiltroUf] = useState('Todos');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [pagina, setPagina] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [resultado, setResultado] = useState<RegistrosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasFilters = filtroAno !== 'Todos' || filtroUf !== 'Todos' || filtroTipo !== 'Todos';

  const fetchDados = useCallback(async (paginaAtual: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRegistros({
        ano: filtroAno !== 'Todos' ? filtroAno : undefined,
        uf: filtroUf !== 'Todos' ? filtroUf : undefined,
        tipo: filtroTipo !== 'Todos' ? filtroTipo : undefined,
        pagina: paginaAtual,
        por_pagina: PAGE_SIZE,
      });
      setResultado(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao conectar com a API.');
    } finally {
      setLoading(false);
    }
  }, [filtroAno, filtroUf, filtroTipo]);

  useEffect(() => {
    fetchDados(pagina);
  }, [fetchDados, pagina]);

  const limparFiltros = () => {
    setFiltroAno('Todos');
    setFiltroUf('Todos');
    setFiltroTipo('Todos');
    setPagina(1);
  };

  const aplicarFiltros = () => {
    setPagina(1);
    setSidebarOpen(false);
  };

  const FilterPanel = () => (
    <div className="flex flex-col gap-6">
      <div>
        <label className="block text-sm font-black uppercase tracking-widest text-black mb-2">Ano</label>
        <select
          id="filtro-ano"
          value={filtroAno}
          onChange={(e) => setFiltroAno(e.target.value)}
          className="w-full border-4 border-black px-4 py-3 text-sm font-mono font-bold text-black bg-white focus:outline-none appearance-none rounded-none cursor-pointer"
        >
          {ANOS.map((a) => <option key={a}>{a}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-black uppercase tracking-widest text-black mb-2">Estado (UF)</label>
        <select
          id="filtro-uf"
          value={filtroUf}
          onChange={(e) => setFiltroUf(e.target.value)}
          className="w-full border-4 border-black px-4 py-3 text-sm font-mono font-bold text-black bg-white focus:outline-none appearance-none rounded-none cursor-pointer"
        >
          {UFS.map((u) => <option key={u}>{u}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-black uppercase tracking-widest text-black mb-2">Tipo de Acidente</label>
        <select
          id="filtro-tipo"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="w-full border-4 border-black px-4 py-3 text-sm font-mono font-bold text-black bg-white focus:outline-none appearance-none rounded-none cursor-pointer"
        >
          {TIPOS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      <button
        id="btn-aplicar-filtros"
        onClick={aplicarFiltros}
        className="w-full bg-black hover:bg-yellow-400 hover:text-black text-yellow-400 font-black uppercase tracking-widest text-sm px-6 py-4 flex items-center justify-center gap-2 transition-colors border-4 border-black border-transparent hover:border-black"
      >
        <Search className="w-5 h-5 stroke-[3px]" />
        Buscar
      </button>

      {hasFilters && (
        <button
          id="btn-limpar-filtros"
          onClick={limparFiltros}
          className="w-full bg-white hover:bg-black hover:text-white text-black font-black uppercase tracking-widest text-sm px-6 py-4 flex items-center justify-center gap-2 transition-colors border-4 border-black"
        >
          <RotateCcw className="w-5 h-5 stroke-[3px]" />
          Limpar Filtros
        </button>
      )}
    </div>
  );

  const TabelaConteudo = () => {
    if (error) {
      return (
        <div className="py-16 text-center flex flex-col items-center gap-3">
          <ServerCrash className="w-12 h-12 text-black stroke-[1.5px]" />
          <p className="font-black text-black uppercase tracking-widest text-lg">Falha Crítica</p>
          <p className="text-sm text-yellow-400 font-mono bg-black px-4 py-2 border-4 border-red-500 uppercase">{error}</p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="p-6 flex flex-col gap-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      );
    }

    const registros = resultado?.registros ?? [];

    if (registros.length === 0) {
      return (
        <div className="py-20 text-center">
          <Search className="w-12 h-12 text-black mx-auto mb-4 stroke-[1.5px]" />
          <p className="font-black text-black uppercase tracking-widest text-lg">Nenhum registro encontrado</p>
          <p className="font-mono text-sm font-bold text-black uppercase border-4 border-black border-dashed inline-block px-4 py-2 mt-4">Remova os filtros para tentar novamente.</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-black border-b-4 border-black text-white">
              <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-widest">Data</th>
              <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-widest">UF</th>
              <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-widest">Tipo</th>
              <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-widest hidden md:table-cell">CID-10</th>
              <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-widest hidden lg:table-cell">Parte Corpo</th>
              <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-widest hidden lg:table-cell">Sexo</th>
              <th className="px-4 py-4 text-center text-xs font-black uppercase tracking-widest hidden xl:table-cell">Óbito</th>
              <th className="px-4 py-4 text-center text-xs font-black uppercase tracking-widest hidden xl:table-cell">Afast.</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {registros.map((r: CatRecord, i: number) => (
              <tr key={i} className="hover:bg-yellow-400 transition-colors bg-white">
                <td className="px-4 py-4 font-mono text-sm text-black font-bold whitespace-nowrap">{r.data_acidente || '—'}</td>
                <td className="px-4 py-4">
                  <span className="bg-black text-yellow-400 text-xs font-black px-2 py-1 uppercase">{r.uf || '—'}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-xs font-black px-2 py-1 uppercase tracking-wider ${tipoBadge(r.tipo)}`}>{r.tipo || '—'}</span>
                </td>
                <td className="px-4 py-4 font-mono text-sm text-black font-bold hidden md:table-cell uppercase">{r.cid || '—'}</td>
                <td className="px-4 py-4 text-sm font-bold text-black hidden lg:table-cell uppercase">{r.parte_corpo || '—'}</td>
                <td className="px-4 py-4 text-sm font-bold text-black hidden lg:table-cell uppercase">{r.sexo || '—'}</td>
                <td className="px-4 py-4 text-center hidden xl:table-cell">
                  {r.obito ? <span className="inline-block w-4 h-4 bg-red-500 border-2 border-black" title="Sim" /> : <span className="inline-block w-4 h-4 bg-white border-2 border-black" title="Não" />}
                </td>
                <td className="px-4 py-4 text-center hidden xl:table-cell">
                  {r.afastamento ? <span className="inline-block w-4 h-4 bg-yellow-400 border-2 border-black" title="Sim" /> : <span className="inline-block w-4 h-4 bg-white border-2 border-black" title="Não" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const total = resultado?.total ?? 0;
  const totalPaginas = resultado?.total_paginas ?? 1;

  return (
    <div className="pt-28 pb-16 px-6 md:px-8 w-full min-h-screen bg-[#f0f0f0] font-sans selection:bg-black selection:text-yellow-400">
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto flex items-end justify-between gap-4 flex-wrap mb-12">
        <div className="border-l-8 border-yellow-400 pl-4">
          <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter leading-none">
            CONSULTA <br/>DE DADOS
          </h1>
          <p className="text-sm text-black font-mono font-bold mt-4 uppercase">
            EXPLORE OS REGISTROS BRUTOS DO BANCO DE DADOS
          </p>
        </div>
        <button
          id="btn-abrir-filtros-mobile"
          onClick={() => setSidebarOpen(true)}
          className="md:hidden inline-flex items-center gap-2 bg-black text-yellow-400 border-4 border-black font-black uppercase tracking-widest text-xs px-5 py-3"
        >
          <FilterIcon className="w-5 h-5 stroke-[3px]" />
          Filtros
          {hasFilters && <span className="bg-yellow-400 text-black border-2 border-black w-6 h-6 flex items-center justify-center text-xs">!</span>}
        </button>
      </motion.div>

      <div className="max-w-7xl mx-auto flex gap-8 items-start">
        
        {/* ══ SIDEBAR DESKTOP ══ */}
        <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="hidden md:block w-72 flex-shrink-0 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-28">
          <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
            <h2 className="text-lg font-black uppercase tracking-widest text-black flex items-center gap-2">
              <FilterIcon className="w-5 h-5 stroke-[3px]" /> FILTROS
            </h2>
            {hasFilters && <span className="text-xs font-black uppercase bg-yellow-400 text-black border-2 border-black px-2 py-1">ATIVO</span>}
          </div>
          <FilterPanel />
        </motion.aside>

        {/* ══ DRAWER MOBILE ══ */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/80" onClick={() => setSidebarOpen(false)} />
            <aside className="relative z-10 ml-auto w-80 bg-white h-full overflow-y-auto p-6 border-l-4 border-black shadow-[-8px_0_0_0_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between mb-8 border-b-4 border-black pb-4">
                <h2 className="text-lg font-black uppercase tracking-widest text-black flex items-center gap-2">
                  <FilterIcon className="w-5 h-5 stroke-[3px]" /> FILTROS
                </h2>
                <button onClick={() => setSidebarOpen(false)} className="p-2 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors">
                  <X className="w-5 h-5 stroke-[3px]" />
                </button>
              </div>
              <FilterPanel />
            </aside>
          </div>
        )}

        {/* ══ TABELA ══ */}
        <motion.main variants={containerVariants} initial="hidden" animate="visible" className="flex-1 min-w-0">
          
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <p className="text-sm text-black font-mono font-bold flex items-center gap-2 uppercase">
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              <span className="font-black bg-black text-yellow-400 px-2 py-1">
                {loading ? '…' : total.toLocaleString('pt-BR')}
              </span>{' '}
              REGISTROS ENCONTRADOS
            </p>

            {hasFilters && (
              <div className="flex items-center gap-2 flex-wrap">
                {filtroAno !== 'Todos' && (
                  <span className="inline-flex items-center gap-2 bg-black text-white text-xs font-bold border-2 border-black px-3 py-1 uppercase">
                    {filtroAno} <button onClick={() => { setFiltroAno('Todos'); setPagina(1); }}><X className="w-4 h-4 hover:text-yellow-400" /></button>
                  </span>
                )}
                {filtroUf !== 'Todos' && (
                  <span className="inline-flex items-center gap-2 bg-black text-white text-xs font-bold border-2 border-black px-3 py-1 uppercase">
                    {filtroUf} <button onClick={() => { setFiltroUf('Todos'); setPagina(1); }}><X className="w-4 h-4 hover:text-yellow-400" /></button>
                  </span>
                )}
                {filtroTipo !== 'Todos' && (
                  <span className="inline-flex items-center gap-2 bg-yellow-400 text-black text-xs font-bold border-2 border-black px-3 py-1 uppercase">
                    {filtroTipo} <button onClick={() => { setFiltroTipo('Todos'); setPagina(1); }}><X className="w-4 h-4 hover:text-white" /></button>
                  </span>
                )}
              </div>
            )}
          </div>

          {!loading && !error && (
            <div className="flex items-center gap-2 bg-black border-4 border-yellow-400 p-4 mb-6 text-yellow-400">
              <AlertTriangle className="w-5 h-5 stroke-[2px] flex-shrink-0" />
              <p className="text-xs font-mono font-bold uppercase tracking-wider">
                DADOS REAIS CARREGADOS VIA GOV.BR
              </p>
            </div>
          )}

          <motion.div variants={itemVariants} className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <TabelaConteudo />

            {/* Paginação */}
            {!loading && !error && totalPaginas > 1 && (
              <div className="flex items-center justify-between px-6 py-6 border-t-4 border-black bg-white">
                <p className="text-xs text-black font-mono font-bold uppercase">
                  PÁGINA <span className="font-black bg-black text-yellow-400 px-2 py-1">{pagina}</span> DE{' '}
                  <span className="font-black">{totalPaginas.toLocaleString('pt-BR')}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPagina((p) => Math.max(1, p - 1))}
                    disabled={pagina === 1}
                    className="p-2 border-2 border-black bg-white hover:bg-black hover:text-yellow-400 disabled:opacity-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[3px]" />
                  </button>

                  <div className="flex gap-1 hidden sm:flex">
                    {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                      const p = i + 1;
                      return (
                        <button
                          key={p}
                          onClick={() => setPagina(p)}
                          className={`w-10 h-10 border-2 border-black font-mono font-bold transition-colors ${
                            p === pagina ? 'bg-black text-yellow-400' : 'bg-white hover:bg-yellow-400 text-black'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                    {totalPaginas > 5 && <span className="px-2 text-black font-black self-end">…</span>}
                  </div>

                  <button
                    onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                    disabled={pagina === totalPaginas}
                    className="p-2 border-2 border-black bg-white hover:bg-black hover:text-yellow-400 disabled:opacity-50 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 stroke-[3px]" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}