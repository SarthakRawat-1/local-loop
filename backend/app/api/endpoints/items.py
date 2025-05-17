from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from uuid import UUID

from app.db.database import get_db
from app.models.item import Item, ItemType, CategoryEnum
from app.models.user import User
from app.schemas.item import ItemCreate, ItemResponse, ItemUpdate,ItemUpdateCount, FilterOptions
from app.middleware.auth import get_current_user
from app.utils.location import get_bounding_box, calculate_distance


router = APIRouter()


@router.get("/", response_model=List[ItemResponse])
async def get_items(
    category: Optional[CategoryEnum] = None,
    type: Optional[ItemType] = None,
    search: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    radius: Optional[float] = 20.0,  # Default radius of 20km
    created_by: Optional[str] = None,  
    db: AsyncSession = Depends(get_db),
):
    print(f"GET /items/ - Params: type={type}, lat={lat}, lng={lng}, radius={radius}, created_by={created_by}")
    
    query = select(Item)
    
    if category:
        query = query.where(Item.category == category)
    if type:
        query = query.where(Item.type == type)
    if search:
        query = query.where(
            or_(
                Item.title.ilike(f"%{search}%"),
                Item.description.ilike(f"%{search}%"),
            )
        )
    if start_date:
        query = query.where(Item.start_date >= start_date)
    if end_date:
        query = query.where(Item.start_date <= end_date)
    if created_by:
        try:
            user_id = UUID(created_by)
            query = query.where(Item.user_id == user_id)
        except ValueError:
            print(f"Invalid UUID format for created_by: {created_by}")
            return []
    
    # Apply location filter if lat and lng are provided
    if lat is not None and lng is not None:
        try:
            # Get bounding box for initial filtering (optimization)
            min_lat, min_lng, max_lat, max_lng = get_bounding_box(lat, lng, radius)
            print(f"Bounding box: min_lat={min_lat}, min_lng={min_lng}, max_lat={max_lat}, max_lng={max_lng}")
            
            query = query.where(
                and_(
                    Item.latitude >= min_lat,
                    Item.latitude <= max_lat,
                    Item.longitude >= min_lng,
                    Item.longitude <= max_lng
                )
            )
        except Exception as e:
            print(f"Error calculating bounding box: {e}")
            pass
    
    result = await db.execute(query)
    items = result.scalars().all()
    print(f"Query returned {len(items)} items before distance filtering")

    processed_items = []
    filtered_out = 0
    
    for item in items:
        if lat is not None and lng is not None:
            try:
                distance = calculate_distance(lat, lng, item.latitude, item.longitude)
                # Only include items within the specified radius
                if distance > radius:
                    filtered_out += 1
                    continue
            except Exception as e:
                print(f"Error calculating distance for item {item.id}: {e}")
                pass
                
        item_dict = {
            "id": str(item.id),
            "type": item.type.value,
            "title": item.title,
            "description": item.description,
            "category": item.category.value,
            "startDate": item.start_date.isoformat(),
            "endDate": item.end_date.isoformat(),
            "address": item.address,
            "location": {
                "lat": item.latitude,
                "lng": item.longitude
            },
            "image": item.image,
            "createdBy": str(item.user_id),
            "createdAt": item.created_at.isoformat(),
            "updatedAt": item.updated_at.isoformat(),
             "count": item.count
        }
        
        if lat is not None and lng is not None:
            try:
                item_dict["distance"] = round(calculate_distance(lat, lng, item.latitude, item.longitude), 1)
            except Exception as e:
                print(f"Error adding distance to item {item.id}: {e}")
                item_dict["distance"] = -1  # Use -1 to indicate unknown distance
            
        processed_items.append(item_dict)
    
    print(f"Returning {len(processed_items)} items after filtering (filtered out {filtered_out} items)")
    return processed_items


@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(
    item_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    query = await db.execute(select(Item).where(Item.id == item_id))
    item = query.scalar_one_or_none()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )
    
    item_dict = {
        "id": str(item.id),
        "type": item.type.value,
        "title": item.title,
        "description": item.description,
        "category": item.category.value,
        "startDate": item.start_date.isoformat(),
        "endDate": item.end_date.isoformat(),
        "address": item.address,
        "location": {
            "lat": item.latitude,
            "lng": item.longitude
        },
        "image": item.image,
        "createdBy": str(item.user_id),
        "createdAt": item.created_at.isoformat(),
        "updatedAt": item.updated_at.isoformat(),
        "count": item.count
    }
    
    return item_dict


@router.post("/", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def create_item(
    item_in: ItemCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    new_item = Item(
        type=item_in.type,
        title=item_in.title,
        description=item_in.description,
        category=item_in.category,
        start_date=item_in.start_date,
        end_date=item_in.end_date,
        address=item_in.address,
        latitude=item_in.location.lat,
        longitude=item_in.location.lng,
        image=item_in.image,
        user_id=current_user.id,
        count=0,
    )
    
    db.add(new_item)
    await db.commit()
    await db.refresh(new_item)
    
    item_dict = {
        "id": str(new_item.id),
        "type": new_item.type.value,
        "title": new_item.title,
        "description": new_item.description,
        "category": new_item.category.value,
        "startDate": new_item.start_date.isoformat(),
        "endDate": new_item.end_date.isoformat(),
        "address": new_item.address,
        "location": {
            "lat": new_item.latitude,
            "lng": new_item.longitude
        },
        "image": new_item.image,
        "createdBy": str(new_item.user_id),
        "createdAt": new_item.created_at.isoformat(),
        "updatedAt": new_item.updated_at.isoformat(),
         "count": new_item.count
    }
    
    return item_dict


@router.patch("/{item_id}", response_model=ItemResponse)
async def update_item(
    item_id: UUID,
    item_update: ItemUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = await db.execute(select(Item).where(Item.id == item_id))
    item = query.scalar_one_or_none()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )

    if item.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this item",
        )

    item_data = item_update.dict(exclude_unset=True)
    for field, value in item_data.items():
        if field == "location" and value:
            setattr(item, "latitude", value.lat)
            setattr(item, "longitude", value.lng)
        elif hasattr(item, field) and value is not None:
            setattr(item, field, value)
    
    await db.commit()
    await db.refresh(item)

    item_dict = {
        "id": str(item.id),
        "type": item.type.value,
        "title": item.title,
        "description": item.description,
        "category": item.category.value,
        "startDate": item.start_date.isoformat(),
        "endDate": item.end_date.isoformat(),
        "address": item.address,
        "location": {
            "lat": item.latitude,
            "lng": item.longitude
        },
        "image": item.image,
        "createdBy": str(item.user_id),
        "createdAt": item.created_at.isoformat(),
        "updatedAt": item.updated_at.isoformat(),
        "count": item.count
    }
    
    return item_dict


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(
    item_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = await db.execute(select(Item).where(Item.id == item_id))
    item = query.scalar_one_or_none()
    
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )

    if item.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this item",
        )

    await db.delete(item)
    await db.commit()

@router.patch("/{item_id}/count", response_model=ItemResponse)
async def update_item_count(
    item_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = await db.execute(select(Item).where(Item.id == item_id))
    item = query.scalar_one_or_none()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )

    # You might want to add authorization checks here to ensure
    # only authorized users can update the count. For example:
    if item.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this item's count",
        )

    item.count += 1 # Increment the count by 1
    await db.commit()
    await db.refresh(item)

    # Construct the response dictionary using the from_orm method
    return ItemResponse.from_orm(item)

@router.get("/{item_id}/count")
async def get_item_count(
    item_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    query = await db.execute(select(Item.count).where(Item.id == item_id))
    count = query.scalar_one_or_none()

    if count is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )

    return {"count": count}
