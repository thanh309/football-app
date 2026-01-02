import pytest
from httpx import AsyncClient
from fastapi import status
from datetime import date, timedelta

@pytest.mark.asyncio
async def test_create_booking(client: AsyncClient):
    """Test creating a booking request."""
    # 1. Register Field Owner and Create Field
    owner_payload = {"username": "b_owner", "email": "b_owner@example.com", "password": "pass", "roles": ["FieldOwner"]}
    owner_res = await client.post("/api/auth/register", json=owner_payload)
    owner_token = owner_res.json()["accessToken"]
    owner_headers = {"Authorization": f"Bearer {owner_token}"}
    
    field_payload = {
        "fieldName": "Booking Field", "description": "Desc", "location": "Loc", 
        "latitude": 1.0, "longitude": 1.0, "defaultPricePerHour": 50.0, "capacity": 10
    }
    field_res = await client.post("/api/fields", json=field_payload, headers=owner_headers)
    field_id = field_res.json()["fieldId"]
    
    # 2. Register Team Leader and Create Team
    leader_payload = {"username": "b_leader", "email": "b_leader@example.com", "password": "pass", "roles": ["Player"]}
    leader_res = await client.post("/api/auth/register", json=leader_payload)
    leader_token = leader_res.json()["accessToken"]
    leader_headers = {"Authorization": f"Bearer {leader_token}"}
    
    team_payload = {
        "teamName": "Booking Team", "description": "Desc", "logoUrl": "http://img", 
        "location": "Loc", "latitude": 1.0, "longitude": 1.0
    }
    team_res = await client.post("/api/teams", json=team_payload, headers=leader_headers)
    team_id = team_res.json()["teamId"]
    
    # 3. Create Booking
    booking_date = (date.today() + timedelta(days=5)).isoformat()
    booking_payload = {
        "fieldId": field_id,
        "teamId": team_id,
        "date": booking_date,
        "startTime": "18:00:00",
        "endTime": "19:00:00",
        "notes": "Friendly match"
    }
    response = await client.post("/api/bookings", json=booking_payload, headers=leader_headers)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["fieldId"] == field_id
    assert data["teamId"] == team_id
    assert data["status"] == "Pending"

@pytest.mark.asyncio
async def test_approve_booking(client: AsyncClient):
    """Test approving a booking."""
    # Setup as above (simplified for brevity, realistically fixtures would help but explicit steps ensure flow)
    # Owner
    owner_res = await client.post("/api/auth/register", json={"username": "b_owner2", "email": "b2@e.com", "password": "p", "roles": ["FieldOwner"]})
    owner_token = owner_res.json()["accessToken"]
    owner_headers = {"Authorization": f"Bearer {owner_token}"}
    field_res = await client.post("/api/fields", json={"fieldName": "F2", "description": "D", "location": "L", "latitude": 0, "longitude": 0, "defaultPricePerHour": 10, "capacity": 10}, headers=owner_headers)
    field_id = field_res.json()["fieldId"]
    
    # Leader
    leader_res = await client.post("/api/auth/register", json={"username": "b_leader2", "email": "l2@e.com", "password": "p", "roles": ["Player"]})
    leader_headers = {"Authorization": f"Bearer {leader_res.json()['accessToken']}"}
    team_res = await client.post("/api/teams", json={"teamName": "T2", "description": "D", "logoUrl": "U", "location": "L", "latitude": 0, "longitude": 0}, headers=leader_headers)
    team_id = team_res.json()["teamId"]
    
    # Booking
    booking_payload = {
        "fieldId": field_id, "teamId": team_id, "date": (date.today() + timedelta(days=6)).isoformat(),
        "startTime": "20:00:00", "endTime": "21:00:00", "notes": "Game"
    }
    booking_res = await client.post("/api/bookings", json=booking_payload, headers=leader_headers)
    booking_id = booking_res.json()["bookingId"]
    
    # Owner Approves
    response = await client.put(f"/api/bookings/{booking_id}/approve", headers=owner_headers)
    
    assert response.status_code == status.HTTP_200_OK
    
    # Verify status
    get_res = await client.get(f"/api/bookings/{booking_id}", headers=leader_headers)
    assert get_res.json()["status"] == "Confirmed"
