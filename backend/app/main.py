from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.data_service import iniciar_motor_dados
from app.api.routers import dashboard


# Definimos o ciclo de vida (Lifespan) - A forma moderna que substitui o on_event
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Tudo que está antes do 'yield' roda no STARTUP (quando a API liga)
    await iniciar_motor_dados()

    yield

    # Tudo que está depois do 'yield' rodaria no SHUTDOWN (quando a API desliga)
    # Como não precisamos limpar nada, deixamos vazio.


# Passamos o lifespan na criação
app = FastAPI(title="De Olho na Segurança - Motor de Dados", lifespan=lifespan)

# Configuração do CORS (O '# type: ignore' cala o falso positivo do PyCharm)
app.add_middleware(
    CORSMiddleware,  # type: ignore
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Conectando as rotas ao aplicativo principal
app.include_router(dashboard.router)