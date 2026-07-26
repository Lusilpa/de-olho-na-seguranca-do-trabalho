"""
schemas.py

Modelos Pydantic de request/response para os endpoints da API.
Definem contratos claros entre o frontend e o backend.
"""

from pydantic import BaseModel
from typing import Optional


# ── CNPJ ──────────────────────────────────────────────────────────────────────

class EmpresaResponse(BaseModel):
    razao_social: str
    nome_fantasia: str
    ano_fundacao: str
    telefone: str
    endereco: str
    situacao: str
    atividades: str
    cnae_codigo: str


class CatHistoricoItem(BaseModel):
    data_acidente: str = ""
    cid: str = ""
    tipo: str = ""


class RiscoResponse(BaseModel):
    registros: int
    selo: str
    historico: list[CatHistoricoItem]


class CnpjResponse(BaseModel):
    empresa: Optional[EmpresaResponse] = None
    risco: RiscoResponse


# ── Dashboard ──────────────────────────────────────────────────────────────────

class KpisResponse(BaseModel):
    total_cats: int
    com_afastamento: int
    obitos: int


class CidRankingItem(BaseModel):
    cid: str
    quantidade: int


class ResumoResponse(BaseModel):
    kpis: KpisResponse
    ranking_cids: list[CidRankingItem]


class EvolucaoItem(BaseModel):
    periodo: str
    cats: int


class FaixaEtariaItem(BaseModel):
    faixa: str
    quantidade: int


class TopEstadoItem(BaseModel):
    uf: str
    quantidade: int
    percentual: float


class SexoItem(BaseModel):
    sexo: str
    quantidade: int
    percentual: float


class ParteCorpoItem(BaseModel):
    parte: str
    quantidade: int
    percentual: float


class SetorEconomicoItem(BaseModel):
    setor: str
    quantidade: int


class TipoAcidenteItem(BaseModel):
    name: str
    percentual: float


# ── Filtros / Registros ────────────────────────────────────────────────────────

class CatRegistroItem(BaseModel):
    data_acidente: str
    uf: str
    municipio: str
    tipo: str
    cid: str
    parte_corpo: str
    sexo: str
    obito: bool
    afastamento: bool


class RegistrosResponse(BaseModel):
    total: int
    pagina: int
    por_pagina: int
    total_paginas: int
    registros: list[CatRegistroItem]
