import { useState, useEffect } from 'react';

// Criando um interface para tipar os dados que virão do backend
interface DadosUF {
  uf: string;          // Ex: "SP"
  registros: string;   // Ex: "892k"
  percentual: number;  // Ex: 23.2
}

// Componente que renderiza o card de Top Estados
export function TopEstados() {
  const [dados, setDados] = useState<DadosUF[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setCarregando(true);
        // Ajuste esta URL para a rota real do seu main.py
        const resposta = await fetch('http://localhost:8000/api/dashboard/top-estados');
        const json = await resposta.json();
        
        // Garante que o array tenha no máximo 5 itens (Top 5)
        setDados(json.slice(0, 5));
      } catch (erro) {
        console.error("Erro ao carregar estados:", erro);
      } finally {
        setCarregando(false);
      }
    };

    buscarDados();
  }, []);

  // Pega o maior percentual para calcular o preenchimento proporcional das barras
  const maiorPercentual = dados.length > 0 ? dados[0].percentual : 100;

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col w-full h-full min-h-380px">
      
      {/* Cabeçalho */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
          5 UF com maiores índices de CATs
        </h2>
      </div>

      {carregando ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 font-medium animate-pulse gap-3">
          <svg className="animate-spin h-8 w-8 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Mapeando estados...
        </div>
      ) : (
        <div className="flex flex-col gap-5 mt-auto">
          {dados.map((item) => {
            // Calcula a largura em relação ao 1º colocado do array
            const larguraBarra = (item.percentual / maiorPercentual) * 100;

            return (
              <div key={item.uf} className="flex flex-col">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-gray-800 font-bold text-sm">
                    {item.uf}
                  </span>
                  <span className="text-gray-600 text-sm font-medium">
                    {item.registros} <span className="text-gray-400 font-normal ml-1">({item.percentual}%)</span>
                  </span>
                </div>
                
                {/* Fundo da Barra */}
                <div className="w-full bg-gray-100 rounded-full h-2">
                  {/* Preenchimento Laranja Dinâmico */}
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${larguraBarra}%` }}
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