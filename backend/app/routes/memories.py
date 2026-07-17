from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..models import Memory, ApiKey
from ..schemas import MemoryCreate, MemoryResponse
from ..decay import decay_text
from ..config import settings
from ..dependencies.auth import get_api_key

router = APIRouter(prefix="/memories", tags=["memories"])


@router.post("", response_model=MemoryResponse, status_code=201)
async def create_memory(
    payload: MemoryCreate,
    db: AsyncSession = Depends(get_db),
    api_key: ApiKey = Depends(get_api_key),
):
    memory = Memory(
        content=payload.content,
        original_content=payload.content,
        memory_type=payload.memory_type or "text",
        health_score=settings.health_max,
        owner_key=api_key.key,
    )
    db.add(memory)
    await db.commit()
    await db.refresh(memory)
    return memory


@router.get("/{memory_id}", response_model=MemoryResponse)
async def get_memory(
    memory_id: UUID,
    db: AsyncSession = Depends(get_db),
    api_key: ApiKey = Depends(get_api_key),
):
    result = await db.execute(
        select(Memory).where(Memory.id == memory_id, Memory.owner_key == api_key.key)
    )
    memory = result.scalar_one_or_none()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")

    restore = settings.observe_restore_amount
    new_health = min(memory.health_score + restore, settings.health_max)
    await db.execute(
        update(Memory)
        .where(Memory.id == memory_id)
        .values(
            health_score=new_health,
            last_accessed_at=datetime.utcnow(),
            times_observed=Memory.times_observed + 1,
        )
    )
    await db.commit()
    await db.refresh(memory)

    memory.content = decay_text(memory.content, memory.health_score)
    return memory


@router.post("/{memory_id}/upvote", response_model=MemoryResponse)
async def upvote_memory(
    memory_id: UUID,
    db: AsyncSession = Depends(get_db),
    api_key: ApiKey = Depends(get_api_key),
):
    result = await db.execute(
        select(Memory).where(Memory.id == memory_id, Memory.owner_key == api_key.key)
    )
    memory = result.scalar_one_or_none()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")

    restore = settings.upvote_restore_amount
    new_health = min(memory.health_score + restore, settings.health_max)
    await db.execute(
        update(Memory)
        .where(Memory.id == memory_id)
        .values(
            health_score=new_health,
            last_accessed_at=datetime.utcnow(),
            times_upvoted=Memory.times_upvoted + 1,
        )
    )
    await db.commit()
    await db.refresh(memory)

    memory.content = decay_text(memory.content, memory.health_score)
    return memory
