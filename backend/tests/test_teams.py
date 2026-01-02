import pytest
from httpx import AsyncClient
from fastapi import status

@pytest.mark.asyncio
async def test_create_team(client: AsyncClient):
    """Test creating a new team."""
    # Auth
    reg_payload = {"username": "teamleader", "email": "leader@example.com", "password": "pass", "roles": ["Player"]}
    reg_response = await client.post("/api/auth/register", json=reg_payload)
    token = reg_response.json()["accessToken"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create Team
    payload = {
        "teamName": "Test FC",
        "description": "A test team",
        "logoUrl": "http://example.com/logo.png",
        "location": "Test City",
        "latitude": 10.0,
        "longitude": 20.0
    }
    response = await client.post("/api/teams", json=payload, headers=headers)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["teamName"] == payload["teamName"]
    assert data["leaderId"] is not None


@pytest.mark.asyncio
async def test_get_my_teams(client: AsyncClient):
    """Test getting teams for current user."""
    # Auth
    reg_payload = {"username": "teamleader2", "email": "leader2@example.com", "password": "pass", "roles": ["Player"]}
    reg_response = await client.post("/api/auth/register", json=reg_payload)
    token = reg_response.json()["accessToken"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create Team
    payload = {
        "teamName": "My Team",
        "description": "My test team",
        "logoUrl": "http://example.com/logo.png",
        "location": "Test City",
        "latitude": 10.0,
        "longitude": 20.0
    }
    await client.post("/api/teams", json=payload, headers=headers)
    
    # Get My Teams
    response = await client.get("/api/teams/my-teams", headers=headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 1
    assert data[0]["teamName"] == "My Team"

@pytest.mark.asyncio
async def test_update_team(client: AsyncClient):
    """Test updating a team."""
    # Auth
    reg_payload = {"username": "teamleader3", "email": "leader3@example.com", "password": "pass", "roles": ["Player"]}
    reg_response = await client.post("/api/auth/register", json=reg_payload)
    token = reg_response.json()["accessToken"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create Team
    create_payload = {
        "teamName": "Update FC",
        "description": "Before update",
        "logoUrl": "http://example.com/logo.png",
        "location": "Test City",
        "latitude": 10.0,
        "longitude": 20.0
    }
    create_res = await client.post("/api/teams", json=create_payload, headers=headers)
    team_id = create_res.json()["teamId"]
    
    # Update Team
    update_payload = {
        "teamName": "Updated FC",
        "description": "After update"
    }
    response = await client.put(f"/api/teams/{team_id}", json=update_payload, headers=headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["teamName"] == "Updated FC"
    assert data["description"] == "After update"
