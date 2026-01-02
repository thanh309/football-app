"""
Team-related schemas matching frontend types.
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel


# --- Team Profile ---
class TeamProfileCreate(BaseModel):
    """Team profile creation matching frontend CreateTeamRequest."""
    teamName: str
    description: Optional[str] = None
    logoUrl: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class TeamProfileUpdate(BaseModel):
    """Team profile update."""
    teamName: Optional[str] = None
    description: Optional[str] = None
    logoUrl: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    skillLevel: Optional[int] = None


class TeamProfileResponse(BaseModel):
    """Team profile response matching frontend TeamProfile type."""
    teamId: int
    teamName: str
    description: Optional[str] = None
    logoUrl: Optional[str] = None
    leaderId: int
    status: str
    rejectionReason: Optional[str] = None
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    skillLevel: Optional[int] = None
    createdAt: str
    updatedAt: str
    
    class Config:
        from_attributes = True


# --- Team Roster ---
class TeamRosterResponse(BaseModel):
    """Team roster entry response matching frontend TeamRoster type."""
    rosterId: int
    teamId: int
    playerId: int
    role: str
    joinedAt: str
    isActive: bool
    
    class Config:
        from_attributes = True


# --- Join Request ---
class JoinRequestCreate(BaseModel):
    """Join request creation."""
    message: Optional[str] = None


class JoinRequestResponse(BaseModel):
    """Join request response matching frontend JoinRequest type."""
    requestId: int
    teamId: int
    playerId: int
    status: str
    message: Optional[str] = None
    createdAt: str
    processedAt: Optional[str] = None
    
    class Config:
        from_attributes = True


# --- Team Wallet ---
class TeamWalletResponse(BaseModel):
    """Team wallet response matching frontend TeamWallet type."""
    walletId: int
    teamId: int
    balance: float
    createdAt: str
    updatedAt: str
    
    class Config:
        from_attributes = True


# --- Transaction Log ---
class TransactionLogCreate(BaseModel):
    """Transaction creation matching frontend AddTransactionRequest."""
    type: str
    amount: float
    description: Optional[str] = None
    category: Optional[str] = None


class TransactionLogResponse(BaseModel):
    """Transaction response matching frontend TransactionLog type."""
    transactionId: int
    walletId: int
    type: str
    amount: float
    description: Optional[str] = None
    category: Optional[str] = None
    createdBy: int
    createdAt: str
    
    class Config:
        from_attributes = True
