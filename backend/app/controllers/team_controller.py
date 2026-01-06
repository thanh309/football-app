"""
TeamController - Team HTTP endpoints.
Thin controller that delegates to TeamService.
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.team_service import TeamService
from app.schemas.team import (
    TeamProfileResponse, TeamProfileCreate, TeamProfileUpdate,
    JoinRequestResponse, JoinRequestCreate,
    TeamRosterResponse, RosterAddPlayerRequest, RosterUpdateRoleRequest
)
from app.schemas.common import MessageResponse
from app.dependencies.auth import get_current_user
from app.models.user import UserAccount
from app.repositories.player_repository import PlayerRepository
from app.repositories.team_repository import JoinRequestRepository

router = APIRouter()


def get_team_service(db: AsyncSession = Depends(get_db)) -> TeamService:
    return TeamService(db)


def team_to_response(team) -> TeamProfileResponse:
    return TeamProfileResponse(
        teamId=team.team_id,
        teamName=team.team_name,
        description=team.description,
        logoUrl=team.logo.storage_path if team.logo else None,
        leaderId=team.leader_id,
        status=team.status.value,
        rejectionReason=team.rejection_reason,
        location=team.location,
        latitude=team.latitude,
        longitude=team.longitude,
        skillLevel=team.skill_level,
        createdAt=team.created_at.isoformat(),
        updatedAt=team.updated_at.isoformat(),
    )


@router.post("", response_model=TeamProfileResponse, status_code=status.HTTP_201_CREATED)
async def create_team(
    data: TeamProfileCreate,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service)
):
    """Create a new team."""
    try:
        team = await team_service.create_team(
            leader_id=user.user_id,
            team_name=data.teamName,
            description=data.description,
            location=data.location,
            latitude=data.latitude,
            longitude=data.longitude,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    return team_to_response(team)


@router.get("/my-teams", response_model=List[TeamProfileResponse])
async def get_my_teams(
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service)
):
    """Get teams where current user is leader."""
    teams = await team_service.get_teams_by_leader(user.user_id)
    return [team_to_response(t) for t in teams]


@router.get("/user/{user_id}", response_model=List[TeamProfileResponse])
async def get_user_teams(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get teams where user is a member (by user_id, not player_id)."""
    from app.repositories.team_repository import RosterRepository, TeamRepository
    
    # First, find the player profile by user_id
    player_repo = PlayerRepository(db)
    player = await player_repo.find_by_user_id(user_id)
    if not player:
        return []  # User has no player profile, so no teams
    
    roster_repo = RosterRepository(db)
    team_repo = TeamRepository(db)
    
    roster_entries = await roster_repo.find_by_player(player.player_id)
    teams = []
    for entry in roster_entries:
        if entry.is_active:
            team = await team_repo.find_by_id(entry.team_id)
            if team:
                teams.append(team)
    
    return [team_to_response(t) for t in teams]


@router.get("/player/{player_id}", response_model=List[TeamProfileResponse])
async def get_player_teams(
    player_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get teams where player is a member."""
    from app.repositories.team_repository import RosterRepository, TeamRepository
    
    roster_repo = RosterRepository(db)
    team_repo = TeamRepository(db)
    
    roster_entries = await roster_repo.find_by_player(player_id)
    teams = []
    for entry in roster_entries:
        if entry.is_active:
            team = await team_repo.find_by_id(entry.team_id)
            if team:
                teams.append(team)
    
    return [team_to_response(t) for t in teams]


@router.get("/{team_id}", response_model=TeamProfileResponse)
async def get_team(
    team_id: int,
    team_service: TeamService = Depends(get_team_service)
):
    """Get team by ID."""
    team = await team_service.get_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    return team_to_response(team)


@router.put("/{team_id}", response_model=TeamProfileResponse)
async def update_team(
    team_id: int,
    data: TeamProfileUpdate,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service)
):
    """Update team (leader only)."""
    team = await team_service.get_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    if team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    updated = await team_service.update_team(team, **data.model_dump(exclude_unset=True))
    return team_to_response(updated)


@router.delete("/{team_id}", response_model=MessageResponse)
async def delete_team(
    team_id: int,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service)
):
    """Delete team (leader only)."""
    team = await team_service.get_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    if team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    await team_service.delete_team(team)
    return MessageResponse(message="Team deleted")


# --- Join Requests ---

@router.get("/{team_id}/join-requests", response_model=List[JoinRequestResponse])
async def get_join_requests(
    team_id: int,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service)
):
    """Get pending join requests (leader only)."""
    team = await team_service.get_team_by_id(team_id)
    if not team or team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    requests = await team_service.get_pending_requests(team_id)
    return [
        JoinRequestResponse(
            requestId=r.request_id,
            teamId=r.team_id,
            playerId=r.player_id,
            status=r.status.value,
            message=r.message,
            createdAt=r.created_at.isoformat(),
            processedAt=r.processed_at.isoformat() if r.processed_at else None,
        ) for r in requests
    ]


@router.post("/{team_id}/join-requests", response_model=JoinRequestResponse, status_code=status.HTTP_201_CREATED)
async def request_to_join(
    team_id: int,
    data: JoinRequestCreate,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
    db: AsyncSession = Depends(get_db)
):
    """Request to join a team."""
    from app.repositories.team_repository import RosterRepository
    
    # Check if user is the team leader
    team = await team_service.get_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    if team.leader_id == user.user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You are the leader of this team.")
    
    player_repo = PlayerRepository(db)
    player = await player_repo.find_by_user_id(user.user_id)
    if not player:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You need to be a player to join a team.")
    
    # Check if already a member of this team
    roster_repo = RosterRepository(db)
    existing_member = await roster_repo.find_by_team_and_player(team_id, player.player_id)
    if existing_member and existing_member.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You are already a member of this team.")
    
    try:
        request = await team_service.create_join_request(team_id, player.player_id, data.message)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    return JoinRequestResponse(
        requestId=request.request_id,
        teamId=request.team_id,
        playerId=request.player_id,
        status=request.status.value,
        message=request.message,
        createdAt=request.created_at.isoformat(),
        processedAt=None,
    )


@router.put("/join-requests/{request_id}/{action}", response_model=MessageResponse)
async def process_join_request(
    request_id: int,
    action: str,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
    db: AsyncSession = Depends(get_db)
):
    """Accept or reject join request."""
    if action not in ["accept", "reject"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid action")
    
    join_request_repo = JoinRequestRepository(db)
    request = await join_request_repo.find_by_id(request_id)
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found")
    
    team = await team_service.get_team_by_id(request.team_id)
    if not team or team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    await team_service.process_join_request(request, action == "accept")
    return MessageResponse(message=f"Request {action}ed")


# --- Team Roster ---

def roster_to_response(r) -> TeamRosterResponse:
    """Convert roster model to response."""
    return TeamRosterResponse(
        rosterId=r.roster_id,
        teamId=r.team_id,
        playerId=r.player_id,
        role=r.role.value,
        joinedAt=r.joined_at.isoformat(),
        isActive=r.is_active,
    )


@router.get("/{team_id}/roster", response_model=List[TeamRosterResponse])
async def get_team_roster(
    team_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get team roster."""
    from app.repositories.team_repository import RosterRepository
    roster_repo = RosterRepository(db)
    roster = await roster_repo.find_by_team(team_id)
    return [roster_to_response(r) for r in roster]


@router.post("/{team_id}/roster", response_model=TeamRosterResponse, status_code=status.HTTP_201_CREATED)
async def add_player_to_roster(
    team_id: int,
    data: RosterAddPlayerRequest,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
    db: AsyncSession = Depends(get_db)
):
    """Add player to team roster (leader only)."""
    from app.repositories.team_repository import RosterRepository
    from app.models.team import TeamRoster
    from app.models.enums import RosterRole
    
    team = await team_service.get_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    if team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    roster_repo = RosterRepository(db)
    existing = await roster_repo.find_by_team_and_player(team_id, data.playerId)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Player already in roster")
    
    roster_entry = TeamRoster(
        team_id=team_id,
        player_id=data.playerId,
        role=RosterRole(data.role) if data.role else RosterRole.MEMBER,
    )
    await roster_repo.save(roster_entry)
    await roster_repo.commit()
    
    return roster_to_response(roster_entry)


@router.delete("/{team_id}/roster/{player_id}", response_model=MessageResponse)
async def remove_player_from_roster(
    team_id: int,
    player_id: int,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
    db: AsyncSession = Depends(get_db)
):
    """Remove player from team roster (leader only)."""
    from app.repositories.team_repository import RosterRepository
    
    team = await team_service.get_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    if team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    roster_repo = RosterRepository(db)
    roster_entry = await roster_repo.find_by_team_and_player(team_id, player_id)
    if not roster_entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Player not in roster")
    
    await roster_repo.delete(roster_entry)
    await roster_repo.commit()
    
    return MessageResponse(message="Player removed from roster")


@router.put("/roster/{roster_id}", response_model=TeamRosterResponse)
async def update_player_role(
    roster_id: int,
    data: RosterUpdateRoleRequest,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
    db: AsyncSession = Depends(get_db)
):
    """Update player role in roster (leader only)."""
    from app.repositories.team_repository import RosterRepository
    from app.models.enums import RosterRole
    
    roster_repo = RosterRepository(db)
    roster_entry = await roster_repo.find_by_id(roster_id)
    if not roster_entry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Roster entry not found")
    
    team = await team_service.get_team_by_id(roster_entry.team_id)
    if not team or team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    roster_entry.role = RosterRole(data.role)
    await roster_repo.update(roster_entry)
    await roster_repo.commit()
    
    return roster_to_response(roster_entry)


# --- Team Wallet & Finance ---
from pydantic import BaseModel
from decimal import Decimal
from sqlalchemy import select

class WalletResponse(BaseModel):
    """Team wallet response."""
    walletId: int
    teamId: int
    balance: float
    createdAt: str
    updatedAt: str


class TransactionResponse(BaseModel):
    """Transaction log response."""
    transactionId: int
    walletId: int
    type: str
    amount: float
    description: Optional[str]
    category: Optional[str]
    createdBy: int
    createdAt: str


class TransactionCreate(BaseModel):
    """Create transaction request."""
    type: str  # DEPOSIT, WITHDRAWAL, EXPENSE, INCOME
    amount: float
    description: Optional[str] = None
    category: Optional[str] = None


@router.get("/{team_id}/wallet", response_model=WalletResponse)
async def get_team_wallet(
    team_id: int,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
    db: AsyncSession = Depends(get_db)
):
    """Get team wallet (team leader only)."""
    from app.models.team import TeamWallet
    
    team = await team_service.get_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    if team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    result = await db.execute(select(TeamWallet).where(TeamWallet.team_id == team_id))
    wallet = result.scalar_one_or_none()
    
    if not wallet:
        # Create wallet if it doesn't exist
        wallet = TeamWallet(team_id=team_id, balance=Decimal("0.00"))
        db.add(wallet)
        await db.commit()
    
    return WalletResponse(
        walletId=wallet.wallet_id,
        teamId=wallet.team_id,
        balance=float(wallet.balance),
        createdAt=wallet.created_at.isoformat(),
        updatedAt=wallet.updated_at.isoformat(),
    )


@router.get("/{team_id}/wallet/transactions", response_model=List[TransactionResponse])
async def get_wallet_transactions(
    team_id: int,
    limit: int = 50,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
    db: AsyncSession = Depends(get_db)
):
    """Get team wallet transactions (team leader only)."""
    from app.models.team import TeamWallet, TransactionLog
    
    team = await team_service.get_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    if team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    result = await db.execute(select(TeamWallet).where(TeamWallet.team_id == team_id))
    wallet = result.scalar_one_or_none()
    
    if not wallet:
        return []
    
    result = await db.execute(
        select(TransactionLog)
        .where(TransactionLog.wallet_id == wallet.wallet_id)
        .order_by(TransactionLog.created_at.desc())
        .limit(limit)
    )
    transactions = result.scalars().all()
    
    return [
        TransactionResponse(
            transactionId=t.transaction_id,
            walletId=t.wallet_id,
            type=t.type.value,
            amount=float(t.amount),
            description=t.description,
            category=t.category,
            createdBy=t.created_by,
            createdAt=t.created_at.isoformat(),
        ) for t in transactions
    ]


@router.post("/{team_id}/wallet/deposit", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def deposit_funds(
    team_id: int,
    data: TransactionCreate,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
    db: AsyncSession = Depends(get_db)
):
    """Deposit funds to team wallet (team leader only)."""
    from app.models.team import TeamWallet, TransactionLog
    from app.models.enums import TransactionType
    
    team = await team_service.get_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    if team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    result = await db.execute(select(TeamWallet).where(TeamWallet.team_id == team_id))
    wallet = result.scalar_one_or_none()
    
    if not wallet:
        wallet = TeamWallet(team_id=team_id, balance=Decimal("0.00"))
        db.add(wallet)
        await db.commit()
        await db.refresh(wallet)
    
    # Add funds
    wallet.balance = wallet.balance + Decimal(str(data.amount))
    
    # Log transaction
    transaction = TransactionLog(
        wallet_id=wallet.wallet_id,
        type=TransactionType.INCOME,
        amount=Decimal(str(data.amount)),
        description=data.description or "Deposit",
        category=data.category,
        created_by=user.user_id,
    )
    db.add(transaction)
    await db.commit()
    
    return TransactionResponse(
        transactionId=transaction.transaction_id,
        walletId=transaction.wallet_id,
        type=transaction.type.value,
        amount=float(transaction.amount),
        description=transaction.description,
        category=transaction.category,
        createdBy=transaction.created_by,
        createdAt=transaction.created_at.isoformat(),
    )


@router.post("/{team_id}/wallet/withdraw", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def withdraw_funds(
    team_id: int,
    data: TransactionCreate,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
    db: AsyncSession = Depends(get_db)
):
    """Withdraw funds from team wallet (team leader only)."""
    from app.models.team import TeamWallet, TransactionLog
    from app.models.enums import TransactionType
    
    team = await team_service.get_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    if team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    result = await db.execute(select(TeamWallet).where(TeamWallet.team_id == team_id))
    wallet = result.scalar_one_or_none()
    
    if not wallet:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Wallet not found")
    
    if wallet.balance < Decimal(str(data.amount)):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Insufficient funds")
    
    # Subtract funds
    wallet.balance = wallet.balance - Decimal(str(data.amount))
    
    # Log transaction
    transaction = TransactionLog(
        wallet_id=wallet.wallet_id,
        type=TransactionType.EXPENSE,
        amount=Decimal(str(data.amount)),
        description=data.description or "Withdrawal",
        category=data.category,
        created_by=user.user_id,
    )
    db.add(transaction)
    await db.commit()
    
    return TransactionResponse(
        transactionId=transaction.transaction_id,
        walletId=transaction.wallet_id,
        type=transaction.type.value,
        amount=float(transaction.amount),
        description=transaction.description,
        category=transaction.category,
        createdBy=transaction.created_by,
        createdAt=transaction.created_at.isoformat(),
    )


@router.post("/{team_id}/wallet/expense", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def record_expense(
    team_id: int,
    data: TransactionCreate,
    user: UserAccount = Depends(get_current_user),
    team_service: TeamService = Depends(get_team_service),
    db: AsyncSession = Depends(get_db)
):
    """Record an expense (team leader only)."""
    from app.models.team import TeamWallet, TransactionLog
    from app.models.enums import TransactionType
    
    team = await team_service.get_team_by_id(team_id)
    if not team:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team not found")
    if team.leader_id != user.user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    result = await db.execute(select(TeamWallet).where(TeamWallet.team_id == team_id))
    wallet = result.scalar_one_or_none()
    
    if not wallet:
        wallet = TeamWallet(team_id=team_id, balance=Decimal("0.00"))
        db.add(wallet)
        await db.commit()
        await db.refresh(wallet)
    
    # Subtract expense
    wallet.balance = wallet.balance - Decimal(str(data.amount))
    
    # Log transaction
    transaction = TransactionLog(
        wallet_id=wallet.wallet_id,
        type=TransactionType.EXPENSE,
        amount=Decimal(str(data.amount)),
        description=data.description or "Expense",
        category=data.category,
        created_by=user.user_id,
    )
    db.add(transaction)
    await db.commit()
    
    return TransactionResponse(
        transactionId=transaction.transaction_id,
        walletId=transaction.wallet_id,
        type=transaction.type.value,
        amount=float(transaction.amount),
        description=transaction.description,
        category=transaction.category,
        createdBy=transaction.created_by,
        createdAt=transaction.created_at.isoformat(),
    )
