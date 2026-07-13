from fastapi import APIRouter, Path
from app.services import data_service, cnpj_service

router = APIRouter(tags=["CNPJ"])

@router.get("/api/cnpj/{cnpj}")
async def buscar_cnpj(cnpj: str = Path(...)):
    # 1. Limpeza da entrada (Responsabilidade da camada de interface)
    cnpj_limpo = "".join(filter(str.isdigit, cnpj))

    # 2. Pede os dados e cálculos analíticos para o serviço interno
    dados_locais = data_service.obter_historico_cnpj(cnpj_limpo)

    # Interrompe caso o motor de dados não tenha subido
    if "erro" in dados_locais:
        return dados_locais

    # 3. Orquestra a chamada para a API externa (Receita Federal)
    dados_receita = cnpj_service.consultar_cnpj_na_receita_federal(cnpj_limpo)
    dados_empresa = cnpj_service.extrair_dados_empresa(dados_receita)

    # 4. Monta o quebra-cabeça final e devolve para o React
    return {
        "cnpj": cnpj,
        "registros": dados_locais["registros"],
        "selo": dados_locais["selo"],
        "historico": dados_locais["historico"],
        "empresa": dados_empresa
    }