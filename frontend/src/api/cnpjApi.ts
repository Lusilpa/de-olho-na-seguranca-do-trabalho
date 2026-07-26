/**
 * cnpjApi.ts
 *
 * Função de acesso ao endpoint de consulta por CNPJ.
 * Combina dados cadastrais (BrasilAPI) com histórico de CATs (base interna).
 */

import { apiFetch } from './apiClient';
import type { CnpjResponse } from './types';

/**
 * Consulta dados de uma empresa e seu histórico de CATs pelo CNPJ.
 *
 * @param cnpj CNPJ com ou sem formatação (ex: "11.222.333/0001-81" ou "11222333000181")
 */
export function getCnpj(cnpj: string): Promise<CnpjResponse> {
  // Remove formatação antes de enviar — o backend também faz isso, mas é bom ser explícito
  const cnpjLimpo = cnpj.replace(/\D/g, '');
  return apiFetch<CnpjResponse>(`/api/cnpj/${cnpjLimpo}`);
}
