import { useState } from 'react';

interface HistoricoCAT {
  "Data Acidente": string;
  "CID-10": string;
  "Tipo do Acidente": string;
}

interface DadosEmpresa {
  razao_social: string;
  nome_fantasia: string;
  ano_fundacao: string;
  telefone: string;
  endereco: string;
  situacao: string;
  atividades: string;
}

interface DadosCNPJ {
  cnpj: string;
  registros: number;
  selo: string;
  historico: HistoricoCAT[];
  empresa?: DadosEmpresa | null;
  erro?: string;
}

export default function Filtros() {
  const [cnpj, setCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<DadosCNPJ | null>(null);

  const buscarSeloCNPJ = async () => {
    if (!cnpj) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/cnpj/${cnpj.replace(/\D/g, '')}`);
      const data = await response.json();
      setResultado(data);
    } catch (err) {
      console.error("Erro na busca de CNPJ:", err);
    } finally {
      setLoading(false);
    }
  };

  const getSeloCor = (selo: string) => {
    switch (selo) {
      case 'Gama': return 'bg-green-100 text-green-700 border-green-200';
      case 'Alpha': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Beta': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getSeloDescricao = (selo: string) => {
    switch (selo) {
      case 'Gama': return 'Nenhum registro de CAT nos últimos 5 anos. Excelente ambiente.';
      case 'Alpha': return 'Menos de 10 registros. Monitoramento recomendado.';
      case 'Beta': return 'Mais de 10 registros. Risco elevado, requer intervenção.';
      default: return 'Mais de 100 registros. Situação crítica.';
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Consulta de Selos de Segurança</h2>
        <p className="text-gray-500 mb-6">Digite um CNPJ para verificar o histórico de acidentes e descobrir a classificação de risco da empresa.</p>
        
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Digite o CNPJ..." 
            value={cnpj}
            onChange={e => setCnpj(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
          />
          <button 
            onClick={buscarSeloCNPJ}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Buscando...' : 'Pesquisar CNPJ'}
          </button>
        </div>
      </div>

      {resultado && !resultado.erro && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card do Selo */}
          <div className={`col-span-1 border rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-sm ${getSeloCor(resultado.selo)}`}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-2 opacity-80">Classificação Atual</h3>
            <span className="text-5xl font-black mb-4">Selo {resultado.selo}</span>
            <p className="text-sm font-medium opacity-90">{getSeloDescricao(resultado.selo)}</p>
            <div className="mt-6 bg-white/50 px-4 py-2 rounded-lg font-bold border border-current">
              {resultado.registros} Registros Encontrados
            </div>
          </div>

          {/* Dados da Empresa (Brasil API) */}
          {resultado.empresa && (
            <div className="col-span-1 md:col-span-2 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col justify-center">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                Dados da Empresa (Receita Federal)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400 font-medium block">Razão Social</span>
                  <span className="text-gray-800 font-semibold">{resultado.empresa.razao_social}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Nome Fantasia</span>
                  <span className="text-gray-800 font-semibold">{resultado.empresa.nome_fantasia}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">CNPJ</span>
                  <span className="text-gray-800 font-semibold">{resultado.cnpj}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Fundação</span>
                  <span className="text-gray-800 font-semibold">{resultado.empresa.ano_fundacao}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Situação Cadastral</span>
                  <span className="text-gray-800 font-semibold">{resultado.empresa.situacao}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-medium block">Telefone</span>
                  <span className="text-gray-800 font-semibold">{resultado.empresa.telefone}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-400 font-medium block">Endereço</span>
                  <span className="text-gray-800 font-semibold">{resultado.empresa.endereco}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-gray-400 font-medium block">Atividades</span>
                  <span className="text-gray-800 font-semibold">{resultado.empresa.atividades}</span>
                </div>
              </div>
            </div>
          )}

          {/* Histórico Recente */}
          <div className="col-span-1 md:col-span-3 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              Histórico Recente de CATs
            </h3>
            
            {resultado.historico.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="text-xs uppercase bg-gray-50 text-gray-700 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Data</th>
                      <th className="px-4 py-3">CID-10</th>
                      <th className="px-4 py-3 rounded-tr-lg">Tipo do Acidente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.historico.map((cat, idx) => (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium">{cat["Data Acidente"]}</td>
                        <td className="px-4 py-3">{cat["CID-10"]}</td>
                        <td className="px-4 py-3">
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs font-semibold">
                            {cat["Tipo do Acidente"]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 p-8 border-2 border-dashed border-gray-100 rounded-xl">
                Nenhum acidente registrado para este CNPJ nos dados carregados.
              </div>
            )}
          </div>
          
        </div>
      )}
      
      {resultado?.erro && (
        <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-xl text-center font-medium">
          {resultado.erro}
        </div>
      )}
    </div>
  );
}
