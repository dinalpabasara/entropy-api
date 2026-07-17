import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Float, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from .database import Base


class ApiKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, autoincrement=True)
    key = Column(String(64), unique=True, nullable=False, index=True)
    email = Column(String(255), nullable=True)
    name = Column(String(100), nullable=True)
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    rate_limit_per_hour = Column(Integer, default=100)
    last_rate_reset = Column(DateTime, default=datetime.utcnow)
    requests_this_hour = Column(Integer, default=0)


class Memory(Base):
    __tablename__ = "memories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(Text, nullable=False)
    original_content = Column(Text, nullable=False)
    health_score = Column(Integer, default=100, nullable=False)
    memory_type = Column(String(50), default="text")
    metadata_json = Column(Text, nullable=True)
    times_observed = Column(Integer, default=0)
    times_upvoted = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_accessed_at = Column(DateTime, default=datetime.utcnow)
    died_at = Column(DateTime, nullable=True)
    is_alive = Column(Integer, default=1)
    owner_key = Column(String(64), ForeignKey("api_keys.key"), nullable=True)
