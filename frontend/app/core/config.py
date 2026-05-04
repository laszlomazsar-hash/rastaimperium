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
    ADMIN_API_TOKEN: str | None = None
    STABILITY_TREND_WINDOW_SIZE: int = 6
    STABILITY_MIN_SLOPE_MAGNITUDE: float = 0.2
    STABILITY_REQUIRED_CONSECUTIVE_WINDOWS: int = 2

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
