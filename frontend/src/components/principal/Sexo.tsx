import { useState, useEffect } from 'react';

interface DadosSexo {
  genero: string;      // "Masculino" ou "Feminino"
  percentual: number;  // Ex: 70
}

export function Sexo() {
  const [dados, setDados] = useState<DadosSexo[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setCarregando(true);
        const resposta = await fetch('http://localhost:8000/api/dashboard/sexo');
        const json = await resposta.json();
        setDados(json);
      } catch (erro) {
        console.error("Erro ao carregar dados por sexo:", erro);
      } finally {
        setCarregando(false);
      }
    };
    buscarDados();
  }, []);

  // Define a cor da barra baseada no gênero
  const definirCor = (genero: string) => {
    if (genero.toLowerCase().includes('masculino')) return '#3B82F6'; // Azul
    if (genero.toLowerCase().includes('feminino')) return '#EC4899';  // Rosa
    return '#9CA3AF'; // Cinza para não-informado ou outros
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col w-full h-full min-h-420px">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Sexo</h2>
        <p className="text-gray-500 text-sm mt-1">Distribuição por gênero</p>
      </div>

      {carregando ? (
        <div className="flex-1 flex justify-center items-center text-gray-400 animate-pulse">
          Calculando distribuição...
        </div>
      ) : (
        <div className="flex flex-col gap-8 mt-2">
          {dados.map((item) => (
            <div key={item.genero} className="flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-900 font-semibold text-base">{item.genero}</span>
                <span className="text-gray-900 font-bold text-xl">{item.percentual}%</span>
              </div>
              <div className="w-full bg-gray-50 rounded-full h-3.5">
                <div 
                  className="h-3.5 rounded-full transition-all duration-1000 ease-out" 
                  style={{ 
                    width: `${item.percentual}%`, 
                    backgroundColor: definirCor(item.genero) 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}