from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, EmailStr


class MemoryCreate(BaseModel):
    content: str
    memory_type: str = "text"


class MemoryResponse(BaseModel):
    id: UUID
    content: str
    original_content: str
    health_score: int
    memory_type: str
    times_observed: int
    times_upvoted: int
    created_at: datetime
    last_accessed_at: datetime
    is_alive: bool

    class Config:
        from_attributes = True


class MemoryExplore(MemoryResponse):
    decay_preview: Optional[str] = None


class MemoryStabilize(BaseModel):
    pass


class DecayInfo(BaseModel):
    id: UUID
    health_score: int
    content: str
    corruption_ratio: float


class RegisterRequest(BaseModel):
    email: Optional[str] = None
    name: Optional[str] = None


class ApiKeyResponse(BaseModel):
    api_key: str
    message: str = "Store this key securely. It will not be shown again."


class ApiKeyInfo(BaseModel):
    key_prefix: str
    is_active: bool
    created_at: datetime
    rate_limit_per_hour: int
    requests_this_hour: int
