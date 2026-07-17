import hashlib
import secrets
from datetime import datetime

from fastapi import Header, HTTPException, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..models import ApiKey
from ..config import settings


def generate_api_key() -> str:
    return "ent_" + secrets.token_hex(32)


def hash_key(key: str) -> str:
    return hashlib.sha256(key.encode()).hexdigest()


async def get_api_key(
    x_api_key: str = Header(..., alias="X-API-Key"),
    db: AsyncSession = Depends(get_db),
) -> ApiKey:
    key_hash = hash_key(x_api_key)
    result = await db.execute(select(ApiKey).where(
        ApiKey.key == key_hash,
        ApiKey.is_active == 1,
    ))
    api_key = result.scalar_one_or_none()
    if not api_key:
        raise HTTPException(status_code=401, detail="Invalid or inactive API key")

    now = datetime.utcnow()
    if api_key.last_rate_reset:
        hours_since = (now - api_key.last_rate_reset).total_seconds() / 3600
        if hours_since >= 1:
            api_key.requests_this_hour = 0
            api_key.last_rate_reset = now

    if api_key.requests_this_hour >= api_key.rate_limit_per_hour:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded ({api_key.rate_limit_per_hour}/hour)",
        )

    api_key.requests_this_hour += 1
    await db.commit()

    return api_key
