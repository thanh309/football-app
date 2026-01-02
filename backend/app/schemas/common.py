"""
Common Pydantic schemas used across the application.
"""
from typing import TypeVar, Generic, List, Optional
from pydantic import BaseModel

T = TypeVar('T')


class MessageResponse(BaseModel):
    """Simple message response."""
    message: str


class ErrorResponse(BaseModel):
    """Error response schema."""
    detail: str
    error_code: Optional[str] = None


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response."""
    items: List[T]
    total: int
    page: int
    page_size: int
    has_next: bool
    has_previous: bool
