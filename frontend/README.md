# Frontend — De Olho na Segurança do Trabalho

SPA React (Vite + TypeScript + Tailwind CSS) que consome a API FastAPI do backend para exibir visualizações interativas das Comunicações de Acidente do Trabalho (CAT).

---

## Pré-requisitos

- Node.js ≥ 18
- Backend FastAPI rodando (ver `../backend/README.md`)

---

## Setup

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
copy .env.example .env
# Edite .env se o backend rodar em porta/host diferente

# 3. Iniciar servidor de desenvolvimento
npm run dev
```

Acesse em: `http://localhost:5173`

---

## Variáveis de Ambiente

Crie o arquivo `.env` na raiz do `frontend/` (use `.env.example` como base):

| Variável            | Padrão                  | Descrição                   |
| ------------------- | ----------------------- | --------------------------- |
| `VITE_API_BASE_URL` | `http://localhost:8000` | URL base do backend FastAPI |

> `.env` está no `.gitignore`. Nunca faça commit de dados sensíveis.

---

## Estrutura de Código

```
src/
├── api/
│   ├── types.ts          # Tipos TypeScript dos schemas da API
│   ├── apiClient.ts      # Cliente HTTP genérico (fetch + ApiError)
│   └── dashboardApi.ts   # Funções por endpoint (getResumo, getEvolucao…)
│
├── hooks/
│   └── useDashboard.ts   # Hook com Promise.allSettled, loading e error
│
├── components/
│   ├── navbar.tsx        # Navbar fixa com mega-menu e menu mobile
│   └── footer.tsx        # Rodapé com links sociais
│
├── pages/
│   ├── home.tsx          # Landing page
│   ├── dashboard.tsx     # Painel de gráficos (conectado à API)
│   ├── filter.tsx        # Página de filtros (dados mock paginados)
│   └── documentation.tsx # Documentação do projeto
│
├── main.tsx              # Ponto de entrada: rotas e layout
└── style.css             # Estilos globais
```

---

## Scripts

| Comando         | Descrição                                    |
| --------------- | -------------------------------------------- |
| `npm run dev`   | Servidor de desenvolvimento com HMR          |
| `npm run build` | Build de produção (TypeScript + Vite)        |
| `npm run preview` | Preview do build de produção               |

---

## Dependências Principais

| Pacote            | Versão  | Uso                              |
| ----------------- | ------- | -------------------------------- |
| `react`           | ^19     | Framework UI                     |
| `react-router-dom`| ^7      | Roteamento SPA                   |
| `recharts`        | ^3      | Gráficos (área, barras, pizza)   |
| `lucide-react`    | ^0.462  | Ícones                           |
| `tailwindcss`     | ^4      | Utilitários CSS                  |
| `vite`            | ^8      | Bundler / Dev server             |
