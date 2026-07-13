import requests

def consultar_cnpj_na_receita_federal(cnpj):
    # Limpa a formatação digitada
    cnpj_limpo = "".join(filter(str.isdigit, cnpj))
    url = f"https://brasilapi.com.br/api/cnpj/v1/{cnpj_limpo}" # API pública para consulta

    # Fazendo um requisiçao utilizando try-except (usando para tratamento de exceções)
    try:

        # requests.get(url, timeout) - envia uma requesição para a url e delimita 10 segundo de aguardo da reposta
        response = requests.get(url, timeout=10)

        # verificar se a requisição foi bem sucedida
        if response.status_code == 200:
            return response.json()

        return None

    except requests.exceptions.RequestException:
        return None

def extrair_dados_empresa(dados_api):

    # verifica se veio dados da API
    if not dados_api: return None

    # Extração segura dos dados
    data_inicio = dados_api.get('data_inicio_atividade', '')
    ano_fundacao = data_inicio[:4] if data_inicio else 'N/A'

    # O uso do .strip() pode quebrar se o valor retornado for None, por isso o fallback ''
    telefone = dados_api.get('ddd_telefone_1', '').strip()
    telefone_formatado = telefone if telefone else "NADA CONSTA"

    tipo_logradouro = dados_api.get('descricao_tipo_de_logradouro', '')
    logradouro = dados_api.get('logradouro', '')
    numero = dados_api.get('numero', 'S/N')
    complemento = dados_api.get('complemento', '')
    bairro = dados_api.get('bairro', '')
    municipio = dados_api.get('municipio', '')
    cep = dados_api.get('cep', '')

    endereco_completo = f"{tipo_logradouro} {logradouro}, {numero} {complemento} - {bairro}, {municipio} / {dados_api.get('uf')} - CEP: {cep}".replace(
        "  ", " ").strip()

    # Retorna os dados extraidos da API
    return {
        "razao_social": dados_api.get('razao_social', 'N/A'),
        "nome_fantasia": dados_api.get('nome_fantasia', 'N/A'),
        "ano_fundacao": ano_fundacao,
        "telefone": telefone_formatado,
        "endereco": endereco_completo,
        "situacao": dados_api.get('descricao_situacao_cadastral', 'N/A'),
        "atividades": f"{dados_api.get('cnae_fiscal')} - {dados_api.get('cnae_fiscal_descricao')}"
    }