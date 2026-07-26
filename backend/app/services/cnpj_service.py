import httpx

def consultar_cnpj_na_receita_federal(cnpj: str) -> dict | None:
    """
    Consulta dados cadastrais de uma empresa na BrasilAPI a partir do CNPJ.

    Usa httpx (sync) pois o endpoint foi convertido para `def` (Thread Pool)
    para evitar bloqueio da event loop pelo Pandas.
    Retorna o JSON da API em caso de sucesso, ou None em caso de falha.
    """
    cnpj_limpo = "".join(filter(str.isdigit, cnpj))
    url = f"https://brasilapi.com.br/api/cnpj/v1/{cnpj_limpo}"

    try:
        with httpx.Client(timeout=10.0) as client:
            response = client.get(url)

        if response.status_code == 200:
            return response.json()

        return None

    except httpx.RequestError:
        return None


def extrair_dados_empresa(dados_api: dict | None) -> dict | None:
    """
    Transforma a resposta bruta da BrasilAPI em um dicionário limpo
    com apenas os campos relevantes para exibição.
    """
    if not dados_api:
        return None

    # Extração segura dos dados
    data_inicio = dados_api.get("data_inicio_atividade", "")
    ano_fundacao = data_inicio[:4] if data_inicio else "N/A"

    # O uso do .strip() pode quebrar se o valor retornado for None, por isso o fallback ''
    telefone = (dados_api.get("ddd_telefone_1") or "").strip()
    telefone_formatado = telefone if telefone else "NADA CONSTA"

    tipo_logradouro = dados_api.get("descricao_tipo_de_logradouro", "")
    logradouro = dados_api.get("logradouro", "")
    numero = dados_api.get("numero", "S/N")
    complemento = dados_api.get("complemento", "")
    bairro = dados_api.get("bairro", "")
    municipio = dados_api.get("municipio", "")
    cep = dados_api.get("cep", "")
    uf = dados_api.get("uf", "")

    endereco_completo = (
        f"{tipo_logradouro} {logradouro}, {numero} {complemento} - {bairro}, {municipio} / {uf} - CEP: {cep}"
        .replace("  ", " ")
        .strip()
    )

    cnae_fiscal = dados_api.get("cnae_fiscal", "")
    cnae_descricao = dados_api.get("cnae_fiscal_descricao", "")
    atividades = f"{cnae_fiscal} - {cnae_descricao}" if cnae_fiscal else "N/A"

    return {
        "razao_social": dados_api.get("razao_social", "N/A"),
        "nome_fantasia": dados_api.get("nome_fantasia") or "N/A",
        "ano_fundacao": ano_fundacao,
        "telefone": telefone_formatado,
        "endereco": endereco_completo,
        "situacao": dados_api.get("descricao_situacao_cadastral", "N/A"),
        "atividades": atividades,
        "cnae_codigo": str(cnae_fiscal),
    }