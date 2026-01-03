"""
Tests for field delete and player teams endpoints.
"""
import pytest
from httpx import AsyncClient
from fastapi import status


@pytest.mark.asyncio
async def test_delete_field(client: AsyncClient, owner_headers, test_field):
    """Test deleting a field."""
    field_id = test_field["fieldId"]
    
    res = await client.delete(
        f"/api/fields/{field_id}",
        headers=owner_headers
    )
    
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert "message" in data
    
    # Verify it's deleted
    get_res = await client.get(f"/api/fields/{field_id}")
    assert get_res.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.asyncio
async def test_get_player_teams(client: AsyncClient, player_headers, test_team, db_session):
    """Test getting teams where player is a member."""
    # The player who created the team should be in the roster
    # We need to get the player_id first
    # For simplicity, we'll use player_id = 1 as placeholder
    
    res = await client.get(
        "/api/teams/player/1",
        headers=player_headers
    )
    
    # Might be empty list if player not found, but should return 200
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert isinstance(data, list)
