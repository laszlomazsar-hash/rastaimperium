from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Rasta Imperium"
    REDIS_URL: str = "redis://localhost:6379"
    SHOW_DOCS: bool = True 

    class Config:
        env_file = ".env"

settings = Settings()