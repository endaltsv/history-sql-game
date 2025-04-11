from pydantic_settings import BaseSettings
from typing import Optional


# TODO: Сделать нужным
class Settings(BaseSettings):
    PROJECT_NAME: str = "SQL Game"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "SQL Learning Game API"
    
    # Database
    DATABASE_URL: str
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Superuser
    FIRST_SUPERUSER: str
    FIRST_SUPERUSER_PASSWORD: str
    
    class Config:
        env_file = ".env"

settings = Settings() 