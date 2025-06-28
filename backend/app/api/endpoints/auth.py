from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, Token
from app.middleware.auth import authenticate_user, get_current_user


router = APIRouter()


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    user = await authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    query = await db.execute(User.__table__.select().where(User.email == user_in.email))
    user = query.scalar_one_or_none()
    
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    new_user = User(
        email=user_in.email,
        name=user_in.name,
        hashed_password=get_password_hash(user_in.password),
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=new_user.id, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/profile", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/profile", response_model=UserResponse)
async def update_profile(
    user_update: dict = Body(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    for field, value in user_update.items():
        if field == "password":
            setattr(current_user, "hashed_password", get_password_hash(value))
        elif hasattr(current_user, field):
            setattr(current_user, field, value)
    
    await db.commit()
    await db.refresh(current_user)
    
    return current_user
from pydantic import BaseModel

class OAuthLoginRequest(BaseModel):
    email: str
    name: str

@router.post("/oauth-login", response_model=Token)
async def oauth_login(
    data: OAuthLoginRequest,
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(User.__table__.select().where(User.email == data.email))
    user = query.scalar_one_or_none()

    if not user:
        # Create a new user (without password)
        user = User(
            email=data.email,
            name=data.name,
            hashed_password=get_password_hash("oauth_placeholder_password")  # optional
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    # Generate access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(subject=user.id, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/oauth-signup", response_model=Token)
async def oauth_signup(
    data: OAuthLoginRequest,
    db: AsyncSession = Depends(get_db)
):
    query = await db.execute(User.__table__.select().where(User.email == data.email))
    user = query.scalar_one_or_none()

    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered. Please login instead.",
        )

    # Create a new user without a password
    new_user = User(
        email=data.email,
        name=data.name,
        hashed_password=get_password_hash("oauth_placeholder_password")  # optional dummy
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # Generate access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(subject=new_user.id, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer"}
