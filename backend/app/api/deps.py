from fastapi import Request
import pandas as pd

def get_df_cat(request: Request) -> pd.DataFrame:
    """
    Injeta o DataFrame global carregado no lifespan (app.state.df_cat)
    para uso nos endpoints da API, substituindo o uso de variáveis globais.
    """
    return getattr(request.app.state, "df_cat", pd.DataFrame())
