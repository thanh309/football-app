import pytest
from httpx import AsyncClient
from fastapi import status
import uuid

@pytest.mark.asyncio
async def test_get_my_profile(client: AsyncClient, player_headers):
    """Test getting current user's player profile."""
    # Get Profile (automatically created on register)
    response = await client.get("/api/players/profile", headers=player_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["displayName"] is not None

@pytest.mark.asyncio
async def test_update_profile(client: AsyncClient, player_headers):
    """Test updating player profile."""
    # Update Profile
    payload = {
        "displayName": "Star Player",
        "bio": "I love football",
        "position": "Forward",
        "skillLevel": 8
    }
    response = await client.put("/api/players/profile", json=payload, headers=player_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["displayName"] == "Star Player"
    assert data["bio"] == "I love football"

@pytest.mark.asyncio
async def test_get_player_by_id(client: AsyncClient, create_auth_headers):
    """Test get player by id (public)."""
    # Create target player
    target_headers = await create_auth_headers("target_player")
    # Get their profile to find ID
    me_res = await client.get("/api/players/profile", headers=target_headers)
    target_id = me_res.json()["playerId"]
    
    # Viewer
    viewer_headers = await create_auth_headers("viewer")
    
    response = await client.get(f"/api/players/{target_id}", headers=viewer_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["playerId"] == target_id
