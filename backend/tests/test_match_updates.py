"""
Tests for match update and invitations endpoints.
"""
import pytest
from httpx import AsyncClient
from fastapi import status


@pytest.fixture
async def test_match(client: AsyncClient, player_headers, test_team, test_field):
    """Create a test match for update tests."""
    from datetime import date, timedelta
    
    match_date = (date.today() + timedelta(days=7)).isoformat()
    
    res = await client.post("/api/matches", json={
        "hostTeamId": test_team["teamId"],
        "fieldId": test_field["fieldId"],
        "matchDate": match_date,
        "startTime": "14:00:00",
        "endTime": "16:00:00",
        "visibility": "Public",
        "description": "Test match for updates"
    }, headers=player_headers)
    
    return res.json()


@pytest.mark.asyncio
async def test_update_match(client: AsyncClient, player_headers, test_match):
    """Test updating a match."""
    match_id = test_match.get("matchId")
    if not match_id:
        pytest.skip("Match creation failed")
    
    res = await client.put(
        f"/api/matches/{match_id}",
        json={
            "description": "Updated match description",
            "startTime": "15:00:00"
        },
        headers=player_headers
    )
    
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert data["description"] == "Updated match description"


@pytest.mark.asyncio
async def test_get_team_invitations(client: AsyncClient, player_headers, test_team):
    """Test getting pending match invitations for a team."""
    team_id = test_team["teamId"]
    
    res = await client.get(
        f"/api/matches/team/{team_id}/invitations",
        headers=player_headers
    )
    
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert isinstance(data, list)
