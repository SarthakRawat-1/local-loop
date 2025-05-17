from pydantic import BaseModel, Field
from typing import Optional, Dict
from datetime import datetime
from uuid import UUID

from app.models.item import ItemType, CategoryEnum


class LocationModel(BaseModel):
    lat: float
    lng: float


class ItemBase(BaseModel):
    title: str
    description: str
    category: CategoryEnum
    type: ItemType
    start_date: datetime = Field(alias="startDate")
    end_date: datetime = Field(alias="endDate")
    address: str
    location: LocationModel
    image: Optional[str] = None


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[CategoryEnum] = None
    type: Optional[ItemType] = None
    start_date: Optional[datetime] = Field(default=None, alias="startDate")
    end_date: Optional[datetime] = Field(default=None, alias="endDate")
    address: Optional[str] = None
    location: Optional[LocationModel] = None
    image: Optional[str] = None


class ItemUpdateCount(BaseModel):
    count: int  # Define the ItemUpdateCount schema here


class ItemResponse(BaseModel):
    id: UUID
    title: str
    description: str
    category: CategoryEnum
    type: ItemType
    start_date: datetime = Field(alias="startDate")
    end_date: datetime = Field(alias="endDate")
    address: str
    location: LocationModel
    image: Optional[str] = None
    created_by: UUID = Field(alias="createdBy")
    created_at: datetime = Field(alias="createdAt")
    updated_at: datetime = Field(alias="updatedAt")
    count: int

    class Config:
        from_attributes = True
        populate_by_name = True
        allow_population_by_field_name = True

    @classmethod
    def from_orm(cls, item):
        # Create a copy of the item to avoid modifying the original
        item_copy = item.__dict__.copy()

        # Map fields to match frontend expectations
        item_copy["created_by"] = item.user_id
        item_copy["location"] = {"lat": item.latitude, "lng": item.longitude}

        return cls.model_validate(item_copy)


class FilterOptions(BaseModel):
    category: Optional[CategoryEnum] = None
    type: Optional[ItemType] = None
    search_term: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None