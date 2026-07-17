from celery import Celery
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from .config import settings
from .decay import decay_text

celery_app = Celery(
    "entropy",
    broker=settings.celery_broker_url,
    backend=settings.redis_url,
)

celery_app.conf.beat_schedule = {
    "decay-memories-every-hour": {
        "task": "app.tasks.decay_all_memories",
        "schedule": settings.decay_interval_minutes * 60,
    },
}
celery_app.conf.timezone = "UTC"


@celery_app.task
def decay_all_memories():
    import asyncio
    asyncio.run(_decay_all_memories())


async def _decay_all_memories():
    engine = create_async_engine(settings.database_url)
    async with engine.begin() as conn:
        result = await conn.execute(
            text("""
                UPDATE memories
                SET health_score = GREATEST(0, health_score - :decay)
                WHERE is_alive = 1
            """),
            {"decay": settings.decay_amount_per_tick},
        )

        await conn.execute(
            text("""
                UPDATE memories
                SET is_alive = 0, died_at = NOW()
                WHERE health_score <= :threshold AND is_alive = 1
            """),
            {"threshold": settings.death_threshold},
        )

    await engine.dispose()
    return {"decayed": result.rowcount}


@celery_app.task
def resurrect_expired():
    import asyncio
    asyncio.run(_resurrect_dead())


async def _resurrect_dead():
    """For flavor: a tiny chance a dead memory resurrects."""
    engine = create_async_engine(settings.database_url)
    async with engine.begin() as conn:
        await conn.execute(
            text("""
                UPDATE memories
                SET is_alive = 1, health_score = 10, died_at = NULL
                WHERE is_alive = 0 AND RANDOM() < 0.01
            """),
        )
    await engine.dispose()
