from fastapi import APIRouter, Query
from typing import Optional
from app.services import data_service

router = APIRouter(tags=["Dashboard"])

@router.get("/api/dashboard/resumo")
async def obter_resumo_cats(
        cnae: Optional[str] = Query(None, description="Código CNAE 2.0"),
        uf: Optional[str] = Query(None, description="Sigla da UF (ex: AM, SP)")
):
    return data_service.obter_resumo_cats(cnae, uf)

@router.get("/api/dashboard/evolucao")
async def obter_evolucao(
        modo: str = Query('mensal'),
        ano: str = Query('TODOS'),
        cnae: Optional[str] = Query(None),
        uf: Optional[str] = Query(None)
):
    return data_service.obter_evolucao(modo, ano, cnae, uf)

@router.get("/api/dashboard/faixa-etaria")
async def obter_faixa_etaria(
        cnae: Optional[str] = Query(None),
        uf: Optional[str] = Query(None)
):
    return data_service.obter_faixa_etaria(cnae, uf)

@router.get("/api/dashboard/top-estados")
async def obter_top_estados(
        cnae: Optional[str] = Query(None)
):
    return data_service.obter_top_estados(cnae)

@router.get("/api/dashboard/sexo")
async def obter_sexo(
        cnae: Optional[str] = Query(None),
        uf: Optional[str] = Query(None)
):
    return data_service.obter_sexo(cnae, uf)

@router.get("/api/dashboard/parte-corpo")
async def obter_parte_corpo(
    cnae: Optional[str] = Query(None, description="Código CNAE 2.0"),
    uf: Optional[str] = Query(None, description="Sigla da UF")
):
    # O roteador confia no serviço para fazer a limpeza e os cálculos
    return data_service.obter_parte_corpo(cnae, uf)

@router.get("/api/dashboard/setor-economico")
async def obter_setor_economico(
    uf: Optional[str] = Query(None, description="Sigla da UF para filtrar os setores")
):
    return data_service.obter_setor_economico(uf)


@router.get("/api/dashboard/tipo-acidente")
async def obter_tipo_acidente(
    cnae: Optional[str] = Query(None, description="Código CNAE 2.0"),
    uf: Optional[str] = Query(None, description="Sigla da UF")
):
    # O roteador apenas repassa os parâmetros e devolve a resposta limpa
    return data_service.obter_tipo_acidente(cnae, uf)