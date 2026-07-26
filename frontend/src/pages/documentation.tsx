import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Database, FileText, HelpCircle, Layers, ChevronDown, ExternalLink,
  ShieldAlert, BarChart2, Filter, Code2,
} from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

interface DictItem {
  campo: string;
  tipo: string;
  descricao: string;
  exemplo: string;
}

const faqItems: FaqItem[] = [
  {
    question: 'O QUE É UMA CAT?',
    answer:
      'A Comunicação de Acidente do Trabalho (CAT) é um documento obrigatório que deve ser emitido pela empresa quando um empregado sofre acidente do trabalho ou é acometido por doença profissional ou do trabalho. É regida pelo Art. 22 da Lei 8.213/91.',
  },
  {
    question: 'OS DADOS SÃO EM TEMPO REAL?',
    answer:
      'Não. Os dados são obtidos a partir das bases abertas do Ministério do Trabalho e Previdência, disponíveis no portal dados.gov.br. A atualização depende da frequência de publicação oficial pelo governo.',
  },
  {
    question: 'POSSO USAR ESSES DADOS EM PESQUISAS?',
    answer:
      'Sim! Os dados são públicos e abertos, licenciados sob a Open Data Commons. Você pode utilizá-los em pesquisas acadêmicas, jornalismo, análises de política pública, entre outros fins, desde que cite a fonte original.',
  },
  {
    question: 'O QUE É CBO?',
    answer:
      'CBO significa Classificação Brasileira de Ocupações. É um documento que reconhece, nomeia e codifica os títulos e descreve as características das ocupações do mercado de trabalho brasileiro. É usado como referência para agrupar as CATs por tipo de profissão.',
  },
  {
    question: 'O QUE É UM ACIDENTE DE TRAJETO?',
    answer:
      'Acidente de trajeto é aquele ocorrido no percurso da residência para o local de trabalho e vice-versa, independente do meio de locomoção. É diferente do acidente típico, que ocorre durante o exercício do trabalho.',
  },
];

const dicionario: DictItem[] = [
  { campo: 'Data Acidente', tipo: 'Data', descricao: 'Data em que o acidente ocorreu', exemplo: '15/03/2024' },
  { campo: 'UF Munic. Empregador', tipo: 'Texto (2)', descricao: 'Sigla do estado (UF) do empregador', exemplo: 'SP' },
  { campo: 'Munic Empr', tipo: 'Texto', descricao: 'Município do empregador', exemplo: 'São Paulo' },
  { campo: 'Tipo do Acidente', tipo: 'Texto', descricao: 'Tipo de CAT: Típico, Trajeto ou Doença', exemplo: 'Típico' },
  { campo: 'CID-10', tipo: 'Texto', descricao: 'Código CID-10 da lesão ou doença registrada', exemplo: 'S62.2' },
  { campo: 'Parte Corpo Atingida', tipo: 'Texto', descricao: 'Descrição da parte do corpo afetada no acidente', exemplo: 'Mão (dedos)' },
  { campo: 'Sexo', tipo: 'Texto (1)', descricao: 'Sexo do trabalhador: M (Masculino) ou F (Feminino)', exemplo: 'M' },
  { campo: 'Data Nascimento', tipo: 'Data', descricao: 'Data de nascimento do trabalhador', exemplo: '10/05/1985' },
  { campo: 'Indica Óbito Acidente', tipo: 'Texto', descricao: 'Indica se o acidente resultou em óbito: SIM ou NÃO', exemplo: 'NÃO' },
  { campo: 'Data Afastamento', tipo: 'Data', descricao: 'Data de início do afastamento do trabalho', exemplo: '16/03/2024' },
  { campo: 'CNPJ/CEI Empregador', tipo: 'Texto (14)', descricao: 'CNPJ ou CEI do empregador responsável', exemplo: '11222333000181' },
  { campo: 'CNAE2.0 Empregador', tipo: 'Texto', descricao: 'Código e descrição da atividade econômica (CNAE 2.0)', exemplo: '4711-3/02 - Comércio varejista' },
];

const tecnologias = [
  { nome: 'React 19', desc: 'Interface de usuário', icon: Code2, cor: 'bg-yellow-400' },
  { nome: 'TypeScript', desc: 'Tipagem estática', icon: FileText, cor: 'bg-yellow-400' },
  { nome: 'Vite', desc: 'Build tool rápida', icon: Layers, cor: 'bg-yellow-400' },
  { nome: 'Tailwind CSS', desc: 'Estilização utility-first', icon: Code2, cor: 'bg-yellow-400' },
  { nome: 'Recharts', desc: 'Gráficos analíticos', icon: BarChart2, cor: 'bg-yellow-400' },
  { nome: 'React Router v7', desc: 'Roteamento SPA', icon: Filter, cor: 'bg-yellow-400' },
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

function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="flex flex-col divide-y-4 divide-black border-4 border-black">
      {items.map((item, i) => (
        <div key={i} className="bg-white">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between p-6 text-left group hover:bg-yellow-400 transition-colors"
          >
            <span className="font-black text-black text-sm uppercase tracking-widest pr-4">
              {item.question}
            </span>
            <ChevronDown
              className={`w-6 h-6 stroke-[3px] text-black flex-shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180' : ''}`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 bg-white ${open === i ? 'max-h-96 border-t-4 border-black' : 'max-h-0'}`}
          >
            <p className="text-sm font-mono font-bold text-black p-6 uppercase leading-relaxed">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const navSections = [
  { id: 'sobre', label: 'SOBRE O PROJETO', icon: BookOpen },
  { id: 'dados', label: 'FONTE DOS DADOS', icon: Database },
  { id: 'como-usar', label: 'COMO USAR', icon: HelpCircle },
  { id: 'dicionario', label: 'DICIONÁRIO', icon: FileText },
  { id: 'tecnologias', label: 'TECNOLOGIAS', icon: Layers },
  { id: 'faq', label: 'FAQ', icon: ShieldAlert },
];

export function Documentation() {
  const scrollTo = (id: string) => {
    const yOffset = -120; 
    const element = document.getElementById(id);
    if(element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] font-sans pt-28 pb-16 selection:bg-black selection:text-yellow-400">
      
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto px-6 md:px-8 mb-12">
        <div className="border-l-8 border-yellow-400 pl-4">
          <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tighter leading-none">
            MANUAL <br/>DO SISTEMA
          </h1>
          <p className="text-sm text-black font-mono font-bold mt-4 uppercase">
            DOCUMENTAÇÃO TÉCNICA E GUIA DE UTILIZAÇÃO
          </p>
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 flex gap-8 items-start">

        {/* ══ NAV LATERAL DESKTOP ══════════════════════════════════════════ */}
        <motion.nav initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="hidden md:block w-64 flex-shrink-0 sticky top-28 bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black uppercase tracking-widest text-black mb-4 border-b-4 border-black pb-2">ÍNDICE</p>
          <ul className="flex flex-col gap-2">
            {navSections.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => scrollTo(s.id)}
                    className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm font-black text-black hover:bg-yellow-400 border-2 border-transparent hover:border-black transition-all"
                  >
                    <Icon className="w-5 h-5 flex-shrink-0 stroke-[2.5px]" />
                    {s.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </motion.nav>

        {/* ══ CONTEÚDO ═════════════════════════════════════════════════════ */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex-1 min-w-0 flex flex-col gap-12">

          {/* ── Sobre o Projeto ── */}
          <motion.section variants={itemVariants} id="sobre" className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6 border-b-4 border-black pb-4">
              <div className="bg-black text-yellow-400 p-2 border-2 border-black"><BookOpen className="w-6 h-6 stroke-[3px]" /></div>
              <h2 className="font-black text-black uppercase tracking-tighter text-2xl">SOBRE O PROJETO</h2>
            </div>
            <div className="space-y-4 font-mono font-bold text-black uppercase text-sm leading-relaxed">
              <p>
                <span className="bg-yellow-400 text-black px-1 mr-1">DE OLHO NA SEGURANÇA DO TRABALHO</span> É UMA PLATAFORMA DE VISUALIZAÇÃO E ANÁLISE DAS COMUNICAÇÕES DE ACIDENTE DO TRABALHO (CAT) REGISTRADAS NO BRASIL.
              </p>
              <p>
                O OBJETIVO É DEMOCRATIZAR O ACESSO ÀS INFORMAÇÕES SOBRE ACIDENTES LABORAIS, PERMITINDO QUE PESQUISADORES, JORNALISTAS, GESTORES DE RH E CIDADÃOS POSSAM EXPLORAR OS DADOS DE FORMA INTUITIVA, SEM PRECISAR LIDAR COM PLANILHAS BRUTAS.
              </p>
              <p>
                O PROJETO FOI DESENVOLVIDO COMO INICIATIVA ACADÊMICA E DE DADOS ABERTOS, UTILIZANDO EXCLUSIVAMENTE BASES PÚBLICAS DISPONIBILIZADAS PELO GOVERNO FEDERAL.
              </p>
            </div>
          </motion.section>

          {/* ── Fonte dos Dados ── */}
          <motion.section variants={itemVariants} id="dados" className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6 border-b-4 border-black pb-4">
              <div className="bg-black text-yellow-400 p-2 border-2 border-black"><Database className="w-6 h-6 stroke-[3px]" /></div>
              <h2 className="font-black text-black uppercase tracking-tighter text-2xl">FONTE DOS DADOS</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-yellow-400 p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xs font-black uppercase tracking-widest text-black mb-2">Origem</p>
                <p className="font-mono font-bold text-black text-sm uppercase">PORTAL DADOS.GOV.BR</p>
                <p className="font-mono text-xs text-black mt-2 uppercase font-bold">Ministério do Trabalho e Previdência</p>
              </div>
              <div className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xs font-black uppercase tracking-widest text-black mb-2">Licença</p>
                <p className="font-mono font-bold text-black text-sm uppercase">OPEN DATA COMMONS</p>
                <p className="font-mono text-xs text-black mt-2 uppercase font-bold">Uso livre com citação da fonte</p>
              </div>
              <div className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xs font-black uppercase tracking-widest text-black mb-2">Período</p>
                <p className="font-mono font-bold text-black text-sm uppercase">2021 – 2026 (PARCIAL)</p>
                <p className="font-mono text-xs text-black mt-2 uppercase font-bold">Atualização conforme publicação</p>
              </div>
              <div className="bg-black text-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xs font-black uppercase tracking-widest text-yellow-400 mb-2">Formato Original</p>
                <p className="font-mono font-bold text-white text-sm uppercase">CSV / XLSX</p>
                <p className="font-mono text-xs text-white mt-2 uppercase font-bold">Processados via API REST</p>
              </div>
            </div>

            <a
              href="https://dados.gov.br/home"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-black text-yellow-400 border-4 border-black hover:bg-yellow-400 hover:text-black font-black uppercase tracking-widest text-xs px-6 py-4 transition-colors"
            >
              ACESSAR PORTAL DE DADOS
              <ExternalLink className="w-4 h-4 stroke-[3px]" />
            </a>
          </motion.section>

          {/* ── Como Usar ── */}
          <motion.section variants={itemVariants} id="como-usar" className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-8 border-b-4 border-black pb-4">
              <div className="bg-black text-yellow-400 p-2 border-2 border-black"><HelpCircle className="w-6 h-6 stroke-[3px]" /></div>
              <h2 className="font-black text-black uppercase tracking-tighter text-2xl">COMO USAR</h2>
            </div>

            <div className="flex flex-col gap-6">
              {[
                { step: '01', title: 'EXPLORE O DASHBOARD', desc: 'Acesse "Dashboard" no menu para ter uma visão geral com gráficos de evolução temporal. Use o filtro de UF para recortar por estado.' },
                { step: '02', title: 'USE OS FILTROS', desc: 'Na página "Filtros", selecione Ano, Estado e Tipo de Acidente para refinar os dados. Os resultados reais aparecem na tabela.' },
                { step: '03', title: 'CONSULTE POR CNPJ', desc: 'Na página "Consulta CNPJ", digite o CNPJ de uma empresa para ver seus dados cadastrais e o histórico de CATs com Selo de Risco.' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-4 items-start bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="w-12 h-12 border-4 border-black bg-yellow-400 text-black flex items-center justify-center font-black text-lg flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -ml-10 md:-ml-12 md:-mt-10 bg-white">
                    {item.step}
                  </div>
                  <div>
                    <p className="font-black text-black text-lg uppercase tracking-tight mb-2 bg-yellow-400 px-2 inline-block border-2 border-black">{item.title}</p>
                    <p className="text-sm font-mono font-bold text-black uppercase leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── Dicionário de Dados ── */}
          <motion.section variants={itemVariants} id="dicionario" className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6 border-b-4 border-black pb-4">
              <div className="bg-black text-yellow-400 p-2 border-2 border-black"><FileText className="w-6 h-6 stroke-[3px]" /></div>
              <h2 className="font-black text-black uppercase tracking-tighter text-2xl">DICIONÁRIO DE DADOS</h2>
            </div>
            
            <div className="overflow-x-auto border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-black text-white border-b-4 border-black">
                    <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-widest">CAMPO</th>
                    <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-widest">TIPO</th>
                    <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-widest hidden sm:table-cell">DESCRIÇÃO</th>
                    <th className="px-4 py-4 text-left text-xs font-black uppercase tracking-widest hidden md:table-cell">EXEMPLO</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black">
                  {dicionario.map((row, i) => (
                    <tr key={i} className="hover:bg-yellow-400 transition-colors bg-white">
                      <td className="px-4 py-4 font-black text-xs text-black uppercase">{row.campo}</td>
                      <td className="px-4 py-4">
                        <span className="bg-black text-yellow-400 border-2 border-black text-[10px] font-black px-2 py-1 uppercase">
                          {row.tipo}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-black font-mono font-bold uppercase hidden sm:table-cell text-xs">{row.descricao}</td>
                      <td className="px-4 py-4 font-mono text-xs text-black font-black uppercase hidden md:table-cell">{row.exemplo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* ── Tecnologias ── */}
          <motion.section variants={itemVariants} id="tecnologias" className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10">
            <div className="flex items-center gap-4 mb-6 border-b-4 border-black pb-4">
              <div className="bg-black text-yellow-400 p-2 border-2 border-black"><Layers className="w-6 h-6 stroke-[3px]" /></div>
              <h2 className="font-black text-black uppercase tracking-tighter text-2xl">TECNOLOGIAS UTILIZADAS</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tecnologias.map((t, i) => {
                const Icon = t.icon;
                return (
                  <div key={i} className="flex items-start gap-4 bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <div className={`p-3 border-2 border-black ${t.cor} text-black flex-shrink-0`}>
                      <Icon className="w-5 h-5 stroke-[2.5px]" />
                    </div>
                    <div>
                      <p className="font-black text-black text-sm uppercase tracking-tighter">{t.nome}</p>
                      <p className="text-[10px] font-mono font-bold text-black mt-1 uppercase">{t.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* ── FAQ ── */}
          <motion.section variants={itemVariants} id="faq" className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10 mb-12">
            <div className="flex items-center gap-4 mb-6 border-b-4 border-black pb-4">
              <div className="bg-black text-yellow-400 p-2 border-2 border-black"><ShieldAlert className="w-6 h-6 stroke-[3px]" /></div>
              <h2 className="font-black text-black uppercase tracking-tighter text-2xl">PERGUNTAS FREQUENTES</h2>
            </div>
            <FaqAccordion items={faqItems} />
          </motion.section>

        </motion.div>
      </div>
    </div>
  );
}
