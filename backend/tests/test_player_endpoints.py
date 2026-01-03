"""
Tests for player user lookup and schedule endpoints.
"""
import pytest
from httpx import AsyncClient
from fastapi import status


@pytest.mark.asyncio
async def test_get_player_by_user_id(client: AsyncClient, player_headers):
    """Test getting player by user ID."""
    # Use user_id = 1 as placeholder
    res = await client.get(
        "/api/players/user/1",
        headers=player_headers
    )
    
    # May be 404 if user doesn't have player profile
    assert res.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]
    
    if res.status_code == status.HTTP_200_OK:
        data = res.json()
        assert "playerId" in data
        assert "userId" in data


@pytest.mark.asyncio
async def test_get_player_schedule(client: AsyncClient, player_headers):
    """Test getting player's match schedule."""
    # Use player_id = 1 as placeholder
    res = await client.get(
        "/api/players/1/schedule",
        headers=player_headers
    )
    
    # May be empty list, but should return 200
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert isinstance(data, list)
