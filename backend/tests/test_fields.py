import pytest
from httpx import AsyncClient
from fastapi import status

@pytest.mark.asyncio
async def test_create_field(client: AsyncClient, owner_headers):
    """Test creating a new field."""
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
    response = await client.post("/api/fields", json=payload, headers=owner_headers)
    
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["fieldName"] == payload["fieldName"]
    assert data["ownerId"] is not None

@pytest.mark.asyncio
async def test_get_my_fields(client: AsyncClient, owner_headers, test_field):
    """Test getting fields for current user."""
    # test_field fixture creates a field for owner_headers user
    
    # Get My Fields
    response = await client.get("/api/fields/my-fields", headers=owner_headers)
    
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) >= 1
    assert data[0]["fieldName"] == test_field["fieldName"]
