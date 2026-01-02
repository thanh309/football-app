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
    get_res = await client.get(f"/api/bookings/{booking_id}", headers=leader_headers if 'leader_headers' in locals() else player_headers)
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
