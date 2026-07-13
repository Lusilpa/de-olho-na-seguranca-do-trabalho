import { useState, useEffect } from 'react';
import { 
  ComposedChart, 
  Area, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  LabelList,
  Cell
} from 'recharts';

// Contrato dos dados vindos da sua FastAPI
interface DadosSetor {
  setor: string;      // Ex: "Indústria", "Comércio", "Construção"
  quantidade: number; // Ex: 68, 46, 38 (os valores para o eixo Y)
}

export function SetorEconomico() {
  const [dados, setDados] = useState<DadosSetor[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setCarregando(true);
        const resposta = await fetch('http://localhost:8000/api/dashboard/setor-economico');
        const json = await resposta.json();
        
        setDados(json);
      } catch (erro) {
        console.error("Erro ao carregar os dados do setor econômico:", erro);
      } finally {
        setCarregando(false);
      }
    };

    buscarDados();
  }, []);

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col w-full h-full min-h-400px">
      
      {/* Cabeçalho */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
            Setor Econômico
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Distribuição de CATs por atividade 
          </p>
        </div>
      </div>

      {carregando ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 font-medium animate-pulse gap-3">
          <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Carregando dados dos setores...
        </div>
      ) : (
        <div className="h-280px w-full mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            {/* ComposedChart permite misturar Área e Barras */}
            <ComposedChart
              data={dados}
              margin={{ top: 20, right: 0, bottom: 0, left: -20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              
              <XAxis 
                dataKey="setor" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                dy={10}
              />
              
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />

              {/* A sombra de fundo em formato de funil conectando os centros das barras */}
              <Area 
                type="linear" 
                dataKey="quantidade" 
                fill="#EEF2FF" // Fundo azul/índigo bem claro
                stroke="none" 
              />

              {/* As colunas azuis */}
              <Bar 
                dataKey="quantidade" 
                barSize={40} 
                radius={[4, 4, 0, 0]} // Arredonda apenas as pontas de cima das barras
              >
                {/* Rótulos numéricos no topo de cada barra */}
                <LabelList 
                  dataKey="quantidade" 
                  position="top" 
                  fill="#1F2937" 
                  fontSize={14} 
                  fontWeight={600} 
                  offset={10} 
                />
                
                {/* Lógica para pintar a última barra de uma cor diferente, como na imagem de referência */}
                {dados.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === dados.length - 1 ? '#C084FC' : '#4F46E5'} // Última rosa, restante azul índigo
                  />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}