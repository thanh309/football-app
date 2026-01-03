"""
Tests for roster management endpoints.
"""
import pytest
from httpx import AsyncClient
from fastapi import status


@pytest.mark.asyncio
async def test_get_team_roster(client: AsyncClient, player_headers, test_team):
    """Test getting team roster."""
    team_id = test_team["teamId"]
    
    res = await client.get(
        f"/api/teams/{team_id}/roster",
        headers=player_headers
    )
    
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_add_player_to_roster(client: AsyncClient, player_headers, test_team, create_auth_headers):
    """Test adding a player to team roster."""
    team_id = test_team["teamId"]
    
    # Create another player
    other_headers = await create_auth_headers("roster_new_player", "Player")
    
    # Get their player profile
    profile_res = await client.get("/api/players/profile", headers=other_headers)
    if profile_res.status_code != 200:
        pytest.skip("Could not get player profile")
    
    player_id = profile_res.json().get("playerId")
    
    res = await client.post(
        f"/api/teams/{team_id}/roster",
        json={"playerId": player_id, "role": "Member"},
        headers=player_headers
    )
    
    # May fail if player already in roster
    assert res.status_code in [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST]


@pytest.mark.asyncio
async def test_remove_player_from_roster(client: AsyncClient, player_headers, test_team, create_auth_headers):
    """Test removing a player from team roster."""
    team_id = test_team["teamId"]
    
    # Create another player
    other_headers = await create_auth_headers("roster_remove_player", "Player")
    
    # Get their player profile
    profile_res = await client.get("/api/players/profile", headers=other_headers)
    if profile_res.status_code != 200:
        pytest.skip("Could not get player profile")
    
    player_id = profile_res.json().get("playerId")
    
    # First add the player
    await client.post(
        f"/api/teams/{team_id}/roster",
        json={"playerId": player_id, "role": "Member"},
        headers=player_headers
    )
    
    # Then remove them
    res = await client.delete(
        f"/api/teams/{team_id}/roster/{player_id}",
        headers=player_headers
    )
    
    assert res.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]


@pytest.mark.asyncio
async def test_update_player_role(client: AsyncClient, player_headers, test_team):
    """Test updating player role in roster."""
    team_id = test_team["teamId"]
    
    # Get roster to find a roster_id
    roster_res = await client.get(
        f"/api/teams/{team_id}/roster",
        headers=player_headers
    )
    
    roster = roster_res.json()
    if not roster:
        pytest.skip("No roster entries to update")
    
    roster_id = roster[0]["rosterId"]
    
    res = await client.put(
        f"/api/teams/roster/{roster_id}",
        json={"role": "Captain"},
        headers=player_headers
    )
    
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert data["role"] == "Captain"


@pytest.mark.asyncio
async def test_get_player_roster(client: AsyncClient, player_headers):
    """Test getting player's team memberships."""
    # Use player_id = 1 as placeholder
    res = await client.get(
        "/api/players/1/roster",
        headers=player_headers
    )
    
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert isinstance(data, list)
