from pydantic import field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Rasta Imperium"
    REDIS_URL: str | None = None
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: str | None = None
    SHOW_DOCS: bool = True 

    @field_validator("REDIS_URL", mode="after")
    def assemble_redis_url(cls, value, info):
        if value:
            return value
        data = info.data
        password = data.get("REDIS_PASSWORD")
        auth = f":{password}@" if password else ""
        host = data.get("REDIS_HOST")
        port = data.get("REDIS_PORT")
        db = data.get("REDIS_DB")
        return f"redis://{auth}{host}:{port}/{db}"

    class Config:
        env_file = ".env"

settings = Settings()
