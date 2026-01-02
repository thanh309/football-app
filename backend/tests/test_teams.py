import pytest
from httpx import AsyncClient
from fastapi import status

@pytest.mark.asyncio
async def test_create_team(client: AsyncClient, player_headers):
    """Test creating a new team."""
    # Create Team
    payload = {
        "teamName": "Test FC",
        "description": "A test team",
        "logoUrl": "http://example.com/logo.png",
        "location": "Test City",
        "latitude": 10.0,
        "longitude": 20.0
    }
    response = await client.post("/api/teams", json=payload, headers=player_headers)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["teamName"] == payload["teamName"]
    assert data["leaderId"] is not None


@pytest.mark.asyncio
async def test_get_my_teams(client: AsyncClient, player_headers, test_team):
    """Test getting teams for current user."""
    # test_team fixture creates a team for player_headers user
    
    # Get My Teams
    response = await client.get("/api/teams/my-teams", headers=player_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 1
    assert data[0]["teamName"] == test_team["teamName"]

@pytest.mark.asyncio
async def test_update_team(client: AsyncClient, player_headers, test_team):
    """Test updating a team."""
    team_id = test_team["teamId"]
    
    # Update Team
    update_payload = {
        "teamName": "Updated FC",
        "description": "After update"
    }
    response = await client.put(f"/api/teams/{team_id}", json=update_payload, headers=player_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["teamName"] == "Updated FC"
    assert data["description"] == "After update"

@pytest.mark.asyncio
async def test_delete_team(client: AsyncClient, player_headers, test_team):
    """Test deleting a team."""
    team_id = test_team["teamId"]
    
    response = await client.delete(f"/api/teams/{team_id}", headers=player_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == "Team deleted"
    
    # Verify it's gone
    get_res = await client.get(f"/api/teams/{team_id}", headers=player_headers)
    assert get_res.status_code == status.HTTP_404_NOT_FOUND

@pytest.mark.asyncio
async def test_join_request_flow(client: AsyncClient, player_headers, test_team, create_auth_headers):
    """Test requesting to join a team and acceptance."""
    team_id = test_team["teamId"]
    
    # Create Applicant
    applicant_headers = await create_auth_headers("applicant", "Player")
    
    # 1. Request to Join
    payload = {"message": "Let me in!"}
    req_res = await client.post(f"/api/teams/{team_id}/join-requests", json=payload, headers=applicant_headers)
    assert req_res.status_code == status.HTTP_201_CREATED
    req_id = req_res.json()["requestId"]
    assert req_res.json()["status"] == "Pending"
    
    # 2. Leader checks requests
    list_res = await client.get(f"/api/teams/{team_id}/join-requests", headers=player_headers)
    assert list_res.status_code == status.HTTP_200_OK
    requests = list_res.json()
    assert len(requests) >= 1
    assert any(r["requestId"] == req_id for r in requests)
    
    # 3. Leader accepts request
    action_res = await client.put(f"/api/teams/join-requests/{req_id}/accept", headers=player_headers)
    assert action_res.status_code == status.HTTP_200_OK
    assert action_res.json()["message"] == "Request accepted"
    
    # 4. Verify request status is Accepted (via list or DB? API might filter processed ones?)
    # The controller returns pending requests only: get_pending_requests
    # So it should disappear from the list
    list_res_after = await client.get(f"/api/teams/{team_id}/join-requests", headers=player_headers)
    requests_after = list_res_after.json()
    assert not any(r["requestId"] == req_id for r in requests_after)
