from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.services.data_service import iniciar_motor_dados
from app.api.routers import dashboard
from app.api.routers import cnpj

app = FastAPI()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: carrega toda a base de dados em memória antes de aceitar requests
    app.state.df_cat = await iniciar_motor_dados()
    yield
    # Shutdown: espaço para liberar recursos se necessário


app = FastAPI(
    title=settings.app_title,
    version=settings.app_version,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,  # type: ignore
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Rotas
app.include_router(dashboard.router)
app.include_router(cnpj.router)