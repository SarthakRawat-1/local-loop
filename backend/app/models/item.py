from sqlalchemy import Column,Integer, String, DateTime, Float, ForeignKey, Text, Enum, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum

from app.db.database import Base


class ItemType(str, enum.Enum):
    EVENT = "event"
    DEAL = "deal"


class CategoryEnum(str, enum.Enum):
    FOOD = "Food"
    MUSIC = "Music"
    WORKSHOP = "Workshop"
    SALE = "Sale"
    COMMUNITY_MEETUP = "Community Meetup"
    GARAGE_SALE = "Garage Sale"


class Item(Base):
    __tablename__ = "items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type = Column(Enum(ItemType), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(Enum(CategoryEnum), nullable=False)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    address = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    image = Column(String, nullable=True)
    count = Column(Integer, nullable=True, default=0)

    
    # Foreign key to user
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="items")
