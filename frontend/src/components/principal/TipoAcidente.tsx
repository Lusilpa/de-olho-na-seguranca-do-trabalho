import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

// Criando uma interface para tipar os dados que virão do backend
interface DadosAcidente {
  name: string;          // Ex: "Típico", "Trajeto", "Doença Ocupacional"
  percentual: number;    // Ex: 70
  valorAbsoluto: string; // Ex: "2.6M"
}

// Mapeamento de cores baseado no nome do acidente
const coresAcidente: Record<string, string> = {
  'Típico': '#F59E0B',             // Laranja
  'Trajeto': '#3B82F6',            // Azul
  'Doença Ocupacional': '#EF4444'  // Vermelho
};

export function TipoAcidente() {
  const [dados, setDados] = useState<DadosAcidente[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setCarregando(true);
        const resposta = await fetch('http://localhost:8000/api/dashboard/tipo-acidente');
        const json = await resposta.json();
        setDados(json);
      } catch (erro) {
        console.error("Erro ao carregar tipos de acidente:", erro);
      } finally {
        setCarregando(false);
      }
    };

    buscarDados();
  }, []);

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col justify-between w-full h-full min-h-380px">
      
      {/* Cabeçalho */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
          Tipo de Acidente
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Distribuição por classificação
        </p>
      </div>

      {carregando ? (
         <div className="flex-1 flex flex-col items-center justify-center text-gray-400 font-medium animate-pulse gap-3">
            <svg className="animate-spin h-8 w-8 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Carregando classificações...
         </div>
      ) : (
        <>
          {/* Legenda Customizada */}
          <div className="flex justify-between items-center mb-6 px-2">
            {dados.map((item) => (
              <div key={item.name} className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <div 
                    className="w-1 h-3.5 rounded-full" 
                    style={{ backgroundColor: coresAcidente[item.name] || '#CBD5E1' }}
                  ></div>
                  <span className="text-gray-500 text-sm font-medium">{item.name}</span>
                </div>
                <span className="text-2xl font-bold text-gray-800 pl-3">
                  {item.percentual}%
                </span>
              </div>
            ))}
          </div>

          {/* Gráfico Half-Donut */}
          <div className="h-160px w-full relative flex justify-center overflow-hidden mt-auto">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={dados}
                  cx="50%"
                  cy="50%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={90}
                  outerRadius={130}
                  paddingAngle={3}
                  dataKey="percentual"
                  stroke="none"
                >
                  {dados.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={coresAcidente[entry.name] || '#CBD5E1'} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}