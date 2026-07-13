import pandas as pd
import glob
import os
import json
from typing import Optional

# base de dados global em memória
df_cat = pd.DataFrame()

async def iniciar_motor_dados():
    global df_cat
    print("Iniciando o motor de dados... Lendo pastas e processando arquivos.")

    pasta_atual = os.path.dirname(os.path.abspath(__file__))
    caminho_data = os.path.join(pasta_atual, '..', '..', 'data')
    arquivos_json = glob.glob(os.path.join(caminho_data, '**', '*.json'), recursive=True)

    # Para evitar sobrecarga da memória, uma lista de
    colunas_uteis = [
        'CNAE2.0 Empregador', 'UF Munic. Empregador', 'Munic Empr',
        'Data Acidente', 'CID-10', 'Indica Óbito Acidente', 'Data Afastamento',
        'Data Nascimento', 'Parte Corpo Atingida', 'Sexo', 'Tipo do Acidente',
        'CNPJ/CEI Empregador'
    ]

    lista_registros = []

    for arquivo in arquivos_json:
        print(f"Processando: {os.path.basename(arquivo)}...")
        try:
            with open(arquivo, 'r', encoding='latin1') as f:
                data = json.load(f)

            nodes = data.get('nodes', [])
            for item in nodes:
                node = item.get('node', {})
                registro = {col: node.get(col, None) for col in colunas_uteis}
                lista_registros.append(registro)
        except Exception as e:
            print(f"ALERTA: Falha ao ler {os.path.basename(arquivo)}: {e}")
            continue

    if lista_registros:
        print("Montando o quebra-cabeça...")
        print("Aguarde...")
        df_cat = pd.DataFrame(lista_registros)
        df_cat = df_cat.drop_duplicates()

        # Pré-processamento de datas
        df_cat['Data Acidente Date'] = pd.to_datetime(df_cat['Data Acidente'], format='%d/%m/%Y', errors='coerce')
        df_cat['AnoMes'] = df_cat['Data Acidente Date'].dt.to_period('M').astype(str)
        df_cat['Ano'] = df_cat['Data Acidente Date'].dt.year.fillna(0).astype(int).astype(str)

        print(f"Base consolidada! Total de registros limpos em memória: {len(df_cat)}")
    else:
        print("Nenhum arquivo JSON foi carregado.")


def aplicar_filtros(cnae: Optional[str], uf: Optional[str], df: pd.DataFrame = None) -> pd.DataFrame:
    global df_cat
    base_df = df if df is not None else df_cat

    df_filtrado = base_df.copy()
    if cnae:
        df_filtrado = df_filtrado[
            df_filtrado['CNAE2.0 Empregador'].astype(str).str.contains(cnae, na=False, case=False)]
    if uf:
        df_filtrado = df_filtrado[df_filtrado['UF Munic. Empregador'].astype(str).str.upper() == uf.upper()]
    return df_filtrado

# FUNÇÕES DE PROCESSAMENTO DO DASHBOARD

def obter_historico_cnpj(cnpj_limpo: str) -> dict:
    global df_cat
    if df_cat.empty:
        return {"erro": "Base não inicializada"}

    # Filtro de dados no Pandas
    df_filtrado = df_cat[df_cat['CNPJ/CEI Empregador'].astype(str).str.replace(r'\D', '', regex=True) == cnpj_limpo]
    registros = len(df_filtrado)

    # Regra de negócio (Classificação de Risco/Selo)
    if registros == 0:
        selo = "Gama"
    elif registros < 10:
        selo = "Alpha"
    elif registros < 100:
        selo = "Beta"
    else:
        selo = "Sem Selo"

    # Extração de histórico
    lista = []
    if registros > 0:
        lista = df_filtrado[['Data Acidente', 'CID-10', 'Tipo do Acidente']].head(10).to_dict('records')

    return {
        "registros": registros,
        "selo": selo,
        "historico": lista
    }


def obter_tipo_acidente(cnae: Optional[str] = None, uf: Optional[str] = None) -> list:
    global df_cat
    if df_cat.empty:
        return []

    df_filtrado = aplicar_filtros(cnae, uf)
    total = len(df_filtrado)
    if total == 0:
        return []

    agrupado = df_filtrado['Tipo do Acidente'].value_counts()

    resultado = [
        {
            "name": str(k),
            "valorAbsoluto": f"{int(v / 1000)}k" if v >= 1000 else str(v),
            "percentual": round((v / total) * 100, 1)
        }
        for k, v in agrupado.items()
    ]

    return resultado


def obter_setor_economico(uf: Optional[str] = None) -> list:
    global df_cat
    if df_cat.empty:
        return []

    df_filtrado = aplicar_filtros(None, uf)
    total = len(df_filtrado)
    if total == 0:
        return []

    # Pega os 5 maiores e limita o nome do setor a 30 caracteres para não quebrar o layout no React
    agrupado = df_filtrado['CNAE2.0 Empregador'].value_counts().head(5)
    resultado = [{"setor": str(k)[:30], "quantidade": int(v)} for k, v in agrupado.items()]

    return resultado


def obter_parte_corpo(cnae: Optional[str] = None, uf: Optional[str] = None) -> list:
    global df_cat
    if df_cat.empty:
        return []

    df_filtrado = aplicar_filtros(cnae, uf)
    total = len(df_filtrado)
    if total == 0:
        return []

    # Pega os 5 maiores
    agrupado = df_filtrado['Parte Corpo Atingida'].value_counts().head(5)

    # Limpa a string (tira parênteses, remove espaços e limita a 20 caracteres) e calcula a %
    resultado = [
        {
            "parte": str(k).split('(')[0].strip()[:20],
            "percentual": round((v / total) * 100, 1)
        }
        for k, v in agrupado.items()
    ]

    return resultado


def obter_resumo_cats(cnae: Optional[str] = None, uf: Optional[str] = None) -> dict:
    global df_cat
    if df_cat.empty:
        return {"erro": "Base de dados não inicializada."}

    df_filtrado = aplicar_filtros(cnae, uf)
    if df_filtrado.empty:
        return {"mensagem": "Nenhum registro encontrado para estes filtros."}

    total_cats = len(df_filtrado)
    obitos = len(df_filtrado[df_filtrado['Indica Óbito Acidente'].astype(str).str.upper() == 'SIM'])
    com_afastamento = len(df_filtrado.dropna(subset=['Data Afastamento']))
    top_cids = df_filtrado['CID-10'].value_counts().head(5).to_dict()

    return {
        "kpis": {
            "total_cats": total_cats,
            "obitos": obitos,
            "com_afastamento": com_afastamento
        },
        "ranking_cids": top_cids
    }


def obter_evolucao(modo: str, ano: str, cnae: Optional[str] = None, uf: Optional[str] = None) -> list:
    global df_cat
    if df_cat.empty: return []

    df_filtrado = aplicar_filtros(cnae, uf)
    if ano != 'TODOS':
        df_filtrado = df_filtrado[df_filtrado['Ano'] == ano]

    if modo == 'mensal':
        agrupado = df_filtrado['AnoMes'].value_counts().sort_index()
    else:
        agrupado = df_filtrado['Ano'].value_counts().sort_index()

    return [{"periodo": str(k), "cats": int(v)} for k, v in agrupado.items() if k != 'NaT' and k != '0']


def obter_faixa_etaria(cnae: Optional[str] = None, uf: Optional[str] = None) -> list:
    global df_cat
    if df_cat.empty: return []

    df_filtrado = aplicar_filtros(cnae, uf)
    df_filtrado['Data Nascimento Date'] = pd.to_datetime(df_filtrado['Data Nascimento'], format='%d/%m/%Y',
                                                         errors='coerce')
    df_filtrado['Idade'] = (df_filtrado['Data Acidente Date'] - df_filtrado['Data Nascimento Date']).dt.days / 365.25

    bins = [18, 25, 35, 45, 55, 65, 100]
    labels = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
    df_filtrado['Faixa'] = pd.cut(df_filtrado['Idade'], bins=bins, labels=labels, right=False)

    agrupado = df_filtrado['Faixa'].value_counts().sort_index()
    return [{"faixa": str(k), "quantidade": int(v)} for k, v in agrupado.items()]


def obter_top_estados(cnae: Optional[str] = None) -> list:
    global df_cat
    if df_cat.empty: return []

    df_filtrado = aplicar_filtros(cnae, None)
    total = len(df_filtrado)
    if total == 0: return []

    agrupado = df_filtrado['UF Munic. Empregador'].value_counts().head(5)
    return [{"uf": str(k)[:20], "registros": f"{int(v / 1000)}k" if v >= 1000 else str(v),
             "percentual": round((v / total) * 100, 1)} for k, v in agrupado.items()]


def obter_sexo(cnae: Optional[str] = None, uf: Optional[str] = None) -> list:
    global df_cat
    if df_cat.empty: return []

    df_filtrado = aplicar_filtros(cnae, uf)
    total = len(df_filtrado)
    if total == 0: return []

    agrupado = df_filtrado['Sexo'].value_counts()
    return [{"genero": str(k), "percentual": round((v / total) * 100, 1)} for k, v in agrupado.items()]