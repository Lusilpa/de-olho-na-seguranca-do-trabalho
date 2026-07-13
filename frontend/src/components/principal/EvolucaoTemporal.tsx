import { useState, useEffect } from 'react';

import { 
  AreaChart,           // Container principal que define o tipo do gráfico (área)
  Area,                // A linha do gráfico em si e o seu preenchimento (degradê)
  XAxis,               // Eixo horizontal (renderiza a linha do tempo: meses ou anos)
  YAxis,               // Eixo vertical (renderiza a escala de valores: ex: 50k, 100k)
  CartesianGrid,       // Desenha as linhas pontilhadas de grade no fundo do gráfico
  Tooltip,             // A caixa de detalhes que flutua quando passamos o mouse sobre a linha
  ResponsiveContainer  // Garante que o gráfico se ajuste automaticamente à largura do card
} from 'recharts';

// Contrato dos dados que a sua FastAPI
interface DadosEvolucao {
  periodo: string; // Ex: "Jan/21" ou "2021"
  cats: number;    // Ex: 42000
}

export function EvolucaoTemporal() {
  // Estados dos Filtros
  const [modoVisualizacao, setModoVisualizacao] = useState<'mensal' | 'anual'>('mensal');
  const [anoSelecionado, setAnoSelecionado] = useState<string>('TODOS');

  // Estados de Conexão com a API
  const [dadosGrafico, setDadosGrafico] = useState<DadosEvolucao[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  // Efeito Colateral: Bate no Backend sempre que o modo ou o ano mudarem
  useEffect(() => {
    const buscarDadosDoBackend = async () => {
      setCarregando(true);
      try {
        // Passamos as variáveis dinâmicas para o Python filtrar via Query Params
        const url = `http://localhost:8000/api/dashboard/evolucao?modo=${modoVisualizacao}&ano=${anoSelecionado}`;
        
        const resposta = await fetch(url);
        const dados = await resposta.json();
        
        setDadosGrafico(dados);
      } catch (erro) {
        console.error("Erro ao conectar com o motor de dados em Python:", erro);
      } finally {
        setCarregando(false);
      }
    };

    buscarDadosDoBackend();
  }, [modoVisualizacao, anoSelecionado]); // O gatilho: se essas variáveis mudarem, roda o fetch de novo

  // Formatação visual do eixo Y
  const formatarEixoY = (valor: number) => {
    if (valor === 0) return '0k';
    return `${valor / 1000}k`;
  };

  const anosDisponiveis = ['TODOS', '2021', '2022', '2023', '2024', '2025', '2026'];

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm w-full">
      
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
            Evolução Temporal de CATs
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Total de CATs registradas por período — janeiro 2021 a maio 2026 (dados reais e estimados). Acompanhe a evolução e identifique tendências ao longo do tempo.
        </p>
      </div>

      {/* Abas e Botões Dinâmicos */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        
        {/* Mensal / Anual */}
        <div className="bg-gray-50 p-1 flex rounded-xl border border-gray-100">
          <button
            onClick={() => setModoVisualizacao('mensal')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              modoVisualizacao === 'mensal' 
                ? 'bg-white text-gray-800 shadow-sm border border-gray-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setModoVisualizacao('anual')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              modoVisualizacao === 'anual' 
                ? 'bg-white text-gray-800 shadow-sm border border-gray-200' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Anual
          </button>
        </div>

        {/* Botões Dinâmicos da Direita */}
        <div>
          {modoVisualizacao === 'mensal' ? (
            <div className="flex gap-2 flex-wrap">
              {anosDisponiveis.map((ano) => (
                <button
                  key={ano}
                  onClick={() => setAnoSelecionado(ano)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    anoSelecionado === ano
                      ? 'bg-orange-50 text-orange-600 border border-orange-200'
                      : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {ano}
                </button>
              ))}
            </div>
          ) : (
            <button 
              onClick={() => alert("Ação de comparar acionada! Módulo futuro.")}
              className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              Comparar Dados por Períodos
            </button>
          )}
        </div>
      </div>

      {/* Container do Gráfico */}
      <div className="h-350px w-full mt-4 flex items-center justify-center">
        {carregando ? (
          // Feedback visual enquanto o Python pensa
          <div className="text-gray-400 font-medium animate-pulse flex flex-col items-center gap-3">
             <svg className="animate-spin h-8 w-8 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
             Calculando dados do período...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={dadosGrafico}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="corLaranja" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f0f0f0" />
              <XAxis 
                dataKey="periodo" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                tickFormatter={formatarEixoY}
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Area 
                type="monotone" 
                dataKey="cats" 
                stroke="#F59E0B" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#corLaranja)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

    </div>
  );
}