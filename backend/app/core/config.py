"""
config.py

Configurações centralizadas da aplicação FastAPI.
Lê variáveis de ambiente com fallback para valores padrão de desenvolvimento.

Uso:
    from app.core.config import settings
    print(settings.api_host)
"""

import os


class Settings:
    """Configurações da aplicação lidas do ambiente."""

    # Servidor
    api_host: str = os.getenv("API_HOST", "0.0.0.0")
    api_port: int = int(os.getenv("API_PORT", "8000"))

    # CORS — origens permitidas (separadas por vírgula em produção)
    # Ex: ALLOWED_ORIGINS=https://meusite.com,https://outro.com
    allowed_origins: list[str] = os.getenv("ALLOWED_ORIGINS", "*").split(",")

    # Metadados da API
    app_title: str = "De Olho na Segurança — Motor de Dados"
    app_version: str = "1.0.0"


settings = Settings()
