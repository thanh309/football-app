"""
Tests for notification preferences and search owners endpoints.
"""
import pytest
from httpx import AsyncClient
from fastapi import status


@pytest.mark.asyncio
async def test_get_notification_preferences(client: AsyncClient, player_headers):
    """Test getting notification preferences."""
    res = await client.get(
        "/api/notifications/preferences",
        headers=player_headers
    )
    
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert "preferenceId" in data
    assert "emailNotifications" in data


@pytest.mark.asyncio
async def test_update_notification_preferences(client: AsyncClient, player_headers):
    """Test updating notification preferences."""
    res = await client.put(
        "/api/notifications/preferences",
        json={
            "emailNotifications": False,
            "pushNotifications": True,
            "matchReminders": True
        },
        headers=player_headers
    )
    
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert data["emailNotifications"] == False
    assert data["pushNotifications"] == True


@pytest.mark.asyncio
async def test_search_owners(client: AsyncClient):
    """Test searching for field owners."""
    res = await client.get("/api/search/owners")
    
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert isinstance(data, list)
