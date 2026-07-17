from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from ..database import get_db
from ..models import Memory
from ..schemas import MemoryExplore
from ..decay import generate_decay_preview, decay_text

router = APIRouter(prefix="/explore", tags=["explore"])


@router.get("", response_model=list[MemoryExplore])
async def explore_memories(
    limit: int = Query(default=50, le=100),
    include_dead: bool = Query(default=False),
    db: AsyncSession = Depends(get_db),
):
    query = select(Memory).order_by(desc(Memory.last_accessed_at)).limit(limit)
    if not include_dead:
        query = query.where(Memory.is_alive == 1)

    result = await db.execute(query)
    memories = result.scalars().all()

    response = []
    for m in memories:
        preview = generate_decay_preview(m.original_content, m.health_score)
        decayed_content = decay_text(m.content, m.health_score)
        response.append(MemoryExplore(
            id=m.id,
            content=decayed_content,
            original_content=m.original_content,
            health_score=m.health_score,
            memory_type=m.memory_type,
            times_observed=m.times_observed,
            times_upvoted=m.times_upvoted,
            created_at=m.created_at,
            last_accessed_at=m.last_accessed_at,
            is_alive=bool(m.is_alive),
            decay_preview=preview,
        ))
    return response


@router.get("/cemetery", response_model=list[MemoryExplore])
async def cemetery(
    limit: int = Query(default=20, le=100),
    db: AsyncSession = Depends(get_db),
):
    query = (
        select(Memory)
        .where(Memory.is_alive == 0)
        .order_by(desc(Memory.died_at))
        .limit(limit)
    )
    result = await db.execute(query)
    memories = result.scalars().all()

    response = []
    for m in memories:
        response.append(MemoryExplore(
            id=m.id,
            content="<DATA CORRUPTED>",
            original_content=m.original_content,
            health_score=0,
            memory_type=m.memory_type,
            times_observed=m.times_observed,
            times_upvoted=m.times_upvoted,
            created_at=m.created_at,
            last_accessed_at=m.last_accessed_at,
            is_alive=False,
            decay_preview="<EXPIRED>",
        ))
    return response
