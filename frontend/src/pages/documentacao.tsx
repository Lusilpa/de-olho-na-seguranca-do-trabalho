export default function Documentacao() {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Documentação da Plataforma</h2>

      <div className="prose prose-orange max-w-none text-gray-600">
        <h3>Sobre os Dados</h3>
        <p>
          Os dados apresentados nesta plataforma são oriundos do Portal de Dados Abertos do Governo Federal,
          especificamente das bases de Comunicações de Acidente de Trabalho (CAT).
        </p>

        <h3>O que é uma CAT?</h3>
        <p>
          A Comunicação de Acidente de Trabalho (CAT) é um documento emitido para reconhecer
          tanto um acidente de trabalho ou de trajeto bem como uma doença ocupacional.
          A empresa é obrigada a informar à Previdência Social todos os acidentes de trabalho.
        </p>

        <h3>Classificação de Selos</h3>
        <ul>
          <li><strong>Selo Gama:</strong> CNPJ sem registros nos últimos 5 anos.</li>
          <li><strong>Selo Alpha:</strong> CNPJ com 1 a 9 registros.</li>
          <li><strong>Selo Beta:</strong> CNPJ com 10 a 99 registros.</li>
          <li><strong>Sem Selo:</strong> Mais de 100 registros.</li>
        </ul>

        <h3>Sobre o Código CNAE</h3>
        <p>
          O CNAE (Classificação Nacional de Atividades Econômicas) é um sistema de classificação
          de atividades econômicas utilizado no Brasil. Ele é utilizado para classificar as
          atividades econômicas de empresas e organizações.
        </p>

        <h3>Dados da Empresa</h3>
        <p>
          Os dados da empresa são obtidos através da Brasil API, uma API pública que fornece dados
          públicos de empresas e organizações cadastradas no Brasil.
        </p>
      </div>
    </div>
  );
}
