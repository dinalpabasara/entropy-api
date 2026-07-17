from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..models import ApiKey
from ..schemas import RegisterRequest, ApiKeyResponse, ApiKeyInfo
from ..dependencies.auth import generate_api_key, hash_key, get_api_key

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=ApiKeyResponse)
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)):
    raw_key = generate_api_key()
    key_hash = hash_key(raw_key)

    existing = await db.execute(select(ApiKey).where(ApiKey.key == key_hash))
    while existing.scalar_one_or_none():
        raw_key = generate_api_key()
        key_hash = hash_key(raw_key)
        existing = await db.execute(select(ApiKey).where(ApiKey.key == key_hash))

    api_key = ApiKey(
        key=key_hash,
        email=payload.email,
        name=payload.name,
    )
    db.add(api_key)
    await db.commit()

    return ApiKeyResponse(api_key=raw_key)


@router.get("/info", response_model=ApiKeyInfo)
async def key_info(api_key: ApiKey = Depends(get_api_key)):
    return ApiKeyInfo(
        key_prefix=api_key.key[:12] + "...",
        is_active=bool(api_key.is_active),
        created_at=api_key.created_at,
        rate_limit_per_hour=api_key.rate_limit_per_hour,
        requests_this_hour=api_key.requests_this_hour,
    )


@router.post("/revoke")
async def revoke(
    api_key: ApiKey = Depends(get_api_key),
    db: AsyncSession = Depends(get_db),
):
    api_key.is_active = 0
    await db.commit()
    return {"message": "API key revoked"}
