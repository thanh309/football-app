"""
Common schemas and enums for API responses.
"""
from typing import TypeVar, Generic, Optional, List
from pydantic import BaseModel


# Generic type for paginated response
T = TypeVar('T')


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response wrapper matching frontend expectations."""
    data: List[T]
    total: int
    page: int
    limit: int
    total_pages: int
    
    class Config:
        from_attributes = True


class MessageResponse(BaseModel):
    """Simple message response."""
    message: str


class ErrorResponse(BaseModel):
    """Error response."""
    detail: str
    code: Optional[str] = None
