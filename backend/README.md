# Backend — De Olho na Segurança do Trabalho

API REST construída com **FastAPI** e **Pandas**. Carrega todos os arquivos JSON de CAT (2021–2026) em memória no startup e serve agregados para o frontend React.

---

## Pré-requisitos

- Python ≥ 3.12
- Ambiente virtual (recomendado)

---

## Setup

```bash
cd backend

# 1. Criar ambiente virtual
python -m venv venv

# 2. Ativar
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# 3. Instalar dependências
pip install -r requirements.txt

# 4. Iniciar o servidor
uvicorn app.main:app --reload
```

A API sobe em `http://localhost:8000`.  
Swagger UI: `http://localhost:8000/docs`

---

## Estrutura de Código

```
app/
├── api/
│   ├── dependencies.py        # Dependências injetáveis (futuro uso)
│   └── routers/
│       └── dashboard.py       # Rotas GET /api/dashboard/*
│
├── core/
│   └── config.py              # Settings (host, port, CORS)
│
├── models/
│   ├── domain.py              # Modelos de domínio
│   └── schemas.py             # Schemas Pydantic (request/response)
│
├── services/
│   ├── data_service.py        # Motor de dados: leitura, filtragem e agregação
│   └── cnpj_service.py        # Consulta histórica por CNPJ
│
└── main.py                    # Ponto de entrada FastAPI
```

---

## Endpoints

Todos os endpoints são **GET** e aceitam os parâmetros opcionais `cnae` (string) e `uf` (sigla, ex: `SP`).

| Rota                              | Parâmetros extras        | Descrição                             |
| --------------------------------- | ------------------------ | ------------------------------------- |
| `/api/dashboard/resumo`           | `cnae`, `uf`             | KPIs e top CIDs                       |
| `/api/dashboard/evolucao`         | `modo`, `ano`, `cnae`, `uf` | Série temporal de CATs             |
| `/api/dashboard/faixa-etaria`     | `cnae`, `uf`             | Distribuição por idade                |
| `/api/dashboard/top-estados`      | `cnae`                   | Top 5 UFs                             |
| `/api/dashboard/sexo`             | `cnae`, `uf`             | Distribuição por sexo                 |
| `/api/dashboard/parte-corpo`      | `cnae`, `uf`             | Top 5 partes do corpo atingidas       |
| `/api/dashboard/setor-economico`  | `uf`                     | Top 5 CNAE com mais acidentes         |
| `/api/dashboard/tipo-acidente`    | `cnae`, `uf`             | Tipologia (típico, trajeto, doença)   |

### Parâmetro `modo` (endpoint `/evolucao`)

| Valor     | Descrição                      |
| --------- | ------------------------------ |
| `anual`   | Agrupa por ano (padrão)        |
| `mensal`  | Agrupa por ano-mês (YYYY-MM)   |

---

## Variáveis de Ambiente

| Variável          | Padrão    | Descrição                           |
| ----------------- | --------- | ----------------------------------- |
| `API_HOST`        | `0.0.0.0` | Host do servidor uvicorn            |
| `API_PORT`        | `8000`    | Porta do servidor                   |
| `ALLOWED_ORIGINS` | `*`       | Origens CORS permitidas (CSV)       |

---

## Dados

Os arquivos JSON estão organizados em `data/<ano>/`. O motor lê todos recursivamente no startup usando `glob`, extrai as colunas úteis e descarta duplicatas.

**Colunas carregadas:**
- `CNAE2.0 Empregador`, `UF Munic. Empregador`, `Munic Empr`
- `Data Acidente`, `CID-10`, `Indica Óbito Acidente`, `Data Afastamento`
- `Data Nascimento`, `Parte Corpo Atingida`, `Sexo`, `Tipo do Acidente`
- `CNPJ/CEI Empregador`

---

## Dependências Principais

| Pacote      | Uso                                |
| ----------- | ---------------------------------- |
| `fastapi`   | Framework web assíncrono           |
| `uvicorn`   | Servidor ASGI                      |
| `pandas`    | Motor de dados em memória          |
| `httpx`     | Cliente HTTP (consultas externas)  |
