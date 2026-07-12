from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import pandas as pd
import glob
import os

app = FastAPI(title="De Olho na Segurança - Motor de Dados")

# Configuração de CORS (Permite que o React consuma esta API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Variável global para armazenar todos os dados
df_cat = pd.DataFrame()

@app.on_event("startup")
async def carregar_dados_iniciais():
    global df_cat
    print("Iniciando o motor de dados... Lendo pastas e processando arquivos.")
    
    pasta_atual = os.path.dirname(os.path.abspath(__file__))
    caminho_data = os.path.join(pasta_atual, '..', 'data')
    arquivos_json = glob.glob(os.path.join(caminho_data, '**', '*.json'), recursive=True)
    
    colunas_uteis = [
        'CNAE2.0 Empregador', 'UF Munic. Empregador', 'Munic Empr',
        'Data Acidente', 'CID-10', 'Indica Óbito Acidente', 'Data Afastamento'
    ]
    
    lista_dfs = []
    
    for arquivo in arquivos_json:
    
        print(f"Processando: {os.path.basename(arquivo)}...") 
        df_temp = None
        
        for codificacao in ['utf-8', 'latin1', 'cp1252']:
            try:
                df_temp = pd.read_json(arquivo, encoding=codificacao)
                break
            except Exception:
                continue
                
        if df_temp is not None and not df_temp.empty:
            
            # Filtra as colunas PRIMEIRO (Alivia a CPU e a RAM)
            colunas_presentes = [col for col in colunas_uteis if col in df_temp.columns]
            df_temp = df_temp[colunas_presentes]
            
            # Limpa as duplicatas 
            df_temp = df_temp.drop_duplicates()
            
            lista_dfs.append(df_temp)
        else:
            print(f"  -> Falha ao ler ou arquivo vazio.")
    
    if lista_dfs:
        print("Montando o quebra-cabeça final e fazendo a última varredura...")
        df_cat = pd.concat(lista_dfs, ignore_index=True)
        
        # Limpeza final entre meses diferentes
        df_cat = df_cat.drop_duplicates()
        
        print(f"Base consolidada! Total de registros limpos em memória: {len(df_cat)}")
    else:
        print("Nenhum arquivo JSON foi carregado.")

@app.get("/api/dashboard/resumo")
async def obter_resumo_cats(
    cnae: Optional[str] = Query(None, description="Código CNAE 2.0"),
    uf: Optional[str] = Query(None, description="Sigla da UF (ex: AM, SP)")
):
    # Se a base estiver vazia, avisa o front-end
    if df_cat.empty:
        return {"erro": "Base de dados não inicializada."}

    df_filtrado = df_cat.copy()

    # Aplica os filtros recebidos do React
    if cnae:
        df_filtrado = df_filtrado[df_filtrado['CNAE2.0 Empregador'].astype(str).str.contains(cnae)]
    if uf:
        df_filtrado = df_filtrado[df_filtrado['UF Munic. Empregador'] == uf]

    if df_filtrado.empty:
        return {"mensagem": "Nenhum registro encontrado para estes filtros."}

    # Calcula os indicadores para o Departamento Pessoal / Segurança do Trabalho
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