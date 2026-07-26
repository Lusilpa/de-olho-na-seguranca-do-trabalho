import pandas as pd
import glob
import os
import json
from typing import Optional
import functools
import time

_CACHE = {}
_CACHE_TTL = 3600 # 1 hora de cache em memória

def cache_query(func):
    """
    Decorator de cache customizado que ignora o primeiro argumento (df_cat)
    para evitar o erro TypeError: unhashable type: 'DataFrame'.
    O restante dos argumentos formam a chave do cache.
    """
    @functools.wraps(func)
    def wrapper(df_cat, *args, **kwargs):
        key = (func.__name__,) + args + tuple(sorted(kwargs.items()))
        
        now = time.time()
        cached = _CACHE.get(key)
        if cached and (now - cached['ts']) < _CACHE_TTL:
            return cached['data']
            
        result = func(df_cat, *args, **kwargs)
        _CACHE[key] = {'ts': now, 'data': result}
        return result
    return wrapper


async def iniciar_motor_dados() -> pd.DataFrame:
    print("Iniciando o motor de dados... Lendo pastas e processando arquivos.")

    pasta_atual = os.path.dirname(os.path.abspath(__file__))
    caminho_data = os.path.join(pasta_atual, '..', '..', 'data')
    arquivos_json = glob.glob(os.path.join(caminho_data, '**', '*.json'), recursive=True)

    colunas_uteis = [
        'CNAE2.0 Empregador', 'UF Munic. Empregador', 'Munic Empr',
        'Data Acidente', 'CID-10', 'Indica Óbito Acidente', 'Data Afastamento',
        'Data Nascimento', 'Parte Corpo Atingida', 'Sexo', 'Tipo do Acidente',
        'CNPJ/CEI Empregador'
    ]

    lista_dfs = []

    for arquivo in arquivos_json:
        print(f"Processando: {os.path.basename(arquivo)}...")
        try:
            with open(arquivo, 'r', encoding='latin1') as f:
                data = json.load(f)

            nodes = data.get('nodes', [])
            if not nodes:
                continue
                
            lista_temp = []
            for item in nodes:
                node = item.get('node', {})
                registro = {col: node.get(col, None) for col in colunas_uteis}
                lista_temp.append(registro)
                
            # Criar DataFrame e remover duplicatas localmente economiza RAM no merge final
            df_temp = pd.DataFrame(lista_temp).drop_duplicates()
            lista_dfs.append(df_temp)
        except Exception as e:
            print(f"ALERTA: Falha ao ler {os.path.basename(arquivo)}: {e}")
            continue

    if lista_dfs:
        print("Montando o quebra-cabeça...")
        print("Aguarde... Concatenando arquivos...")
        df_cat = pd.concat(lista_dfs, ignore_index=True)
        
        # Otimizar tipos de dados para reduzir consumo de memória RAM absurdamente
        print("Otimizando consumo de memória (dtypes)...")
        colunas_categoria = ['UF Munic. Empregador', 'Sexo', 'Indica Óbito Acidente', 'Tipo do Acidente', 'Munic Empr']
        for col in colunas_categoria:
            if col in df_cat.columns:
                df_cat[col] = df_cat[col].astype('category')

        print("Removendo duplicatas globais...")
        df_cat = df_cat.drop_duplicates()

        # Pré-processamento de datas
        df_cat['Data Acidente Date'] = pd.to_datetime(df_cat['Data Acidente'], format='%d/%m/%Y', errors='coerce')
        df_cat['AnoMes'] = df_cat['Data Acidente Date'].dt.to_period('M').astype(str)
        df_cat['Ano'] = df_cat['Data Acidente Date'].dt.year.fillna(0).astype(int).astype(str)

        print(f"Base consolidada! Total de registros limpos em memória: {len(df_cat)}")
        return df_cat
    else:
        print("Nenhum arquivo JSON foi carregado.")
        return pd.DataFrame()


def aplicar_filtros(df_cat: pd.DataFrame, cnae: Optional[str] = None, uf: Optional[str] = None) -> pd.DataFrame:
    df_filtrado = df_cat.copy()
    if cnae:
        df_filtrado = df_filtrado[
            df_filtrado['CNAE2.0 Empregador'].astype(str).str.contains(cnae, na=False, case=False)]
    if uf:
        df_filtrado = df_filtrado[df_filtrado['UF Munic. Empregador'].astype(str).str.upper() == uf.upper()]
    return df_filtrado


def obter_registros(
    df_cat: pd.DataFrame,
    ano: Optional[str] = None,
    uf: Optional[str] = None,
    tipo: Optional[str] = None,
    cid: Optional[str] = None,
    pagina: int = 1,
    por_pagina: int = 10,
) -> dict:
    """
    Retorna registros reais de CAT paginados com filtros opcionais.
    NÃO cachear paginação.
    """
    if df_cat.empty:
        return {"total": 0, "pagina": pagina, "por_pagina": por_pagina, "total_paginas": 1, "registros": []}

    df = df_cat.copy()

    # Filtros
    if ano and ano != "TODOS":
        df = df[df["Ano"] == ano]
    if uf:
        df = df[df["UF Munic. Empregador"].astype(str).str.upper() == uf.upper()]
    if tipo:
        df = df[df["Tipo do Acidente"].astype(str).str.upper() == tipo.upper()]
    if cid:
        df = df[df["CID-10"].astype(str).str.upper().str.startswith(cid.upper())]

    total = len(df)
    inicio = (pagina - 1) * por_pagina
    fim = inicio + por_pagina

    pagina_df = df.iloc[inicio:fim]

    registros = []
    for _, row in pagina_df.iterrows():
        registros.append({
            "data_acidente": str(row.get("Data Acidente") or ""),
            "uf": str(row.get("UF Munic. Empregador") or ""),
            "municipio": str(row.get("Munic Empr") or ""),
            "tipo": str(row.get("Tipo do Acidente") or ""),
            "cid": str(row.get("CID-10") or ""),
            "parte_corpo": str(row.get("Parte Corpo Atingida") or "").split("(")[0].strip()[:30],
            "sexo": str(row.get("Sexo") or ""),
            "obito": str(row.get("Indica Óbito Acidente") or "NÃO").upper() == "SIM",
            "afastamento": bool(row.get("Data Afastamento")),
        })

    return {
        "total": total,
        "pagina": pagina,
        "por_pagina": por_pagina,
        "total_paginas": max(1, -(-total // por_pagina)),  # ceil division
        "registros": registros,
    }


# FUNÇÕES DE PROCESSAMENTO DO DASHBOARD

@cache_query
def obter_historico_cnpj(df_cat: pd.DataFrame, cnpj_limpo: str) -> dict:
    if df_cat.empty:
        return {"registros": 0, "selo": "Base Vazia", "historico": []}

    df_filtrado = df_cat[df_cat['CNPJ/CEI Empregador'].astype(str).str.replace(r'\D', '', regex=True) == cnpj_limpo]
    registros = len(df_filtrado)

    if registros == 0:
        selo = "Gama"
    elif registros < 10:
        selo = "Alpha"
    elif registros < 100:
        selo = "Beta"
    else:
        selo = "Sem Selo"

    lista = []
    if registros > 0:
        lista = df_filtrado[['Data Acidente', 'CID-10', 'Tipo do Acidente']].head(10).to_dict('records')

    return {
        "registros": registros,
        "selo": selo,
        "historico": lista
    }

@cache_query
def obter_tipo_acidente(df_cat: pd.DataFrame, cnae: Optional[str] = None, uf: Optional[str] = None) -> list:
    if df_cat.empty:
        return []

    df_filtrado = aplicar_filtros(df_cat, cnae, uf)
    total = len(df_filtrado)
    if total == 0:
        return []

    agrupado = df_filtrado['Tipo do Acidente'].value_counts()
    return [
        {
            "name": str(k),
            "valorAbsoluto": f"{int(v / 1000)}k" if v >= 1000 else str(v),
            "percentual": round((v / total) * 100, 1)
        }
        for k, v in agrupado.items()
    ]

@cache_query
def obter_setor_economico(df_cat: pd.DataFrame, uf: Optional[str] = None) -> list:
    if df_cat.empty:
        return []

    df_filtrado = aplicar_filtros(df_cat, None, uf)
    total = len(df_filtrado)
    if total == 0:
        return []

    agrupado = df_filtrado['CNAE2.0 Empregador'].value_counts().head(5)
    return [{"setor": str(k)[:30], "quantidade": int(v)} for k, v in agrupado.items()]

@cache_query
def obter_parte_corpo(df_cat: pd.DataFrame, cnae: Optional[str] = None, uf: Optional[str] = None) -> list:
    if df_cat.empty:
        return []

    df_filtrado = aplicar_filtros(df_cat, cnae, uf)
    total = len(df_filtrado)
    if total == 0:
        return []

    agrupado = df_filtrado['Parte Corpo Atingida'].value_counts().head(5)
    return [
        {
            "parte": str(k).split('(')[0].strip()[:20],
            "percentual": round((v / total) * 100, 1)
        }
        for k, v in agrupado.items()
    ]

@cache_query
def obter_resumo_cats(df_cat: pd.DataFrame, cnae: Optional[str] = None, uf: Optional[str] = None) -> dict:
    if df_cat.empty:
        return {"kpis": {"total_cats": 0, "obitos": 0, "com_afastamento": 0}, "ranking_cids": {}}

    df_filtrado = aplicar_filtros(df_cat, cnae, uf)
    if df_filtrado.empty:
        return {"kpis": {"total_cats": 0, "obitos": 0, "com_afastamento": 0}, "ranking_cids": {}}

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

@cache_query
def obter_evolucao(df_cat: pd.DataFrame, modo: str, ano: str, cnae: Optional[str] = None, uf: Optional[str] = None) -> list:
    if df_cat.empty: return []

    df_filtrado = aplicar_filtros(df_cat, cnae, uf)
    if ano != 'TODOS':
        df_filtrado = df_filtrado[df_filtrado['Ano'] == ano]

    if modo == 'mensal':
        agrupado = df_filtrado['AnoMes'].value_counts().sort_index()
    else:
        agrupado = df_filtrado['Ano'].value_counts().sort_index()

    return [{"periodo": str(k), "cats": int(v)} for k, v in agrupado.items() if k != 'NaT' and k != '0']

@cache_query
def obter_faixa_etaria(df_cat: pd.DataFrame, cnae: Optional[str] = None, uf: Optional[str] = None) -> list:
    if df_cat.empty: return []

    df_filtrado = aplicar_filtros(df_cat, cnae, uf)
    df_filtrado['Data Nascimento Date'] = pd.to_datetime(df_filtrado['Data Nascimento'], format='%d/%m/%Y',
                                                         errors='coerce')
    df_filtrado['Idade'] = (df_filtrado['Data Acidente Date'] - df_filtrado['Data Nascimento Date']).dt.days / 365.25

    bins = [18, 25, 35, 45, 55, 65, 100]
    labels = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
    df_filtrado['Faixa'] = pd.cut(df_filtrado['Idade'], bins=bins, labels=labels, right=False)

    agrupado = df_filtrado['Faixa'].value_counts().sort_index()
    return [{"faixa": str(k), "quantidade": int(v)} for k, v in agrupado.items()]

@cache_query
def obter_top_estados(df_cat: pd.DataFrame, cnae: Optional[str] = None) -> list:
    if df_cat.empty: return []

    df_filtrado = aplicar_filtros(df_cat, cnae, None)
    total = len(df_filtrado)
    if total == 0: return []

    agrupado = df_filtrado['UF Munic. Empregador'].value_counts().head(5)
    return [{"uf": str(k)[:20], "registros": f"{int(v / 1000)}k" if v >= 1000 else str(v),
             "percentual": round((v / total) * 100, 1)} for k, v in agrupado.items()]

@cache_query
def obter_sexo(df_cat: pd.DataFrame, cnae: Optional[str] = None, uf: Optional[str] = None) -> list:
    if df_cat.empty: return []

    df_filtrado = aplicar_filtros(df_cat, cnae, uf)
    total = len(df_filtrado)
    if total == 0: return []

    agrupado = df_filtrado['Sexo'].value_counts()
    return [{"genero": str(k), "percentual": round((v / total) * 100, 1)} for k, v in agrupado.items()]