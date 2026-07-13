import 
{ 
    useState, 
    useEffect 
} from 'react';

import 
{ 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    ResponsiveContainer, 
    Tooltip 
} from 'recharts';

interface DadosFaixaEtaria {
  faixa: string;      // Ex: "18-24", "25-34"
  quantidade: number; // Ex: 580000, 1080000
}

export function FaixaEtaria() {
  const [dados, setDados] = useState<DadosFaixaEtaria[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        setCarregando(true);
        const resposta = await fetch('http://localhost:8000/api/dashboard/faixa-etaria');
        const json = await resposta.json();
        setDados(json);
      } catch (erro) {
        console.error("Erro ao carregar dados de faixa etária:", erro);
      } finally {
        setCarregando(false);
      }
    };
    buscarDados();
  }, []);

  const formatarEixoY = (valor: number) => valor === 0 ? '0k' : `${valor / 1000}k`;

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col w-full h-full min-h-420px">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 uppercase tracking-wide">Faixa Etária</h2>
        <p className="text-gray-500 text-sm mt-1">Distribuição por idade</p>
      </div>

      {carregando ? (
        <div className="flex-1 flex justify-center items-center text-gray-400 animate-pulse">
          Carregando idades...
        </div>
      ) : (
        <div className="h-280px w-full mt-auto">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dados} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="faixa" 
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
              <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none' }} />
              {/* barCategoryGap muito pequeno para juntar as barras como num histograma */}
              <Bar dataKey="quantidade" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={45} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}