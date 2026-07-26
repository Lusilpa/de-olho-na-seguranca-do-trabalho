/**
 * useCnpj.ts
 *
 * Hook que gerencia o ciclo de vida da consulta por CNPJ:
 *   idle → loading → success | error
 *
 * A busca é disparada externamente pela função `buscar(cnpj)`,
 * tipicamente chamada no evento onBlur do input.
 */

import { useState, useCallback } from 'react';
import { getCnpj } from '../api/cnpjApi';
import { ApiError } from '../api/apiClient';
import type { CnpjResponse } from '../api/types';

export type CnpjStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UseCnpjReturn {
  status: CnpjStatus;
  data: CnpjResponse | null;
  error: string | null;
  buscar: (cnpj: string) => Promise<void>;
  limpar: () => void;
}

export function useCnpj(): UseCnpjReturn {
  const [status, setStatus] = useState<CnpjStatus>('idle');
  const [data, setData] = useState<CnpjResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buscar = useCallback(async (cnpj: string) => {
    const cnpjLimpo = cnpj.replace(/\D/g, '');

    // Não dispara se vazio ou incompleto
    if (cnpjLimpo.length !== 14) {
      setStatus('error');
      setError('CNPJ deve conter 14 dígitos.');
      setData(null);
      return;
    }

    setStatus('loading');
    setError(null);
    setData(null);

    try {
      const resultado = await getCnpj(cnpjLimpo);
      setData(resultado);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      if (err instanceof ApiError) {
        if (err.status === 404 || err.status === 422) {
          setError('CNPJ não encontrado ou inválido.');
        } else {
          setError(`Erro ao consultar CNPJ: ${err.message}`);
        }
      } else {
        setError('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      }
    }
  }, []);

  const limpar = useCallback(() => {
    setStatus('idle');
    setData(null);
    setError(null);
  }, []);

  return { status, data, error, buscar, limpar };
}
