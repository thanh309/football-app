"""
MediaController - Media upload HTTP endpoints.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
import os
import uuid
from datetime import datetime

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import UserAccount
from app.models.media import MediaAsset
from app.models.enums import MediaType, MediaOwnerType

router = APIRouter()

# Storage path for uploads
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")


class MediaAssetResponse(BaseModel):
    """Media asset response."""
    assetId: int
    ownerId: int
    ownerType: str
    entityId: int
    fileName: str
    storagePath: str
    fileType: str
    fileSize: int
    mimeType: str
    createdAt: str
    
    class Config:
        from_attributes = True


def asset_to_response(a: MediaAsset) -> MediaAssetResponse:
    return MediaAssetResponse(
        assetId=a.asset_id,
        ownerId=a.owner_id,
        ownerType=a.owner_type.value,
        entityId=a.entity_id,
        fileName=a.file_name,
        storagePath=a.storage_path,
        fileType=a.file_type.value,
        fileSize=a.file_size,
        mimeType=a.mime_type,
        createdAt=a.created_at.isoformat(),
    )


@router.post("/upload", response_model=MediaAssetResponse, status_code=status.HTTP_201_CREATED)
async def upload_media(
    file: UploadFile = File(...),
    owner_type: str = Form(...),
    entity_id: int = Form(...),
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Upload a media file."""
    # Validate file type
    allowed_types = {
        "image/jpeg": MediaType.IMAGE,
        "image/png": MediaType.IMAGE,
        "image/gif": MediaType.IMAGE,
        "image/webp": MediaType.IMAGE,
        "video/mp4": MediaType.VIDEO,
        "video/webm": MediaType.VIDEO,
        "application/pdf": MediaType.DOCUMENT,
    }
    
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Unsupported file type: {file.content_type}"
        )
    
    # Validate owner type
    try:
        owner_type_enum = MediaOwnerType(owner_type)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid owner type")
    
    # Create upload directory if it doesn't exist
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    
    # Generate unique filename
    ext = os.path.splitext(file.filename)[1] if file.filename else ".bin"
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    storage_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    content = await file.read()
    with open(storage_path, "wb") as f:
        f.write(content)
    
    # Create database record
    asset = MediaAsset(
        owner_id=user.user_id,
        owner_type=owner_type_enum,
        entity_id=entity_id,
        file_name=file.filename or unique_filename,
        storage_path=f"/uploads/{unique_filename}",
        file_type=allowed_types[file.content_type],
        file_size=len(content),
        mime_type=file.content_type,
    )
    
    db.add(asset)
    await db.commit()
    
    return asset_to_response(asset)


@router.get("/{asset_id}", response_model=MediaAssetResponse)
async def get_media(
    asset_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get media asset by ID."""
    result = await db.execute(
        select(MediaAsset).where(MediaAsset.asset_id == asset_id)
    )
    asset = result.scalar_one_or_none()
    
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media asset not found")
    
    return asset_to_response(asset)


@router.get("/entity/{owner_type}/{entity_id}", response_model=List[MediaAssetResponse])
async def get_entity_media(
    owner_type: str,
    entity_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get all media for an entity."""
    try:
        owner_type_enum = MediaOwnerType(owner_type)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid owner type")
    
    result = await db.execute(
        select(MediaAsset).where(
            MediaAsset.owner_type == owner_type_enum,
            MediaAsset.entity_id == entity_id
        )
    )
    assets = result.scalars().all()
    
    return [asset_to_response(a) for a in assets]


@router.delete("/{asset_id}", response_model=dict)
async def delete_media(
    asset_id: int,
    user: UserAccount = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a media asset."""
    result = await db.execute(
        select(MediaAsset).where(MediaAsset.asset_id == asset_id)
    )
    asset = result.scalar_one_or_none()
    
    if not asset:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media asset not found")
    
    if asset.owner_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    # Delete file from disk
    full_path = os.path.join(os.path.dirname(__file__), "..", "..", asset.storage_path.lstrip("/"))
    if os.path.exists(full_path):
        os.remove(full_path)
    
    await db.delete(asset)
    await db.commit()
    
    return {"message": "Media asset deleted"}
