/**
 * useDashboard.ts
 *
 * Hook customizado que busca todos os dados necessários para o Dashboard
 * em paralelo (Promise.allSettled), gerenciando os estados de carregamento
 * e erro de forma centralizada.
 *
 * O uso de `allSettled` (em vez de `all`) garante que um endpoint com falha
 * não cancela os demais — o Dashboard exibirá o que for possível.
 */

import { useEffect, useState } from 'react';
import type { FiltroBase } from '../api/types';
import {
  getEvolucao,
  getFaixaEtaria,
  getParteCorpo,
  getResumo,
  getSetorEconomico,
  getSexo,
  getTipoAcidente,
  getTopEstados,
} from '../api/dashboardApi';
import type {
  EvolucaoItem,
  FaixaEtariaItem,
  ParteCorpoItem,
  ResumoResponse,
  SetorEconomicoItem,
  SexoItem,
  TipoAcidenteItem,
  TopEstadoItem,
} from '../api/types';

export interface DashboardData {
  resumo: ResumoResponse | null;
  evolucao: EvolucaoItem[];
  faixaEtaria: FaixaEtariaItem[];
  topEstados: TopEstadoItem[];
  sexo: SexoItem[];
  parteCorpo: ParteCorpoItem[];
  setorEconomico: SetorEconomicoItem[];
  tipoAcidente: TipoAcidenteItem[];
}

export interface UseDashboardReturn {
  data: DashboardData;
  loading: boolean;
  error: string | null;
}

/** Estado inicial vazio (evita `undefined` nos componentes filhos) */
const INITIAL_DATA: DashboardData = {
  resumo: null,
  evolucao: [],
  faixaEtaria: [],
  topEstados: [],
  sexo: [],
  parteCorpo: [],
  setorEconomico: [],
  tipoAcidente: [],
};

/**
 * Extrai o valor de um `PromiseSettledResult`, retornando o fallback
 * em caso de rejeição e logando o erro no console.
 */
function unwrap<T>(result: PromiseSettledResult<T>, fallback: T, label: string): T {
  if (result.status === 'fulfilled') return result.value;
  console.error(`[useDashboard] Falha ao buscar "${label}":`, result.reason);
  return fallback;
}

/**
 * @param filtro  Filtros opcionais de CNAE e UF aplicados a todas as requisições
 */
export function useDashboard(filtro?: FiltroBase): UseDashboardReturn {
  const [data, setData] = useState<DashboardData>(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Serializar o filtro para usar como dependência estável no useEffect
  const filtroKey = JSON.stringify(filtro ?? {});

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      setLoading(true);
      setError(null);

      try {
        const [
          resumoResult,
          evolucaoResult,
          faixaEtariaResult,
          topEstadosResult,
          sexoResult,
          parteCorpoResult,
          setorEconomicoResult,
          tipoAcidenteResult,
        ] = await Promise.allSettled([
          getResumo(filtro),
          getEvolucao('anual', 'TODOS', filtro),
          getFaixaEtaria(filtro),
          getTopEstados(filtro),
          getSexo(filtro),
          getParteCorpo(filtro),
          getSetorEconomico(filtro),
          getTipoAcidente(filtro),
        ]);

        if (cancelled) return;

        setData({
          resumo: unwrap(resumoResult, null, 'resumo'),
          evolucao: unwrap(evolucaoResult, [], 'evolucao'),
          faixaEtaria: unwrap(faixaEtariaResult, [], 'faixa-etaria'),
          topEstados: unwrap(topEstadosResult, [], 'top-estados'),
          sexo: unwrap(sexoResult, [], 'sexo'),
          parteCorpo: unwrap(parteCorpoResult, [], 'parte-corpo'),
          setorEconomico: unwrap(setorEconomicoResult, [], 'setor-economico'),
          tipoAcidente: unwrap(tipoAcidenteResult, [], 'tipo-acidente'),
        });
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : 'Erro desconhecido ao conectar com a API.';
          setError(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();

    // Cleanup: cancela a atualização de estado se o componente desmontar
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroKey]);

  return { data, loading, error };
}
