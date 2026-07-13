import { useState, useEffect } from 'react';
import { Card } from '../components/principal/card';
import { EvolucaoTemporal } from '../components/principal/EvolucaoTemporal';
import { FaixaEtaria } from '../components/principal/FaixaEtaria';
import { TopEstados } from '../components/principal/TopEstados';
import { Sexo } from '../components/principal/Sexo';
import { ParteCorpo } from '../components/principal/ParteCorpo';
import { SetorEconomico } from '../components/principal/SetorEconomico';
import { TipoAcidente } from '../components/principal/TipoAcidente';

export default function Home() {
  const [kpis, setKpis] = useState({
    total_cats: 0,
    obitos: 0,
    com_afastamento: 0
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/dashboard/resumo')
      .then(res => res.json())
      .then(data => {
        if (data && data.kpis) {
          setKpis(data.kpis);
        }
      })
      .catch(err => console.error("Erro ao carregar KPIs:", err));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          mainValue={kpis.total_cats.toLocaleString('pt-BR')} 
          subtitle="Total de CATs" 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>}
          color="orange"
        />
        <Card 
          mainValue={kpis.obitos.toLocaleString('pt-BR')} 
          subtitle="Óbitos" 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>}
          color="red"
        />
        <Card 
          mainValue={kpis.com_afastamento.toLocaleString('pt-BR')} 
          subtitle="Com Afastamento" 
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>}
          color="blue"
        />
      </div>

      {/* Main Chart */}
      <div className="w-full">
        <EvolucaoTemporal />
      </div>

      {/* Grid of smaller charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FaixaEtaria />
        <TopEstados />
        <Sexo />
        <ParteCorpo />
        <SetorEconomico />
        <TipoAcidente />
      </div>
      
    </div>
  );
}
