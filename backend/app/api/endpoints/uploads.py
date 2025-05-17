from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from typing import Optional

from app.models.user import User
from app.middleware.auth import get_current_user
from app.utils.image_handler import save_upload_file

router = APIRouter()


@router.post("/uploads", status_code=status.HTTP_201_CREATED)
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image",
        )
    
    file_path = await save_upload_file(file)
    
    return {"url": file_path}
