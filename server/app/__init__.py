from fastapi import FastAPI
from app.core.config import settings
from app.api.endpoints import game

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
)

app.include_router(game.router, prefix="/api/game", tags=["game"]) 