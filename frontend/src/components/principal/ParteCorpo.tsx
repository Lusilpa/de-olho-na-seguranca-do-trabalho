import { useState, useEffect } from 'react';

interface DadosParteCorpo {
  parte: string;       // Ex: "Mãos e Dedos"
  percentual: number;  // Ex: 22
}

const coresCalor = ['#EF4444', '#F97316', '#F59E0B', '#EAB308', '#FBBF24', '#FCD34D', '#FDE047', '#FEF08A'];

export function ParteCorpo() {
  const [dados, setDados] = useState<DadosParteCorpo[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setCarregando(true);
        const resposta = await fetch('http://localhost:8000/api/dashboard/parte-corpo');
        const json = await resposta.json();
        setDados(json);
      } catch (erro) {
        console.error("Erro ao carregar partes do corpo:", erro);
      } finally {
        setCarregando(false);
      }
    };
    buscarDados();
  }, []);

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col w-full h-full min-h-420px">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Parte do Corpo</h2>
        <p className="text-gray-500 text-sm mt-1">Regiões mais atingidas</p>
      </div>

      {carregando ? (
        <div className="flex-1 flex justify-center items-center text-gray-400 animate-pulse">
          Mapeando anatomia...
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-2">
          {dados.map((item, index) => {
            // Pega a cor correspondente ou repete a última se a lista for muito grande
            const corAtual = coresCalor[index] || coresCalor[coresCalor.length - 1];

            return (
              <div key={item.parte} className="flex flex-col">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-gray-900 font-semibold text-sm">{item.parte}</span>
                  <span className="text-gray-500 text-sm">{item.percentual}%</span>
                </div>
                <div className="w-full bg-gray-50 rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${item.percentual}%`, backgroundColor: corAtual }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}