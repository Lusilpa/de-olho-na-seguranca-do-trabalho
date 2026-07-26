import pytest
from fastapi.testclient import TestClient
import pandas as pd

from app.main import app

client = TestClient(app)

@pytest.fixture(autouse=True)
def mock_df():
    """
    Mock do DataFrame no app.state para evitar 
    carregar JSONs inteiros durante testes.
    """
    app.state.df_cat = pd.DataFrame({
        "CNPJ/CEI Empregador": ["12345678000199", "12345678000199"],
        "UF Munic. Empregador": ["SP", "RJ"],
        "Ano": ["2023", "2023"],
        "Data Acidente": ["10/01/2023", "11/01/2023"],
        "Data Afastamento": ["15/01/2023", None],
        "Tipo do Acidente": ["Típico", "Trajeto"],
        "CID-10": ["S62", "S62"],
        "Indica Óbito Acidente": ["Não", "Sim"],
        "Sexo": ["M", "F"],
    })
    yield


def test_obter_resumo():
    response = client.get("/api/dashboard/resumo")
    assert response.status_code == 200
    data = response.json()
    assert "kpis" in data
    assert data["kpis"]["total_cats"] == 2


def test_consultar_cnpj_invalido():
    response = client.get("/api/cnpj/123")
    assert response.status_code == 422
    assert response.json()["detail"][0]["type"] == "string_too_short"


def test_consultar_cnpj_mock():
    # Deve retornar o selo "Alpha" (pois tem < 10 registros na base de mock)
    response = client.get("/api/cnpj/12345678000199")
    assert response.status_code == 200
    data = response.json()
    assert data["risco"]["registros"] == 2
    assert data["risco"]["selo"] == "Alpha"
