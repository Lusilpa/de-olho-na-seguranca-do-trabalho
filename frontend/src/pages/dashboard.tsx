import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import { Activity, AlertTriangle, Skull, UserCheck, ServerCrash, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useDashboard } from '../hooks/useDashboard';
import type { FiltroBase } from '../api/types';

const PIE_COLORS = ['#000000', '#eab308', '#6b7280'];
const SEXO_COLORS = ['#000000', '#eab308'];

const UFS = [
  '', 'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ',
  'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

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

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 border-2 border-black ${className}`} aria-hidden="true" />;
}

interface KpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconBg: string;
  loading: boolean;
}

function KpiCard({ icon, label, value, iconBg, loading }: KpiCardProps) {
  return (
    <motion.div variants={itemVariants} className="bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4 hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
      <div className={`${iconBg} p-4 border-2 border-black self-start`}>{icon}</div>
      <div className="min-w-0 mt-2">
        <p className="text-xs text-black font-black uppercase tracking-widest truncate mb-1">{label}</p>
        {loading ? (
          <Skeleton className="h-10 w-24" />
        ) : (
          <h3 className="text-4xl font-mono font-black text-black tracking-tighter">{value}</h3>
        )}
      </div>
    </motion.div>
  );
}

function ChartCard({
  title,
  children,
  loading,
  skeletonHeight = 'h-[250px]',
}: {
  title: string;
  children: React.ReactNode;
  loading: boolean;
  skeletonHeight?: string;
}) {
  return (
    <motion.div variants={itemVariants} className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
      <h2 className="text-lg font-black text-black uppercase tracking-widest mb-6 border-b-4 border-black pb-4">
        {title}
      </h2>
      <div className="flex-1">
        {loading ? <Skeleton className={`${skeletonHeight} w-full`} /> : children}
      </div>
    </motion.div>
  );
}

export const Dashboard: React.FC = () => {
  const [filtroUf, setFiltroUf] = useState('');
  const [filtroUfAtivo, setFiltroUfAtivo] = useState('');

  const filtro: FiltroBase = filtroUfAtivo ? { uf: filtroUfAtivo } : {};
  const { data, loading, error } = useDashboard(filtro);

  const hasFilter = !!filtroUfAtivo;

  function aplicarFiltro() {
    setFiltroUfAtivo(filtroUf);
  }

  function limparFiltro() {
    setFiltroUf('');
    setFiltroUfAtivo('');
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-6 bg-[#f0f0f0] pt-24">
        <ServerCrash className="w-20 h-20 text-red-500 stroke-[1.5px]" />
        <h2 className="text-3xl font-black text-black uppercase tracking-tighter">
          FALHA CRÍTICA DE CONEXÃO
        </h2>
        <p className="text-lg text-black font-mono font-bold max-w-md">
          O PAINEL NÃO PÔDE ACESSAR A API.
          VERIFIQUE SE O SERVIDOR ESTÁ RODANDO EM{' '}
          <code className="bg-yellow-400 border-2 border-black px-2 py-0.5">{import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'}</code>
        </p>
        <p className="text-sm font-mono bg-black text-yellow-400 px-6 py-4 border-4 border-red-500 mt-4 uppercase">ERR: {error}</p>
      </div>
    );
  }

  const totalCats = data.resumo?.kpis.total_cats.toLocaleString('pt-BR') ?? '—';
  const obitos = data.resumo?.kpis.obitos.toLocaleString('pt-BR') ?? '—';
  const comAfastamento = data.resumo?.kpis.com_afastamento.toLocaleString('pt-BR') ?? '—';
  const tipoMaisFrequente = data.tipoAcidente.length > 0
      ? data.tipoAcidente.reduce((a, b) => (a.percentual > b.percentual ? a : b)).name
      : '—';

  return (
    <div className="pt-28 pb-16 px-6 md:px-8 w-full max-w-7xl mx-auto bg-[#f0f0f0] min-h-screen font-sans selection:bg-black selection:text-yellow-400">
      
      {/* ── CABEÇALHO + FILTROS ──────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div className="border-l-8 border-yellow-400 pl-4">
          <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter leading-none">
            PAINEL DE <br/>OCORRÊNCIAS
          </h1>
          <p className="text-sm text-black font-mono font-bold mt-4 uppercase flex items-center gap-2">
            VISÃO CONSOLIDADA (2021 – 2026)
            {hasFilter && (
              <span className="bg-black text-yellow-400 border-2 border-yellow-400 font-black text-xs px-2 py-1">
                UF: {filtroUfAtivo}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-0 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="p-3 bg-black text-yellow-400 border-r-4 border-black">
            <SlidersHorizontal className="w-5 h-5 stroke-[2px]" />
          </div>
          <div className="flex items-center">
            <label htmlFor="dash-filtro-uf" className="sr-only">Estado (UF)</label>
            <select
              id="dash-filtro-uf"
              value={filtroUf}
              onChange={(e) => setFiltroUf(e.target.value)}
              className="px-4 py-3 text-sm font-mono font-bold text-black bg-white focus:outline-none appearance-none min-w-[120px] uppercase cursor-pointer"
            >
              <option value="">TODOS OS ESTADOS</option>
              {UFS.filter(Boolean).map((uf) => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>

            <button
              id="btn-aplicar-filtro-dashboard"
              onClick={aplicarFiltro}
              className="bg-yellow-400 hover:bg-black text-black hover:text-yellow-400 border-l-4 border-black font-black uppercase tracking-widest text-xs px-6 py-4 transition-colors"
            >
              APLICAR
            </button>

            {hasFilter && (
              <button
                id="btn-limpar-filtro-dashboard"
                onClick={limparFiltro}
                title="Limpar filtros"
                className="bg-white hover:bg-red-500 text-black border-l-4 border-black p-3.5 transition-colors"
              >
                <RotateCcw className="w-5 h-5 stroke-[2px]" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── CARDS DE KPIs ──────────────────────────────────────────────────── */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <KpiCard icon={<Activity className="w-8 h-8 stroke-[2px]" />} label="Total de CATs" value={totalCats} iconBg="bg-yellow-400 text-black" loading={loading} />
        <KpiCard icon={<AlertTriangle className="w-8 h-8 stroke-[2px]" />} label="Com Afastamento" value={comAfastamento} iconBg="bg-white text-black" loading={loading} />
        <KpiCard icon={<Skull className="w-8 h-8 stroke-[2px]" />} label="Óbitos Registrados" value={obitos} iconBg="bg-black text-red-500" loading={loading} />
        <KpiCard icon={<UserCheck className="w-8 h-8 stroke-[2px]" />} label="Tipo Frequente" value={tipoMaisFrequente} iconBg="bg-yellow-400 text-black" loading={loading} />
      </motion.div>

      {/* ── GRÁFICOS ─────────────────────────────────────────────── */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-8">
        
        <ChartCard title="EVOLUÇÃO ANUAL (CATs)" loading={loading} skeletonHeight="h-[350px]">
          <div className="h-[350px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.evolucao} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#000" />
                <XAxis dataKey="periodo" axisLine={{ stroke: '#000', strokeWidth: 2 }} tickLine={false} tick={{ fontSize: 12, fill: '#000', fontFamily: 'monospace', fontWeight: 'bold' }} />
                <YAxis axisLine={{ stroke: '#000', strokeWidth: 2 }} tickLine={false} tick={{ fontSize: 12, fill: '#000', fontFamily: 'monospace', fontWeight: 'bold' }} />
                <RechartsTooltip
                  contentStyle={{ borderRadius: '0px', border: '4px solid #000', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)', backgroundColor: '#fff', fontWeight: 'bold', fontFamily: 'monospace' }}
                  formatter={(value) => [typeof value === 'number' ? value.toLocaleString('pt-BR') : value, 'CATs']}
                />
                <Area type="step" dataKey="cats" name="CATs" stroke="#000" strokeWidth={4} fillOpacity={1} fill="url(#colorCats)" activeDot={{ r: 8, strokeWidth: 4, stroke: '#000', fill: '#eab308' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Faixa Etária */}
          <ChartCard title="DISTRIBUIÇÃO POR IDADE" loading={loading}>
            <div className="h-[280px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.faixaEtaria} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" horizontal={true} vertical={false} stroke="#000" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="faixa" type="category" axisLine={{ stroke: '#000', strokeWidth: 2 }} tickLine={false} tick={{ fontSize: 12, fill: '#000', fontFamily: 'monospace', fontWeight: 'bold' }} width={60} />
                  <RechartsTooltip cursor={{ fill: '#eab308' }} contentStyle={{ borderRadius: '0px', border: '4px solid #000', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)', fontFamily: 'monospace', fontWeight: 'bold' }} />
                  <Bar dataKey="quantidade" name="Acidentes" fill="#000" barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Top 5 Estados */}
          <ChartCard title="TOP 5 ESTADOS" loading={loading}>
            <div className="h-[280px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topEstados} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#000" />
                  <XAxis dataKey="uf" axisLine={{ stroke: '#000', strokeWidth: 2 }} tickLine={false} tick={{ fontSize: 12, fill: '#000', fontFamily: 'monospace', fontWeight: 'bold' }} />
                  <YAxis axisLine={{ stroke: '#000', strokeWidth: 2 }} tickLine={false} tick={{ fontSize: 12, fill: '#000', fontFamily: 'monospace', fontWeight: 'bold' }} tickFormatter={(v) => `${v}%`} />
                  <RechartsTooltip cursor={{ fill: '#f0f0f0' }} contentStyle={{ borderRadius: '0px', border: '4px solid #000', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)', fontFamily: 'monospace', fontWeight: 'bold' }} formatter={(value) => [typeof value === 'number' ? `${value}%` : value, 'Participação']} />
                  <Bar dataKey="percentual" name="% de CATs" fill="#eab308" stroke="#000" strokeWidth={3} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Tipologia */}
          <ChartCard title="TIPOLOGIA DE ACIDENTE" loading={loading}>
            <div className="flex flex-col items-center pt-4">
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.tipoAcidente} innerRadius={60} outerRadius={90} paddingAngle={0} dataKey="percentual" nameKey="name" stroke="#000" strokeWidth={3}>
                      {data.tipoAcidente.map((_, index) => (
                        <Cell key={`cell-tipo-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '0px', border: '4px solid #000', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)', fontFamily: 'monospace', fontWeight: 'bold' }} formatter={(value) => [typeof value === 'number' ? `${value}%` : value, 'Participação']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 flex-wrap mt-4">
                {data.tipoAcidente.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 border-2 border-black px-2 py-1 bg-white">
                    <div className="w-3 h-3 border border-black" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-xs uppercase font-black text-black">{item.name} ({item.percentual}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>

          {/* Sexo */}
          <ChartCard title="DISTRIBUIÇÃO POR SEXO" loading={loading}>
            {data.sexo.length > 0 ? (
              <div className="flex flex-col items-center pt-4">
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.sexo} innerRadius={60} outerRadius={90} paddingAngle={0} dataKey="percentual" nameKey="sexo" stroke="#000" strokeWidth={3}>
                        {data.sexo.map((_, index) => (
                          <Cell key={`cell-sexo-${index}`} fill={SEXO_COLORS[index % SEXO_COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '0px', border: '4px solid #000', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)', fontFamily: 'monospace', fontWeight: 'bold' }} formatter={(value) => [typeof value === 'number' ? `${value}%` : value, 'Participação']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 flex-wrap mt-4">
                  {data.sexo.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 border-2 border-black px-2 py-1 bg-white">
                      <div className="w-3 h-3 border border-black" style={{ backgroundColor: SEXO_COLORS[i % SEXO_COLORS.length] }} />
                      <span className="text-xs uppercase font-black text-black">
                        {item.genero === 'M' ? 'MASC' : item.genero === 'F' ? 'FEM' : item.genero} ({item.percentual}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm font-mono font-bold text-black text-center py-12 uppercase border-4 border-dashed border-black mt-4">SEM DADOS</p>
            )}
          </ChartCard>
          
          {/* CNAE Ocupa 2 colunas */}
          <div className="lg:col-span-2">
            <ChartCard title="TOP 5 SETORES ECONÔMICOS (CNAE)" loading={loading} skeletonHeight="h-[250px]">
              <div className="h-[250px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.setorEconomico} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="2 2" horizontal={true} vertical={false} stroke="#000" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="setor" type="category" axisLine={{ stroke: '#000', strokeWidth: 2 }} tickLine={false} tick={{ fontSize: 11, fill: '#000', fontFamily: 'monospace', fontWeight: 'bold' }} width={200} />
                    <RechartsTooltip cursor={{ fill: '#eab308' }} contentStyle={{ borderRadius: '0px', border: '4px solid #000', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)', fontFamily: 'monospace', fontWeight: 'bold' }} />
                    <Bar dataKey="quantidade" name="CATs" fill="#000" barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

        </div>
      </motion.div>
    </div>
  );
};