from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    secret_key: str
    anthropic_api_key: str
    allowed_origins: str = "http://localhost:3000"  # comma-separated list
    gmail_user: str
    gmail_app_password: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 1 day

    class Config:
        env_file = ".env"


settings = Settings()
