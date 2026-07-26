/*
  Home — Página Inicial (Industrial Brutalism)
*/

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart2,
  Filter,
  ShieldAlert,
  TrendingUp,
  Users,
  MapPin,
  ArrowRight,
  HardHat,
  Database,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { getResumo, getEvolucao, getTopEstados } from '../api/dashboardApi';
import type { EvolucaoItem } from '../api/types';

const features = [
  {
    icon: BarChart2,
    title: 'DASHBOARD ANALÍTICO',
    description: 'Visualize a evolução dos acidentes de trabalho com gráficos interativos e cortantes.',
    to: '/dashboard',
    cta: 'VER DASHBOARD',
  },
  {
    icon: Filter,
    title: 'FILTROS AVANÇADOS',
    description: 'Refine os dados por ano, estado e tipo. Encontre o recorte exato para sua análise.',
    to: '/filtros',
    cta: 'EXPLORAR FILTROS',
  },
  {
    icon: Database,
    title: 'DADOS ABERTOS',
    description: 'Base construída a partir do Ministério do Trabalho (dados.gov.br). Transparência bruta.',
    to: 'https://dados.gov.br/home',
    cta: 'ACESSAR FONTE',
    external: true,
  },
];

function useHomeData() {
  const [totalCats, setTotalCats] = useState<string>('…');
  const [totalEstados, setTotalEstados] = useState<string>('…');
  const [timeline, setTimeline] = useState<EvolucaoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const [resumo, evolucao, topEstados] = await Promise.allSettled([
          getResumo(),
          getEvolucao('anual', 'TODOS'),
          getTopEstados(),
        ]);

        if (cancelled) return;

        if (resumo.status === 'fulfilled') {
          const total = resumo.value.kpis.total_cats;
          setTotalCats(
            total >= 1000
              ? `${(total / 1000).toFixed(0)}k+`
              : total.toLocaleString('pt-BR')
          );
        }

        if (topEstados.status === 'fulfilled') {
          setTotalEstados(topEstados.value.length > 0 ? '27' : '—');
        }

        if (evolucao.status === 'fulfilled') {
          setTimeline(evolucao.value.slice(-5));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  return { totalCats, totalEstados, timeline, loading };
}

// Animações
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

export function Home() {
  const { totalCats, totalEstados, timeline, loading } = useHomeData();

  const stats = [
    { label: 'Comunicações de Acidente', value: totalCats, icon: AlertTriangle, bg: 'bg-yellow-400' },
    { label: 'Estados Cobertos', value: totalEstados, icon: MapPin, bg: 'bg-white' },
    { label: 'Anos de Dados', value: '6', icon: TrendingUp, bg: 'bg-yellow-400' },
    { label: 'Fonte', value: 'GOV.BR', icon: Users, bg: 'bg-white' },
  ];

  return (
    <div className="font-sans text-black bg-[#f0f0f0] min-h-screen overflow-x-hidden selection:bg-black selection:text-yellow-400">
      
      {/* ═══════════════════════════ HERO (BRUTALIST) ════════════════════════════════════ */}
      <section className="relative w-full border-b-4 border-black bg-white overflow-hidden pt-12">
        {/* Background Grid Pattern industrial */}
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '32px 32px' }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-[1fr_400px] gap-12 items-center">
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-yellow-400 border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-widest mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <HardHat className="w-4 h-4 stroke-[3px]" />
              Painel de Monitoramento
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
              DE OLHO NA <br/>
              <span className="bg-black text-yellow-400 px-4 inline-block mt-2 transform -skew-x-6">SEGURANÇA</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="font-mono text-gray-800 text-lg md:text-xl max-w-2xl leading-relaxed mb-10 border-l-4 border-yellow-400 pl-4 bg-white/50 backdrop-blur-sm p-2">
              PLATAFORMA DE ANÁLISE DAS COMUNICAÇÕES DE ACIDENTE DO TRABALHO (CAT). DADOS BRUTOS TRANSFORMADOS EM VISÃO ESTRATÉGICA.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
              <Link
                to="/dashboard"
                className="group flex items-center justify-center gap-2 bg-yellow-400 border-4 border-black text-black font-black uppercase tracking-widest text-lg px-8 py-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-2"
              >
                ACESSAR PAINEL
                <ArrowRight className="w-6 h-6 stroke-[3px] group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }} 
            animate={{ opacity: 1, scale: 1, rotate: 0 }} 
            transition={{ type: "spring", damping: 15, delay: 0.4 }}
            className="hidden md:block relative w-full h-[400px]"
          >
             <div className="absolute inset-0 bg-yellow-400 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] translate-x-4 translate-y-4"></div>
             <div className="absolute inset-0 bg-black border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] -translate-x-4 -translate-y-4 flex items-center justify-center p-8">
                <ShieldAlert className="w-full h-full text-yellow-400 opacity-90 stroke-[1.5px]" />
             </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════ STATS (BRUTALIST) ════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                variants={itemVariants}
                key={i}
                className={`${stat.bg} border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col items-start gap-4 hover:-translate-y-2 hover:shadow-[8px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300`}
              >
                <div className="p-2 border-2 border-black bg-black text-white">
                  <Icon className="w-6 h-6 stroke-[2.5px]" />
                </div>
                <div>
                  <p className="font-mono text-4xl md:text-5xl font-black text-black tracking-tighter mb-1">
                    {loading && i < 2 ? (
                      <Loader2 className="w-8 h-8 animate-spin text-black" />
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className="text-sm font-black uppercase tracking-widest text-black/70 leading-tight">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ═════════════════════════ FEATURES (BRUTALIST) ══════════════════════════════════ */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 border-l-8 border-yellow-400 pl-6"
          >
            <h2 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter">
              SISTEMAS DE ANÁLISE
            </h2>
            <p className="font-mono text-lg text-black mt-2 font-bold uppercase">Módulos disponíveis na plataforma</p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feat, i) => {
              const Icon = feat.icon;
              const inner = (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  className="group bg-white border-4 border-black p-8 flex flex-col h-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                >
                  <div className="bg-yellow-400 text-black border-2 border-black w-16 h-16 flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Icon className="w-8 h-8 stroke-[2px]" />
                  </div>
                  <h3 className="font-black text-black text-2xl uppercase tracking-tight mb-4 group-hover:bg-yellow-400 inline-block transition-colors">
                    {feat.title}
                  </h3>
                  <p className="font-mono text-sm text-gray-700 leading-relaxed flex-1 mb-8">
                    {feat.description.toUpperCase()}
                  </p>
                  <div className="mt-auto border-t-2 border-black pt-4 flex items-center justify-between">
                    <span className="font-black uppercase tracking-widest text-black">
                      {feat.cta}
                    </span>
                    <ArrowRight className="w-6 h-6 stroke-[3px] group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              );

              if (feat.external) {
                return <a key={i} href={feat.to} target="_blank" rel="noopener noreferrer">{inner}</a>;
              }
              return <Link key={i} to={feat.to} className="h-full block">{inner}</Link>;
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════ LINHA DO TEMPO (BRUTALIST) ══════════════════════════════ */}
      {timeline.length > 0 && (
        <section className="bg-black text-white py-32 border-t-4 border-yellow-400">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-20 text-center"
            >
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                REGISTRO HISTÓRICO
              </h2>
            </motion.div>

            <div className="relative">
              {/* Linha grossa amarela */}
              <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-2 bg-yellow-400 -translate-x-1" />

              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="flex flex-col gap-12"
              >
                {timeline.map((item, i) => (
                  <motion.div
                    variants={itemVariants}
                    key={i}
                    className={`relative flex items-start md:items-center gap-8 md:gap-0 ${
                      i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Nó amarelo */}
                    <div className="absolute left-0 md:left-1/2 w-14 h-14 bg-yellow-400 border-4 border-black flex items-center justify-center font-mono font-black text-black text-lg z-10 md:-translate-x-7 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] flex-shrink-0">
                      {String(item.periodo).slice(-2)}
                    </div>

                    <div className={`pl-20 md:pl-0 md:w-5/12 ${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16 md:text-left md:ml-auto'}`}>
                      <div className="bg-white text-black border-4 border-yellow-400 p-6 shadow-[8px_8px_0px_0px_rgba(234,179,8,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(234,179,8,1)] transition-all">
                        <span className="font-mono text-2xl font-black block mb-2">
                          {item.periodo}
                        </span>
                        <p className="font-mono text-sm uppercase">
                          <span className="bg-yellow-400 px-2 py-1 text-xl font-black mr-2">
                            {item.cats.toLocaleString('pt-BR')}
                          </span>
                          Registros
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════ CTA FINAL (BRUTALIST) ═══════════════════════════════ */}
      <section className="bg-yellow-400 text-black py-32 border-t-4 border-black overflow-hidden relative">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 12px)' }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <ShieldAlert className="w-20 h-20 text-black mx-auto mb-8 stroke-[1.5px]" />
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none">
            A SEGURANÇA É <br/>
            <span className="bg-black text-yellow-400 px-4 inline-block transform -skew-x-6 mt-4">LEI.</span>
          </h2>
          <p className="font-mono text-xl max-w-2xl mx-auto mb-12 font-bold uppercase">
            Acompanhe a conformidade e evite acidentes através da análise de dados brutos.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-4 bg-black text-yellow-400 border-4 border-black font-black uppercase tracking-widest text-xl px-12 py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all group active:scale-95"
          >
            INICIAR ANÁLISE
            <ArrowRight className="w-8 h-8 stroke-[3px] group-hover:translate-x-3 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}