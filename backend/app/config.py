from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite+aiosqlite:///./entropy.db"
    redis_url: str = "redis://localhost:6379/0"
    celery_broker_url: str = "redis://localhost:6379/0"
    use_celery: bool = False
    decay_interval_minutes: int = 60
    decay_amount_per_tick: int = 5
    health_max: int = 100
    health_min: int = 0
    death_threshold: int = 0
    upvote_restore_amount: int = 15
    observe_restore_amount: int = 5

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
