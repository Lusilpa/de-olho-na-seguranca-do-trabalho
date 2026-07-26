/**
 * dashboardApi.ts
 *
 * Funções de acesso a cada endpoint do backend relacionado ao Dashboard.
 * Cada função mapeia diretamente para uma rota do router FastAPI.
 *
 * Convenção de nomenclatura:
 *   get<Recurso>(filtros?) → Promise<Tipo>
 */

import { apiFetch } from './apiClient';
import type {
  EvolucaoItem,
  EvolucaoModo,
  FaixaEtariaItem,
  FiltroBase,
  ParteCorpoItem,
  ResumoResponse,
  SetorEconomicoItem,
  SexoItem,
  TipoAcidenteItem,
  TopEstadoItem,
} from './types';

// ── Resumo (KPIs + Ranking CIDs) ─────────────────────────────────────────────

export function getResumo(filtro?: FiltroBase): Promise<ResumoResponse> {
  return apiFetch<ResumoResponse>('/api/dashboard/resumo', {
    cnae: filtro?.cnae,
    uf: filtro?.uf,
  });
}

// ── Evolução Cronológica ──────────────────────────────────────────────────────

export function getEvolucao(
  modo: EvolucaoModo = 'anual',
  ano: string = 'TODOS',
  filtro?: FiltroBase,
): Promise<EvolucaoItem[]> {
  return apiFetch<EvolucaoItem[]>('/api/dashboard/evolucao', {
    modo,
    ano,
    cnae: filtro?.cnae,
    uf: filtro?.uf,
  });
}

// ── Distribuição por Faixa Etária ─────────────────────────────────────────────

export function getFaixaEtaria(filtro?: FiltroBase): Promise<FaixaEtariaItem[]> {
  return apiFetch<FaixaEtariaItem[]>('/api/dashboard/faixa-etaria', {
    cnae: filtro?.cnae,
    uf: filtro?.uf,
  });
}

// ── Top 5 Estados ─────────────────────────────────────────────────────────────

export function getTopEstados(filtro?: FiltroBase): Promise<TopEstadoItem[]> {
  return apiFetch<TopEstadoItem[]>('/api/dashboard/top-estados', {
    cnae: filtro?.cnae,
  });
}

// ── Distribuição por Sexo ─────────────────────────────────────────────────────

export function getSexo(filtro?: FiltroBase): Promise<SexoItem[]> {
  return apiFetch<SexoItem[]>('/api/dashboard/sexo', {
    cnae: filtro?.cnae,
    uf: filtro?.uf,
  });
}

// ── Partes do Corpo mais Atingidas ────────────────────────────────────────────

export function getParteCorpo(filtro?: FiltroBase): Promise<ParteCorpoItem[]> {
  return apiFetch<ParteCorpoItem[]>('/api/dashboard/parte-corpo', {
    cnae: filtro?.cnae,
    uf: filtro?.uf,
  });
}

// ── Top Setores Econômicos (CNAE) ─────────────────────────────────────────────

export function getSetorEconomico(filtro?: FiltroBase): Promise<SetorEconomicoItem[]> {
  return apiFetch<SetorEconomicoItem[]>('/api/dashboard/setor-economico', {
    uf: filtro?.uf,
  });
}

// ── Tipologia de Acidente ─────────────────────────────────────────────────────

export function getTipoAcidente(filtro?: FiltroBase): Promise<TipoAcidenteItem[]> {
  return apiFetch<TipoAcidenteItem[]>('/api/dashboard/tipo-acidente', {
    cnae: filtro?.cnae,
    uf: filtro?.uf,
  });
}

// ── Registros Paginados (Página de Filtros) ───────────────────────────────────

export interface FiltroRegistros {
  ano?: string;
  uf?: string;
  tipo?: string;
  cid?: string;
  pagina?: number;
  por_pagina?: number;
}

export function getRegistros(filtro?: FiltroRegistros): Promise<import('./types').RegistrosResponse> {
  return apiFetch('/api/dashboard/registros', {
    ano: filtro?.ano,
    uf: filtro?.uf,
    tipo: filtro?.tipo,
    cid: filtro?.cid,
    pagina: filtro?.pagina?.toString(),
    por_pagina: filtro?.por_pagina?.toString(),
  });
}

