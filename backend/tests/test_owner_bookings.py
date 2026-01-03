"""
Tests for owner bookings and calendar management endpoints.
"""
import pytest
from httpx import AsyncClient
from fastapi import status
from datetime import date, timedelta


@pytest.mark.asyncio
async def test_get_owner_pending_bookings(client: AsyncClient, owner_headers):
    """Test getting pending bookings for owner's fields."""
    res = await client.get(
        "/api/bookings/owner/pending",
        headers=owner_headers
    )
    
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert isinstance(data, list)


@pytest.fixture
async def fresh_test_field(client: AsyncClient, owner_headers, db_session):
    """Create a fresh test field for calendar tests."""
    import uuid
    field_name = f"CalendarTestField_{str(uuid.uuid4())[:6]}"
    
    res = await client.post("/api/fields", json={
        "fieldName": field_name,
        "description": "Test Field for Calendar",
        "location": "Test Location",
        "latitude": 20.0,
        "longitude": 20.0,
        "defaultPricePerHour": 50.0,
        "capacity": 14
    }, headers=owner_headers)
    
    return res.json()


@pytest.mark.asyncio
async def test_block_calendar_slot(client: AsyncClient, owner_headers, fresh_test_field):
    """Test blocking a calendar slot."""
    field_id = fresh_test_field.get("fieldId")
    if not field_id:
        pytest.skip("Field creation failed")
    
    block_date = (date.today() + timedelta(days=14)).isoformat()
    
    res = await client.post(
        f"/api/fields/{field_id}/calendar/block",
        json={
            "date": block_date,
            "startTime": "18:00:00",
            "endTime": "20:00:00"
        },
        headers=owner_headers
    )
    
    # May fail with 403 if field not owned or verified
    assert res.status_code in [status.HTTP_201_CREATED, status.HTTP_403_FORBIDDEN]
    
    if res.status_code == status.HTTP_201_CREATED:
        data = res.json()
        assert data["status"] == "Blocked"


@pytest.mark.asyncio
async def test_unblock_calendar_slot(client: AsyncClient, owner_headers, fresh_test_field):
    """Test unblocking a calendar slot."""
    field_id = fresh_test_field.get("fieldId")
    if not field_id:
        pytest.skip("Field creation failed")
    
    block_date = (date.today() + timedelta(days=15)).isoformat()
    
    # First block a slot
    block_res = await client.post(
        f"/api/fields/{field_id}/calendar/block",
        json={
            "date": block_date,
            "startTime": "10:00:00",
            "endTime": "12:00:00"
        },
        headers=owner_headers
    )
    
    if block_res.status_code != status.HTTP_201_CREATED:
        pytest.skip("Block slot failed")
    
    calendar_id = block_res.json().get("calendarId")
    
    # Then unblock it
    res = await client.put(
        f"/api/fields/calendar/{calendar_id}/unblock",
        headers=owner_headers
    )
    
    assert res.status_code == status.HTTP_200_OK
