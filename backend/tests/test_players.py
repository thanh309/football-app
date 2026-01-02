import pytest
from httpx import AsyncClient
from fastapi import status

@pytest.mark.asyncio
async def test_get_my_profile(client: AsyncClient):
    """Test getting current user's player profile."""
    # Auth
    reg_payload = {"username": "player1", "email": "player1@example.com", "password": "pass", "roles": ["Player"]}
    reg_response = await client.post("/api/auth/register", json=reg_payload)
    token = reg_response.json()["accessToken"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get Profile (automatically created on register)
    response = await client.get("/api/players/profile", headers=headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["displayName"] == "player1"

@pytest.mark.asyncio
async def test_update_profile(client: AsyncClient):
    """Test updating player profile."""
    # Auth
    reg_payload = {"username": "player2", "email": "player2@example.com", "password": "pass", "roles": ["Player"]}
    reg_response = await client.post("/api/auth/register", json=reg_payload)
    token = reg_response.json()["accessToken"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Update Profile
    payload = {
        "displayName": "Star Player",
        "bio": "I love football",
        "position": "Forward",
        "skillLevel": 8
    }
    response = await client.put("/api/players/profile", json=payload, headers=headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["displayName"] == "Star Player"
    assert data["bio"] == "I love football"
