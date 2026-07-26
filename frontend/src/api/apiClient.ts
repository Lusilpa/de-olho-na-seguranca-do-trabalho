/**
 * apiClient.ts
 *
 * Cliente HTTP centralizado. Toda comunicação com o backend passa por aqui.
 *
 * A URL base é lida da variável de ambiente VITE_API_BASE_URL, permitindo
 * alternar entre ambientes (dev, staging, produção) sem alterar código.
 *
 * Exemplo em `.env`:
 *   VITE_API_BASE_URL=http://localhost:8000
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

/**
 * Classe de erro enriquecida com o status HTTP da resposta.
 */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Wrapper genérico sobre `fetch`.
 *
 * @param path   Caminho relativo da rota, ex: "/api/dashboard/resumo"
 * @param params Parâmetros de query string (valores `undefined` são omitidos)
 * @returns      JSON tipado como `T`
 * @throws       `ApiError` se a resposta não for 2xx
 */
export async function apiFetch<T>(
  path: string,
  params?: Record<string, string | undefined>,
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, value);
      }
    }
  }

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new ApiError(
      `Erro ${response.status}: ${response.statusText}`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}
