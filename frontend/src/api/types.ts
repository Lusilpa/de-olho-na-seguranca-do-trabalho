/**
 * types.ts
 *
 * Tipos TypeScript que espelham exatamente os schemas de resposta do backend
 * FastAPI. Qualquer alteração no contrato da API deve ser refletida aqui.
 */

// ── /api/dashboard/resumo ──────────────────────────────────────────────────────

export interface KPIs {
  total_cats: number;
  obitos: number;
  com_afastamento: number;
}

/** Ranking de CIDs: chave é o código CID-10, valor é a contagem */
export type RankingCids = Record<string, number>;

export interface ResumoResponse {
  kpis: KPIs;
  ranking_cids: RankingCids;
}

// ── /api/dashboard/evolucao ───────────────────────────────────────────────────

export interface EvolucaoItem {
  /** Período: "YYYY" (modo anual) ou "YYYY-MM" (modo mensal) */
  periodo: string;
  cats: number;
}

export type EvolucaoModo = 'mensal' | 'anual';

// ── /api/dashboard/faixa-etaria ──────────────────────────────────────────────

export interface FaixaEtariaItem {
  faixa: string;
  quantidade: number;
}

// ── /api/dashboard/top-estados ───────────────────────────────────────────────

export interface TopEstadoItem {
  uf: string;
  /** Valor já formatado: "12k" ou "900" */
  registros: string;
  percentual: number;
}

// ── /api/dashboard/sexo ──────────────────────────────────────────────────────

export interface SexoItem {
  genero: string;
  percentual: number;
}

// ── /api/dashboard/parte-corpo ───────────────────────────────────────────────

export interface ParteCorpoItem {
  parte: string;
  percentual: number;
}

// ── /api/dashboard/setor-economico ───────────────────────────────────────────

export interface SetorEconomicoItem {
  setor: string;
  quantidade: number;
}

// ── /api/dashboard/tipo-acidente ─────────────────────────────────────────────

export interface TipoAcidenteItem {
  name: string;
  /** Valor já formatado pelo backend: "12k" ou "900" */
  valorAbsoluto: string;
  percentual: number;
}

// ── Parâmetros de filtro compartilhados ──────────────────────────────────────

export interface FiltroBase {
  cnae?: string;
  uf?: string;
}

// ── /api/cnpj/{cnpj} ─────────────────────────────────────────────────────────

export interface EmpresaData {
  razao_social: string;
  nome_fantasia: string;
  ano_fundacao: string;
  telefone: string;
  endereco: string;
  situacao: string;
  atividades: string;
  cnae_codigo: string;
}

export interface CatHistoricoItem {
  'Data Acidente': string;
  'CID-10': string;
  'Tipo do Acidente': string;
}

export interface RiscoData {
  registros: number;
  selo: 'Gama' | 'Alpha' | 'Beta' | 'Sem Selo';
  historico: CatHistoricoItem[];
}

export interface CnpjResponse {
  /** Dados cadastrais da Receita Federal. Pode ser null se o CNPJ não for encontrado na BrasilAPI */
  empresa: EmpresaData | null;
  /** Histórico de CATs na base interna + Selo de Risco */
  risco: RiscoData;
}

// ── /api/dashboard/registros ──────────────────────────────────────────────────

export interface CatRecord {
  data_acidente: string;
  uf: string;
  municipio: string;
  tipo: string;
  cid: string;
  parte_corpo: string;
  sexo: string;
  obito: boolean;
  afastamento: boolean;
}

export interface RegistrosResponse {
  total: number;
  pagina: number;
  por_pagina: number;
  total_paginas: number;
  registros: CatRecord[];
}


