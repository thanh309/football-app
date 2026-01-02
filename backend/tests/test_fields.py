import pytest
from httpx import AsyncClient
from fastapi import status

@pytest.mark.asyncio
async def test_create_field(client: AsyncClient):
    """Test creating a new field."""
    # Auth
    reg_payload = {"username": "fieldowner", "email": "owner@example.com", "password": "pass", "roles": ["FieldOwner"]}
    reg_response = await client.post("/api/auth/register", json=reg_payload)
    token = reg_response.json()["accessToken"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create Field
    payload = {
        "fieldName": "Test Field",
        "description": "A good field",
        "location": "Field City",
        "latitude": 10.5,
        "longitude": 20.5,
        "defaultPricePerHour": 100.0,
        "capacity": 14
    }
    response = await client.post("/api/fields", json=payload, headers=headers)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["fieldName"] == payload["fieldName"]
    assert data["ownerId"] is not None

@pytest.mark.asyncio
async def test_get_my_fields(client: AsyncClient):
    """Test getting fields for current user."""
    # Auth
    reg_payload = {"username": "fieldowner2", "email": "owner2@example.com", "password": "pass", "roles": ["FieldOwner"]}
    reg_response = await client.post("/api/auth/register", json=reg_payload)
    token = reg_response.json()["accessToken"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create Field
    payload = {
        "fieldName": "My Field",
        "description": "My private field",
        "location": "Private City",
        "latitude": 11.0,
        "longitude": 21.0,
        "defaultPricePerHour": 150.0,
        "capacity": 10
    }
    await client.post("/api/fields", json=payload, headers=headers)
    
    # Get My Fields
    response = await client.get("/api/fields/my-fields", headers=headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 1
    assert data[0]["fieldName"] == "My Field"
