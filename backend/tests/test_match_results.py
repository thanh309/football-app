"""
Tests for match result endpoints.
"""
import pytest
from httpx import AsyncClient
from fastapi import status


@pytest.fixture
async def test_match(client: AsyncClient, player_headers, test_team, test_field):
    """Create a test match for result tests."""
    from datetime import date, timedelta
    
    match_date = (date.today() + timedelta(days=7)).isoformat()
    
    res = await client.post("/api/matches", json={
        "hostTeamId": test_team["teamId"],
        "fieldId": test_field["fieldId"],
        "matchDate": match_date,
        "startTime": "10:00:00",
        "endTime": "12:00:00",
        "visibility": "Public",
        "description": "Test match for results"
    }, headers=player_headers)
    
    return res.json()


@pytest.mark.asyncio
async def test_record_match_result(client: AsyncClient, player_headers, test_match):
    """Test recording a match result."""
    match_id = test_match.get("matchId")
    if not match_id:
        pytest.skip("Match creation failed")
    
    res = await client.post(
        f"/api/matches/{match_id}/result",
        json={
            "homeScore": 3,
            "awayScore": 1,
            "notes": "Great match!"
        },
        headers=player_headers
    )
    
    assert res.status_code == status.HTTP_201_CREATED
    data = res.json()
    assert data["homeScore"] == 3
    assert data["awayScore"] == 1


@pytest.mark.asyncio
async def test_get_match_result(client: AsyncClient, player_headers, test_match):
    """Test getting a match result."""
    match_id = test_match.get("matchId")
    if not match_id:
        pytest.skip("Match creation failed")
    
    # First record a result
    await client.post(
        f"/api/matches/{match_id}/result",
        json={"homeScore": 2, "awayScore": 2},
        headers=player_headers
    )
    
    # Then get it
    res = await client.get(
        f"/api/matches/{match_id}/result",
        headers=player_headers
    )
    
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert "homeScore" in data
    assert "awayScore" in data


@pytest.mark.asyncio
async def test_record_result_already_exists(client: AsyncClient, player_headers, test_match):
    """Test recording result when one already exists."""
    match_id = test_match.get("matchId")
    if not match_id:
        pytest.skip("Match creation failed")
    
    # Record first result
    await client.post(
        f"/api/matches/{match_id}/result",
        json={"homeScore": 1, "awayScore": 0},
        headers=player_headers
    )
    
    # Try to record another - should fail
    res = await client.post(
        f"/api/matches/{match_id}/result",
        json={"homeScore": 2, "awayScore": 1},
        headers=player_headers
    )
    
    assert res.status_code == status.HTTP_400_BAD_REQUEST
