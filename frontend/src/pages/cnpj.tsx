import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, MapPin, Phone, Calendar, Briefcase, ShieldCheck, ShieldAlert,
  ShieldX, Shield, AlertTriangle, Loader2, Search, X, FileText, Activity,
} from 'lucide-react';
import { useCnpj } from '../hooks/useCnpj';
import type { EmpresaData, RiscoData } from '../api/types';

function aplicarMascara(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

const SELO_CONFIG = {
  Gama: {
    label: 'Gama',
    descricao: 'Nenhuma CAT registrada na base',
    icon: ShieldCheck,
    bg: 'bg-emerald-400',
    border: 'border-black',
    text: 'text-black',
    iconColor: 'text-black',
    badge: 'bg-black text-emerald-400',
  },
  Alpha: {
    label: 'Alpha',
    descricao: 'Entre 1 e 9 ocorrências registradas',
    icon: Shield,
    bg: 'bg-yellow-400',
    border: 'border-black',
    text: 'text-black',
    iconColor: 'text-black',
    badge: 'bg-black text-yellow-400',
  },
  Beta: {
    label: 'Beta',
    descricao: 'Entre 10 e 99 ocorrências registradas',
    icon: ShieldAlert,
    bg: 'bg-orange-500',
    border: 'border-black',
    text: 'text-black',
    iconColor: 'text-black',
    badge: 'bg-black text-orange-500',
  },
  'Sem Selo': {
    label: 'Sem Selo',
    descricao: '100 ou mais ocorrências registradas',
    icon: ShieldX,
    bg: 'bg-red-500',
    border: 'border-black',
    text: 'text-black',
    iconColor: 'text-black',
    badge: 'bg-black text-red-500',
  },
};

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 border-2 border-black ${className}`} aria-hidden="true" />;
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 bg-white border-2 border-black p-4">
      <div className="mt-0.5 bg-black text-white p-2 border-2 border-transparent">
        <Icon className="w-5 h-5 stroke-[2px]" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-widest text-black mb-1">{label}</p>
        <p className="text-sm font-mono font-bold text-gray-700 leading-snug break-words uppercase">{value}</p>
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

function EmpresaCard({ empresa }: { empresa: EmpresaData }) {
  const situacaoAtiva = empresa.situacao?.toUpperCase() === 'ATIVA';

  return (
    <motion.div variants={itemVariants} className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
      <div className="flex flex-col md:flex-row items-start gap-6 mb-8 border-b-4 border-black pb-8">
        <div className="bg-yellow-400 text-black border-4 border-black p-4 flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Building2 className="w-8 h-8 stroke-[2.5px]" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tighter leading-none mb-2">
            {empresa.razao_social}
          </h2>
          {empresa.nome_fantasia && empresa.nome_fantasia !== 'N/A' && (
            <p className="text-lg font-mono font-bold text-black uppercase mb-4">{empresa.nome_fantasia}</p>
          )}
          <span
            className={`inline-block font-black uppercase tracking-widest px-4 py-2 border-4 border-black text-sm ${
              situacaoAtiva
                ? 'bg-emerald-400 text-black'
                : 'bg-red-500 text-black'
            }`}
          >
            {empresa.situacao}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoRow icon={Briefcase} label="Atividade (CNAE)" value={empresa.atividades} />
        <InfoRow icon={Calendar} label="Ano Fundação" value={empresa.ano_fundacao} />
        <InfoRow icon={MapPin} label="Endereço" value={empresa.endereco} />
        <InfoRow icon={Phone} label="Telefone" value={empresa.telefone} />
      </div>
    </motion.div>
  );
}

function RiscoCard({ risco }: { risco: RiscoData }) {
  const cfg = SELO_CONFIG[risco.selo];
  const SeloIcon = cfg.icon;

  return (
    <motion.div variants={itemVariants} className={`border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${cfg.bg} p-6 md:p-8`}>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 pb-8 border-b-4 border-black">
        <div className={`${cfg.badge} border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
          <SeloIcon className="w-8 h-8 stroke-[2.5px]" />
        </div>
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-black mb-1">Classificação de Risco</p>
          <p className={`text-4xl md:text-5xl font-black ${cfg.text} uppercase tracking-tighter`}>SELO {cfg.label}</p>
          <p className="text-sm font-mono font-bold text-black mt-2 uppercase">{cfg.descricao}</p>
        </div>
        <div className="md:ml-auto md:text-right mt-4 md:mt-0 bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black uppercase tracking-widest text-black mb-1">CATs Registradas</p>
          <p className={`text-4xl font-mono font-black text-black`}>{risco.registros.toLocaleString('pt-BR')}</p>
        </div>
      </div>

      {risco.historico.length > 0 ? (
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-black mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 stroke-[2.5px]" />
            ÚLTIMAS {risco.historico.length} OCORRÊNCIAS
          </p>
          <div className="bg-white border-4 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black text-white border-b-4 border-black">
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest">CID-10</th>
                  <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest">Tipo</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {risco.historico.map((item, i) => (
                  <tr key={i} className="hover:bg-yellow-400 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm text-black font-bold">
                      {item['Data Acidente']}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-black text-yellow-400 text-xs font-black px-2 py-1 uppercase">
                        {item['CID-10'] || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-black font-black uppercase">
                      {item['Tipo do Acidente'] || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {risco.registros > risco.historico.length && (
            <p className="text-center text-sm font-mono font-bold text-black uppercase mt-4">
              EXIBINDO {risco.historico.length} DE {risco.registros} TOTAIS
            </p>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Activity className="w-12 h-12 text-black mx-auto mb-4 stroke-[1.5px]" />
          <p className="text-lg font-black text-black uppercase tracking-widest">
            NENHUMA CAT ENCONTRADA NA BASE DE DADOS
          </p>
        </div>
      )}
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 mt-12">
      <Skeleton className="h-[200px] w-full" />
      <Skeleton className="h-[300px] w-full" />
    </motion.div>
  );
}

export function CnpjPage() {
  const { status, data, error, buscar, limpar } = useCnpj();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = aplicarMascara(e.target.value);
    e.target.value = masked;

    if (masked.replace(/\D/g, '').length === 0) {
      limpar();
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const valor = e.target.value;
    if (valor.replace(/\D/g, '').length > 0) {
      buscar(valor);
    }
  }

  function handleLimpar() {
    limpar();
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f0f0] font-sans pt-28 pb-16 selection:bg-black selection:text-yellow-400">
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto px-6 md:px-8 mb-12">
        <div className="border-l-8 border-yellow-400 pl-4">
          <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter leading-none">
            CONSULTA <br/>POR CNPJ
          </h1>
          <p className="text-sm text-black font-mono font-bold mt-4 uppercase">
            PESQUISE DADOS CADASTRAIS E HISTÓRICO DE ACIDENTES
          </p>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <label htmlFor="input-cnpj" className="block text-sm font-black uppercase tracking-widest text-black mb-4">
            CNPJ DA EMPRESA
          </label>
          <div className="relative flex items-center gap-3">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none">
              {status === 'loading' ? (
                <Loader2 className="w-6 h-6 text-yellow-400 animate-spin stroke-[3px]" />
              ) : (
                <Search className="w-6 h-6 text-black stroke-[3px]" />
              )}
            </div>
            <input
              id="input-cnpj"
              ref={inputRef}
              type="text"
              inputMode="numeric"
              placeholder="00.000.000/0000-00"
              maxLength={18}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              disabled={status === 'loading'}
              className="flex-1 pl-16 pr-16 py-5 border-4 border-black bg-white text-xl md:text-2xl font-mono font-black text-black placeholder-gray-400 focus:outline-none focus:bg-yellow-400 transition-colors disabled:opacity-50"
            />
            {status !== 'idle' && (
              <button
                onClick={handleLimpar}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 bg-black text-white hover:bg-yellow-400 hover:text-black border-2 border-black transition-colors"
                aria-label="Limpar consulta"
              >
                <X className="w-5 h-5 stroke-[3px]" />
              </button>
            )}
          </div>
          <p className="text-sm font-mono font-bold text-black mt-4 uppercase">
            DIGITE O CNPJ E PRESSIONE <kbd className="bg-black text-yellow-400 px-2 py-1 mx-1 border-2 border-black font-black">ENTER</kbd> PARA BUSCAR.
          </p>
        </motion.div>

        {status === 'idle' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-16 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6">
              <Building2 className="w-12 h-12 text-black stroke-[2px]" />
            </div>
            <h2 className="text-2xl font-black text-black uppercase tracking-tighter">AGUARDANDO CNPJ</h2>
          </motion.div>
        )}

        {status === 'loading' && <LoadingSkeleton />}

        {status === 'error' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-12 bg-red-500 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8 flex items-start gap-6">
            <div className="bg-black text-red-500 p-3 border-2 border-black">
              <AlertTriangle className="w-8 h-8 stroke-[2.5px]" />
            </div>
            <div>
              <p className="font-black text-black text-xl uppercase tracking-tighter mb-2">FALHA NA CONSULTA</p>
              <p className="font-mono text-black font-bold uppercase">{error}</p>
            </div>
          </motion.div>
        )}

        {status === 'success' && data && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="mt-12 space-y-8">
            {data.empresa ? (
              <EmpresaCard empresa={data.empresa} />
            ) : (
              <motion.div variants={itemVariants} className="bg-yellow-400 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 flex items-center gap-4">
                <div className="bg-black text-yellow-400 p-2 border-2 border-black flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 stroke-[3px]" />
                </div>
                <p className="text-sm font-mono font-bold text-black uppercase">
                  DADOS CADASTRAIS NÃO ENCONTRADOS NA RECEITA FEDERAL, MAS A BUSCA NA BASE DE CATS FOI REALIZADA.
                </p>
              </motion.div>
            )}
            <RiscoCard risco={data.risco} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
