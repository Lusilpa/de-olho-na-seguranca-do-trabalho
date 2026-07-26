"""
cnpj.py

Router responsável pela consulta de empresas por CNPJ.

Combina duas fontes de dados:
  1. BrasilAPI — dados cadastrais da Receita Federal (via cnpj_service)
  2. Base interna de CATs — histórico de acidentes e Selo de Risco (via data_service)

Rate limiting simples via cache em memória — evita bloqueio da BrasilAPI
por excesso de requisições ao mesmo CNPJ em janelas curtas de tempo.
"""

import time
from collections import defaultdict
import pandas as pd
from fastapi import APIRouter, HTTPException, Path, Request, Depends

from app.services.cnpj_service import consultar_cnpj_na_receita_federal, extrair_dados_empresa
from app.services.data_service import obter_historico_cnpj
from app.api.deps import get_df_cat

router = APIRouter(prefix="/api/cnpj", tags=["CNPJ"])

# ── Cache simples em memória (TTL por CNPJ) ───────────────────────────────────
# Estrutura: { cnpj: { "ts": timestamp, "data": resultado } }
_cache: dict[str, dict] = {}
_CACHE_TTL = 300  # 5 minutos

# ── Rate limit por IP ─────────────────────────────────────────────────────────
# Máximo de 10 requisições por minuto por IP
_ip_requests: dict[str, list[float]] = defaultdict(list)
_RATE_WINDOW = 60   # segundos
_RATE_LIMIT = 10    # máximo de requisições por janela


def _check_rate_limit(ip: str) -> None:
    agora = time.time()
    # Mantém apenas timestamps dentro da janela
    _ip_requests[ip] = [ts for ts in _ip_requests[ip] if agora - ts < _RATE_WINDOW]
    if len(_ip_requests[ip]) >= _RATE_LIMIT:
        raise HTTPException(
            status_code=429,
            detail=f"Muitas requisições. Aguarde {_RATE_WINDOW} segundos e tente novamente.",
        )
    _ip_requests[ip].append(agora)


@router.get("/{cnpj}", summary="Consulta empresa por CNPJ")
def consultar_empresa(
    request: Request,
    cnpj: str = Path(
        ...,
        description="CNPJ da empresa (com ou sem formatação)",
        min_length=14,
        max_length=18,
    ),
    df_cat: pd.DataFrame = Depends(get_df_cat)
):
    """
    Retorna dados cadastrais da empresa e seu histórico de CATs na base interna.

    - **empresa**: dados da Receita Federal via BrasilAPI (pode ser null se CNPJ não encontrado)
    - **risco**: Selo de Risco + total de CATs + histórico de ocorrências na base interna
    - Resultado em cache por 5 minutos por CNPJ
    - Rate limit: 10 req/min por IP
    """
    # Rate limiting por IP
    ip = request.client.host if request.client else "unknown"
    _check_rate_limit(ip)

    # Limpa o CNPJ para uso interno
    cnpj_limpo = "".join(filter(str.isdigit, cnpj))

    if len(cnpj_limpo) != 14:
        raise HTTPException(
            status_code=422,
            detail="CNPJ inválido. Informe os 14 dígitos numéricos.",
        )

    # Cache hit — evita chamada desnecessária à BrasilAPI
    agora = time.time()
    cached = _cache.get(cnpj_limpo)
    if cached and (agora - cached["ts"]) < _CACHE_TTL:
        return cached["data"]

    # Consulta 1: dados cadastrais (BrasilAPI — pode falhar sem interromper)
    dados_brutos = consultar_cnpj_na_receita_federal(cnpj_limpo)
    empresa = extrair_dados_empresa(dados_brutos)

    # Consulta 2: histórico de CATs e Selo de Risco (base interna)
    historico = obter_historico_cnpj(df_cat, cnpj_limpo)

    resultado = {"empresa": empresa, "risco": historico}

    # Salva no cache
    _cache[cnpj_limpo] = {"ts": agora, "data": resultado}

    return resultado
