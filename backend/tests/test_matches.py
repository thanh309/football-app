import pytest
from httpx import AsyncClient
from fastapi import status
from datetime import date, timedelta
import uuid

@pytest.mark.asyncio
async def test_create_match(client: AsyncClient, player_headers, test_team, test_field):
    """Test creating a match."""
    match_payload = {
        "hostTeamId": test_team["teamId"],
        "matchDate": (date.today() + timedelta(days=7)).isoformat(),
        "startTime": "10:00:00",
        "fieldId": test_field["fieldId"],
        "visibility": "Public",
        "description": "Friendly match"
    }
    response = await client.post("/api/matches", json=match_payload, headers=player_headers)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["hostTeamId"] == test_team["teamId"]
    assert data["status"] == "Scheduled"

@pytest.mark.asyncio
async def test_send_invitation(client: AsyncClient, player_headers, test_team, test_field, create_auth_headers):
    """Test sending a match invitation."""
    # Host: player_headers, test_team
    
    # Guest
    guest_headers = await create_auth_headers("guest")
    g_team_res = await client.post("/api/teams", json={
        "teamName": f"Guest FC {str(uuid.uuid4())[:6]}",
        "description": "Guest team", "logoUrl": "U", "location": "L", "latitude": 0, "longitude": 0
    }, headers=guest_headers)
    g_team_id = g_team_res.json()["teamId"]
    
    # Create Match
    match_payload = {
        "hostTeamId": test_team["teamId"],
        "matchDate": (date.today() + timedelta(days=8)).isoformat(),
        "startTime": "15:00:00",
        "fieldId": test_field["fieldId"],
        "visibility": "Public", "description": "Inviting"
    }
    match_res = await client.post("/api/matches", json=match_payload, headers=player_headers)
    match_id = match_res.json()["matchId"]

    # Send Invitation
    inv_payload = {
        "invitedTeamId": g_team_id,
        "message": "Join us!"
    }
    response = await client.post(f"/api/matches/{match_id}/invitations", json=inv_payload, headers=player_headers)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["invitedTeamId"] == g_team_id
    assert data["status"] == "Pending"

@pytest.mark.asyncio
async def test_cancel_match(client: AsyncClient, player_headers, test_team, test_field):
    """Test cancelling a match."""
    match_payload = {
        "hostTeamId": test_team["teamId"],
        "matchDate": (date.today() + timedelta(days=9)).isoformat(),
        "startTime": "12:00:00",
        "fieldId": test_field["fieldId"],
        "visibility": "Public",
        "description": "To be cancelled"
    }
    match_res = await client.post("/api/matches", json=match_payload, headers=player_headers)
    match_id = match_res.json()["matchId"]
    
    # Cancel
    response = await client.put(f"/api/matches/{match_id}/cancel", headers=player_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] == "Match cancelled"
    
    # Verify status
    get_res = await client.get(f"/api/matches/{match_id}", headers=player_headers)
    assert get_res.json()["status"] == "Cancelled"
