"""
Tests for team finance/wallet endpoints.
"""
import pytest
from httpx import AsyncClient
from fastapi import status


@pytest.mark.asyncio
async def test_get_team_wallet(client: AsyncClient, player_headers, test_team):
    """Test getting team wallet."""
    team_id = test_team["teamId"]
    
    res = await client.get(
        f"/api/teams/{team_id}/wallet",
        headers=player_headers
    )
    
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert "walletId" in data
    assert "teamId" in data
    assert "balance" in data


@pytest.mark.asyncio
async def test_get_wallet_transactions(client: AsyncClient, player_headers, test_team):
    """Test getting wallet transactions."""
    team_id = test_team["teamId"]
    
    res = await client.get(
        f"/api/teams/{team_id}/wallet/transactions",
        headers=player_headers
    )
    
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_deposit_funds(client: AsyncClient, player_headers, test_team):
    """Test depositing funds to wallet."""
    team_id = test_team["teamId"]
    
    res = await client.post(
        f"/api/teams/{team_id}/wallet/deposit",
        json={
            "type": "DEPOSIT",
            "amount": 100.0,
            "description": "Test deposit",
            "category": "Contribution"
        },
        headers=player_headers
    )
    
    assert res.status_code == status.HTTP_201_CREATED
    data = res.json()
    assert data["amount"] == 100.0


@pytest.mark.asyncio
async def test_withdraw_funds(client: AsyncClient, player_headers, test_team):
    """Test withdrawing funds from wallet."""
    team_id = test_team["teamId"]
    
    # First deposit some funds
    await client.post(
        f"/api/teams/{team_id}/wallet/deposit",
        json={"type": "DEPOSIT", "amount": 200.0, "description": "Pre-deposit"},
        headers=player_headers
    )
    
    # Then withdraw
    res = await client.post(
        f"/api/teams/{team_id}/wallet/withdraw",
        json={
            "type": "WITHDRAWAL",
            "amount": 50.0,
            "description": "Test withdrawal"
        },
        headers=player_headers
    )
    
    assert res.status_code == status.HTTP_201_CREATED
    data = res.json()
    assert data["amount"] == 50.0


@pytest.mark.asyncio
async def test_record_expense(client: AsyncClient, player_headers, test_team):
    """Test recording an expense."""
    team_id = test_team["teamId"]
    
    res = await client.post(
        f"/api/teams/{team_id}/wallet/expense",
        json={
            "type": "EXPENSE",
            "amount": 25.0,
            "description": "Field rental",
            "category": "Equipment"
        },
        headers=player_headers
    )
    
    assert res.status_code == status.HTTP_201_CREATED
    data = res.json()
    assert data["amount"] == 25.0
    assert data["category"] == "Equipment"
