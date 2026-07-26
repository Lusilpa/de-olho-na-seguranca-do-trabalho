from fastapi import APIRouter, Query, Depends
from typing import Optional
import pandas as pd
from app.services import data_service
from app.api.deps import get_df_cat

router = APIRouter(tags=["Dashboard"])

@router.get("/api/dashboard/resumo")
def obter_resumo_cats(
        cnae: Optional[str] = Query(None, description="Código CNAE 2.0"),
        uf: Optional[str] = Query(None, description="Sigla da UF (ex: AM, SP)"),
        df_cat: pd.DataFrame = Depends(get_df_cat)
):
    return data_service.obter_resumo_cats(df_cat, cnae, uf)

@router.get("/api/dashboard/evolucao")
def obter_evolucao(
        modo: str = Query('mensal'),
        ano: str = Query('TODOS'),
        cnae: Optional[str] = Query(None),
        uf: Optional[str] = Query(None),
        df_cat: pd.DataFrame = Depends(get_df_cat)
):
    return data_service.obter_evolucao(df_cat, modo, ano, cnae, uf)

@router.get("/api/dashboard/faixa-etaria")
def obter_faixa_etaria(
        cnae: Optional[str] = Query(None),
        uf: Optional[str] = Query(None),
        df_cat: pd.DataFrame = Depends(get_df_cat)
):
    return data_service.obter_faixa_etaria(df_cat, cnae, uf)

@router.get("/api/dashboard/top-estados")
def obter_top_estados(
        cnae: Optional[str] = Query(None),
        df_cat: pd.DataFrame = Depends(get_df_cat)
):
    return data_service.obter_top_estados(df_cat, cnae)

@router.get("/api/dashboard/sexo")
def obter_sexo(
        cnae: Optional[str] = Query(None),
        uf: Optional[str] = Query(None),
        df_cat: pd.DataFrame = Depends(get_df_cat)
):
    return data_service.obter_sexo(df_cat, cnae, uf)

@router.get("/api/dashboard/parte-corpo")
def obter_parte_corpo(
    cnae: Optional[str] = Query(None, description="Código CNAE 2.0"),
    uf: Optional[str] = Query(None, description="Sigla da UF"),
    df_cat: pd.DataFrame = Depends(get_df_cat)
):
    return data_service.obter_parte_corpo(df_cat, cnae, uf)

@router.get("/api/dashboard/setor-economico")
def obter_setor_economico(
    uf: Optional[str] = Query(None, description="Sigla da UF para filtrar os setores"),
    df_cat: pd.DataFrame = Depends(get_df_cat)
):
    return data_service.obter_setor_economico(df_cat, uf)


@router.get("/api/dashboard/tipo-acidente")
def obter_tipo_acidente(
    cnae: Optional[str] = Query(None, description="Código CNAE 2.0"),
    uf: Optional[str] = Query(None, description="Sigla da UF"),
    df_cat: pd.DataFrame = Depends(get_df_cat)
):
    return data_service.obter_tipo_acidente(df_cat, cnae, uf)


@router.get("/api/dashboard/registros", summary="Registros paginados de CAT")
def obter_registros(
    ano: Optional[str] = Query(None, description="Ano do acidente (ex: 2023) ou omitir para todos"),
    uf: Optional[str] = Query(None, description="Sigla da UF (ex: SP)"),
    tipo: Optional[str] = Query(None, description="Tipo do acidente (ex: Típico)"),
    cid: Optional[str] = Query(None, description="Prefixo do CID-10 (ex: S62)"),
    pagina: int = Query(1, ge=1, description="Número da página"),
    por_pagina: int = Query(10, ge=1, le=100, description="Registros por página"),
    df_cat: pd.DataFrame = Depends(get_df_cat)
):
    return data_service.obter_registros(df_cat, ano, uf, tipo, cid, pagina, por_pagina)