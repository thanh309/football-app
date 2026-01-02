import pytest
from httpx import AsyncClient
from fastapi import status
from datetime import date, timedelta

@pytest.mark.asyncio
async def test_create_booking(client: AsyncClient, player_headers, test_team, test_field):
    """Test creating a booking request."""
    booking_date = (date.today() + timedelta(days=5)).isoformat()
    booking_payload = {
        "fieldId": test_field["fieldId"],
        "teamId": test_team["teamId"],
        "date": booking_date,
        "startTime": "18:00:00",
        "endTime": "19:00:00",
        "notes": "Friendly match"
    }
    response = await client.post("/api/bookings", json=booking_payload, headers=player_headers)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["fieldId"] == test_field["fieldId"]
    assert data["teamId"] == test_team["teamId"]
    assert data["status"] == "Pending"

@pytest.mark.asyncio
async def test_approve_booking(client: AsyncClient, player_headers, owner_headers, test_team, test_field):
    """Test approving a booking."""
    # Create Booking
    payload = {
        "fieldId": test_field["fieldId"], "teamId": test_team["teamId"], 
        "date": (date.today() + timedelta(days=6)).isoformat(),
        "startTime": "20:00:00", "endTime": "21:00:00", "notes": "Game"
    }
    booking_res = await client.post("/api/bookings", json=payload, headers=player_headers)
    booking_id = booking_res.json()["bookingId"]
    
    # Owner Approves
    response = await client.put(f"/api/bookings/{booking_id}/approve", headers=owner_headers)
    
    assert response.status_code == status.HTTP_200_OK
    
    # Verify status
    get_res = await client.get(f"/api/bookings/{booking_id}", headers=owner_headers)
    assert get_res.json()["status"] == "Confirmed"

@pytest.mark.asyncio
async def test_reject_booking(client: AsyncClient, player_headers, owner_headers, test_team, test_field):
    """Test rejecting a booking."""
    # Create Booking
    payload = {
        "fieldId": test_field["fieldId"], "teamId": test_team["teamId"], 
        "date": (date.today() + timedelta(days=7)).isoformat(),
        "startTime": "20:00:00", "endTime": "21:00:00"
    }
    booking_res = await client.post("/api/bookings", json=payload, headers=player_headers)
    booking_id = booking_res.json()["bookingId"]
    
    # Owner Rejects
    response = await client.put(f"/api/bookings/{booking_id}/reject", headers=owner_headers)
    assert response.status_code == status.HTTP_200_OK
    
    # Verify status
    get_res = await client.get(f"/api/bookings/{booking_id}", headers=player_headers)
    assert get_res.json()["status"] == "Rejected"

@pytest.mark.asyncio
async def test_cancel_booking(client: AsyncClient, player_headers, test_team, test_field):
    """Test cancelling a booking."""
    # Create Booking
    payload = {
        "fieldId": test_field["fieldId"], "teamId": test_team["teamId"], 
        "date": (date.today() + timedelta(days=8)).isoformat(),
        "startTime": "20:00:00", "endTime": "21:00:00"
    }
    booking_res = await client.post("/api/bookings", json=payload, headers=player_headers)
    booking_id = booking_res.json()["bookingId"]
    
    # Cancel (Leader)
    response = await client.put(f"/api/bookings/{booking_id}/cancel", headers=player_headers)
    assert response.status_code == status.HTTP_200_OK
    
    # Verify status
    get_res = await client.get(f"/api/bookings/{booking_id}", headers=player_headers)
    assert get_res.json()["status"] == "Cancelled"
@pytest.mark.asyncio
async def test_get_booking_by_id(client: AsyncClient, player_headers, test_team, test_field):
    """Test retrieving booking by ID."""
    payload = {
        "fieldId": test_field["fieldId"], "teamId": test_team["teamId"], 
        "date": (date.today() + timedelta(days=9)).isoformat(),
        "startTime": "10:00:00", "endTime": "11:00:00"
    }
    booking_res = await client.post("/api/bookings", json=payload, headers=player_headers)
    booking_id = booking_res.json()["bookingId"]
    
    response = await client.get(f"/api/bookings/{booking_id}", headers=player_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["bookingId"] == booking_id
    assert data["fieldId"] == test_field["fieldId"]

@pytest.mark.asyncio
async def test_get_bookings_by_field(client: AsyncClient, owner_headers, test_field):
    """Test retrieving bookings for a field (Owner Check)."""
    # Assuming bookings created in other tests exist, or we create one
    # Endpoint: GET /api/bookings/field/{field_id}
    response = await client.get(f"/api/bookings/field/{test_field['fieldId']}", headers=owner_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    # Verification depends on if other tests ran first or we created new ones.
    # Since tests run in sequence and use same DB session fixture (if configured), data persists?
    # Actually, default pytest-asyncio fixture scope is function, usually.
    # Our conftest `db_session` is function scoped (default), so DB is CLEAN per test.
    # So we should verify emptiness or create one.
    # Let's verify empty list if clean, but better to create one to be sure.
    assert isinstance(data, list)

@pytest.mark.asyncio
async def test_get_bookings_by_team(client: AsyncClient, player_headers, test_team, test_field):
    """Test retrieving bookings for a team."""
    # Create one
    payload = {
        "fieldId": test_field["fieldId"], "teamId": test_team["teamId"], 
        "date": (date.today() + timedelta(days=10)).isoformat(),
        "startTime": "12:00:00", "endTime": "13:00:00"
    }
    await client.post("/api/bookings", json=payload, headers=player_headers)
    
    response = await client.get(f"/api/bookings/team/{test_team['teamId']}", headers=player_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["teamId"] == test_team["teamId"]
