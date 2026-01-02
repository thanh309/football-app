import pytest
from httpx import AsyncClient
from fastapi import status
from datetime import date, timedelta

@pytest.mark.asyncio
async def test_create_match(client: AsyncClient):
    """Test creating a match."""
    # Leader & Team
    leader_res = await client.post("/api/auth/register", json={"username": "m_leader", "email": "m@e.com", "password": "p", "roles": ["Player"]})
    leader_headers = {"Authorization": f"Bearer {leader_res.json()['accessToken']}"}
    team_res = await client.post("/api/teams", json={"teamName": "Match FC", "description": "D", "logoUrl": "U", "location": "L", "latitude": 0, "longitude": 0}, headers=leader_headers)
    team_id = team_res.json()["teamId"]
    
    # Using field from a new owner to be safe
    owner_res = await client.post("/api/auth/register", json={"username": "m_owner", "email": "mo@e.com", "password": "p", "roles": ["FieldOwner"]})
    field_res = await client.post("/api/fields", json={"fieldName": "MF", "description": "D", "location": "L", "latitude": 0, "longitude": 0, "defaultPricePerHour": 10, "capacity": 10}, headers={"Authorization": f"Bearer {owner_res.json()['accessToken']}"})
    field_id = field_res.json()["fieldId"]

    # Create Match
    match_payload = {
        "hostTeamId": team_id,
        "matchDate": (date.today() + timedelta(days=7)).isoformat(),
        "startTime": "10:00:00",
        "fieldId": field_id,
        "visibility": "Public",
        "description": "Friendly match"
    }
    response = await client.post("/api/matches", json=match_payload, headers=leader_headers)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["hostTeamId"] == team_id
    assert data["status"] == "Scheduled"

@pytest.mark.asyncio
async def test_send_invitation(client: AsyncClient):
    """Test sending a match invitation."""
    # Host Leader
    h_leader_res = await client.post("/api/auth/register", json={"username": "h_leader", "email": "h@e.com", "password": "p", "roles": ["Player"]})
    h_headers = {"Authorization": f"Bearer {h_leader_res.json()['accessToken']}"}
    h_team_res = await client.post("/api/teams", json={"teamName": "Host FC", "description": "D", "logoUrl": "U", "location": "L", "latitude": 0, "longitude": 0}, headers=h_headers)
    h_team_id = h_team_res.json()["teamId"]

    # Guest Leader
    g_leader_res = await client.post("/api/auth/register", json={"username": "g_leader", "email": "g@e.com", "password": "p", "roles": ["Player"]})
    g_headers = {"Authorization": f"Bearer {g_leader_res.json()['accessToken']}"}
    g_team_res = await client.post("/api/teams", json={"teamName": "Guest FC", "description": "D", "logoUrl": "U", "location": "L", "latitude": 0, "longitude": 0}, headers=g_headers)
    g_team_id = g_team_res.json()["teamId"]
    
    # Create Match
    match_res = await client.post("/api/matches", json={
        "hostTeamId": h_team_id,
        "matchDate": (date.today() + timedelta(days=8)).isoformat(),
        "startTime": "15:00:00",
        "fieldId": 1, # Mock field ID since validation might be lax or we assume it exists? Actually field_id FK checks might fail if strict.
        # But wait, create_match checks field_id? No, service usually just stores it unless validation logic exists.
        # Reading match_controller, it delegates to service. Service might check.
        # Let's create a dummy field to be safe.
        "visibility": "Public", "description": "Inviting"
    }, headers=h_headers)
    
    # If match creation fails due to field, we need a field.
    # Let's check logic: Service calls match_repo.create.
    # We should probably create a field properly.
    if match_res.status_code != 201:
         # Create field first
         o_res = await client.post("/api/auth/register", json={"username": "temp_o", "email": "t@e.com", "password": "p", "roles": ["FieldOwner"]})
         f_res = await client.post("/api/fields", json={"fieldName": "TF", "description": "D", "location": "L", "latitude": 0, "longitude": 0, "defaultPricePerHour": 10, "capacity": 10}, headers={"Authorization": f"Bearer {o_res.json()['accessToken']}"})
         field_id = f_res.json()["fieldId"]
         
         match_res = await client.post("/api/matches", json={
            "hostTeamId": h_team_id,
            "matchDate": (date.today() + timedelta(days=8)).isoformat(),
            "startTime": "15:00:00",
            "fieldId": field_id,
            "visibility": "Public", "description": "Inviting"
        }, headers=h_headers)

    match_id = match_res.json()["matchId"]

    # Send Invitation
    inv_payload = {
        "invitedTeamId": g_team_id,
        "message": "Join us!"
    }
    response = await client.post(f"/api/matches/{match_id}/invitations", json=inv_payload, headers=h_headers)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["invitedTeamId"] == g_team_id
    assert data["status"] == "Pending"
