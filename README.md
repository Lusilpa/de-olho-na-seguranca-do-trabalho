# De Olho na Segurança do Trabalho

Plataforma de visualização e análise das **Comunicações de Acidente do Trabalho (CAT)** do Brasil, construída sobre dados abertos do Portal de Dados do Governo Federal ([dados.gov.br](https://dados.gov.br/home)).

---

## Stack

| Camada    | Tecnologia                            |
| --------- | ------------------------------------- |
| Frontend  | React 19 + Vite + TypeScript + Tailwind CSS |
| Gráficos  | Recharts                              |
| Backend   | Python 3.12 + FastAPI + Pandas        |
| Dados     | JSON — arquivos exportados do dados.gov.br |

---

## Estrutura do Projeto

```
de-olho-na-seguranca-do-trabalho/
├── backend/          # API FastAPI + motor de dados Pandas
│   ├── app/
│   │   ├── api/routers/   # Rotas HTTP (dashboard.py)
│   │   ├── core/          # Configurações centralizadas (config.py)
│   │   ├── models/        # Schemas de domínio e Pydantic
│   │   ├── services/      # Lógica de negócio (data_service.py)
│   │   └── main.py        # Ponto de entrada FastAPI
│   ├── data/              # Arquivos JSON organizados por ano (2021–2026)
│   └── requirements.txt
│
├── frontend/         # SPA React
│   ├── src/
│   │   ├── api/           # Camada de acesso à API (types, client, funções)
│   │   ├── hooks/         # Custom hooks (useDashboard)
│   │   ├── components/    # Navbar, Footer
│   │   └── pages/         # Home, Dashboard, Filter, Documentation
│   ├── .env               # Variáveis de ambiente (não commitar)
│   ├── .env.example       # Template seguro para commit
│   └── package.json
│
└── README.md
```

---

## Como Rodar (Desenvolvimento)

### 1. Backend

```bash
cd backend

# Criar e ativar o ambiente virtual
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# Instalar dependências
pip install -r requirements.txt

# Iniciar o servidor (porta 8000)
uvicorn app.main:app --reload
```

A API ficará disponível em `http://localhost:8000`.  
Documentação interativa: `http://localhost:8000/docs`

### 2. Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento (porta 5173)
npm run dev
```

O app ficará disponível em `http://localhost:5173`.

> **Requisito:** o backend precisa estar rodando para o Dashboard exibir dados reais.

---

## Endpoints da API

| Método | Rota                              | Descrição                             |
| ------ | --------------------------------- | ------------------------------------- |
| GET    | `/api/dashboard/resumo`           | KPIs (total CATs, óbitos, afastamentos) e top CIDs |
| GET    | `/api/dashboard/evolucao`         | Série temporal anual ou mensal        |
| GET    | `/api/dashboard/faixa-etaria`     | Distribuição por faixa etária         |
| GET    | `/api/dashboard/top-estados`      | Top 5 UFs com mais acidentes          |
| GET    | `/api/dashboard/sexo`             | Distribuição por sexo                 |
| GET    | `/api/dashboard/parte-corpo`      | Partes do corpo mais atingidas (top 5)|
| GET    | `/api/dashboard/setor-economico`  | Top 5 setores econômicos por CNAE     |
| GET    | `/api/dashboard/tipo-acidente`    | Tipologia (típico, trajeto, doença)   |

Todos os endpoints aceitam os parâmetros de filtro opcionais `cnae` e `uf`.

---

## Variáveis de Ambiente

### Frontend (`frontend/.env`)

| Variável            | Padrão                    | Descrição                  |
| ------------------- | ------------------------- | -------------------------- |
| `VITE_API_BASE_URL` | `http://localhost:8000`   | URL base do backend FastAPI |

### Backend

| Variável           | Padrão    | Descrição                           |
| ------------------ | --------- | ----------------------------------- |
| `API_HOST`         | `0.0.0.0` | Host do servidor uvicorn            |
| `API_PORT`         | `8000`    | Porta do servidor                   |
| `ALLOWED_ORIGINS`  | `*`       | Origens CORS permitidas (CSV)       |

---

# Diretriz de Desenvolvimento e Uso de IA

Reafirma-se que este projeto foi elaborado inteiramente sob padrões e protocolos proprietários. O uso de inteligência artificial no ambiente Antigravity IDE da Google atuou estritamente como catalisador no desenvolvimento do Frontend e na geração de ideias visuais. Mantém-se o compromisso com a entrega de um produto que une o pensamento analítico humano à celeridade operacional das ferramentas de IA.

Por conseguinte, todas as decisões estratégicas de Planejamento, Coleta e Tratamento de Dados, Arquitetura de Software e Ciência de Dados constituem, integralmente, propriedade intelectual humana.

## Licença

[MIT](LICENSE) — Desenvolvido por **Luan Palma**.  
Dados: Portal de Dados Públicos do Governo Federal.